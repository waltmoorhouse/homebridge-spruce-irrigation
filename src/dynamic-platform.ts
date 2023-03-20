import {
  API,
  APIEvent,
  Characteristic,
  DynamicPlatformPlugin,
  Logging,
  PlatformAccessory,
  PlatformConfig,
  Service
} from 'homebridge'
import {PLATFORM_NAME, PLUGIN_NAME} from './settings'
import {SpruceControllerPlatformAccessory} from './platform-accessory'
import crypto from 'crypto'
import {SpruceService} from './spruce-service'
import {AccessoryContext, ControllerSettings} from './spruce.types'

export class SpruceIrrigationPlatform implements DynamicPlatformPlugin {
  public readonly VERSION = '1.0.3' // This should always match package.json version
  public readonly Service: typeof Service = this.api.hap.Service
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic

  readonly spruceService: SpruceService
  private cachedAccessories: PlatformAccessory[] = []
  private readonly currentControllers: Map<string, SpruceControllerPlatformAccessory> = new Map()
  private alreadyPolling = false

  constructor(
    readonly log: Logging,
    public config: PlatformConfig,
    private readonly api: API,
  ) {
    this.spruceService = new SpruceService(config.authToken, log)

    if (!config.pollSeconds || Number.isNaN(config.pollSeconds) || Number(config.pollSeconds) < 10) {
      this.config.pollSeconds = 30
    }
    if (!config.runMinutes || Number.isNaN(config.runMinutes) || Number(config.runMinutes) < 1) {
      this.config.runMinutes = 15
    }
    if (!config.lowBatteryLevel || Number.isNaN(config.lowBatteryLevel) || Number(config.lowBatteryLevel) < 2.0) {
      this.config.pollSeconds = 2.7
    }
    log.info(PLATFORM_NAME + ' finished initializing!')

    /*
     * When this event is fired, homebridge restored all cached accessories from disk and did call their respective
     * `configureAccessory` method for all of them. Dynamic Platform plugins should only register new accessories
     * after this event was fired, in order to ensure they weren't added to homebridge already.
     * This event can also be used to start discovery of new accessories.
     */
    api.on(APIEvent.DID_FINISH_LAUNCHING, () => {
      log.info(PLATFORM_NAME + ' finished launching!')
      this.discover().then(() => this.log.info('Discovery action completed'))
    })
  }

  async discover(): Promise<void> {
    this.log.info('Discovering from Spruce API')
    // Get sensors from API
    const controllers = await this.spruceService.getControllers()

    // Register Controllers not found in the cache
    controllers.forEach(device => {
      // Check to see if controllers already registered in accessories
      let found = false
      for (const accessory of this.cachedAccessories) {
        if (device.device_id === accessory.context.controller.device_id) {
          if (this.VERSION === accessory.context.version) {
            found = true
          } else {
            this.log.warn(`Old version of ${device.controller_name} was found, removing so it can be reconfigured.`)
            this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
            this.cachedAccessories = this.cachedAccessories.filter(cached => cached.UUID !== accessory.UUID)
          }
        }
      }
      if (!found) {
        this.register(device).then(() => this.log.debug('device registered'))
      }
    })

    // Configure cached controllers that are still registered, and Remove controllers that are no longer registered
    const toBeRemoved: PlatformAccessory[] = []
    this.cachedAccessories.forEach(accessory => {
      if (controllers.find(device => device.device_id === accessory.context.controller.device_id)) {
        this.log.info('The cached controller %s is still registered to this account. Configuring.',
          accessory.context.controller.controller_name)
        this.currentControllers.set(accessory.context.controller.serial_number, new SpruceControllerPlatformAccessory(this, accessory))
      } else {
        this.log.info(accessory.context.controller.controller_name +
          ' is no longer registered to this account. Removing from homebridge.')
        toBeRemoved.push(accessory)
      }
    })

    if (toBeRemoved.length > 0) {
      this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, toBeRemoved)
    }

    // We don't want to set another interval for the poller if we're already running it.
    if (!this.alreadyPolling) {
      this.alreadyPolling = true
      // poll again after configured time.
      setInterval(this.pollForNewData.bind(this), Number(this.config.pollSeconds) * 1000)
    }
  }

  private async register(controller: ControllerSettings) {
    this.log.info(`Discovered Spruce Controller: ${controller.controller_name}.`)
    const uuid = this.generate(controller.serial_number)
    // create a new accessory
    const accessory = new this.api.platformAccessory(controller.controller_name, uuid)

    // Add context to accessory
    const context = accessory.context as AccessoryContext
    context.version = this.VERSION
    context.controller = controller

    // Initialize the controller
    this.currentControllers.set(accessory.context.controller.serial_number, new SpruceControllerPlatformAccessory(this, accessory))

    // link the accessory to your platform
    this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory])
    this.log.info(`Device ${controller.controller_name} has been registered!`)
  }

  private pollForNewData() {
    this.log.info('Updating controller readings.')
    // Update device attributes
    for (const key of this.currentControllers.keys()) {
      const controller = this.currentControllers.get(key)!
      controller.pollForNewData()
    }
  }

  /*
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to set up event handlers for characteristics and update respective values.
   */
  configureAccessory(accessory: PlatformAccessory): void {
    this.log.info('Loading accessory from cache:', accessory.displayName)
    // add the restored accessory to the accessories cache, so we can track if it has already been registered
    this.cachedAccessories.push(accessory)
  }

  private generate(deviceSerialNumber: string) {
    const sha1sum = crypto.createHash('sha1')
    sha1sum.update(deviceSerialNumber)
    const s = sha1sum.digest('hex')
    let i = -1
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      i += 1
      switch (c) {
        case 'y':
          return ((parseInt('0x' + s[i], 16) & 0x3) | 0x8).toString(16)
        case 'x':
        default:
          return s[i]
      }
    })
  }
}
