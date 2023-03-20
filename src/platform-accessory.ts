import {CharacteristicValue, PlatformAccessory, PlatformAccessoryEvent} from 'homebridge'

import {SpruceIrrigationPlatform} from './dynamic-platform'
import {AccessoryContext, SensorStatus, ZoneStatus} from './spruce.types'
import {SpruceZone} from './SpruceZone.service'
import {SpruceMoistureSensorService} from './SpruceMoistureSensor.service'
import {Characteristic, Service} from 'homebridge'

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class SpruceControllerPlatformAccessory {
  public context: AccessoryContext
  private zones: SpruceZone[] = []
  private sensors: SpruceMoistureSensorService[] = []
  private masterValveService: Service

  constructor(
    readonly platform: SpruceIrrigationPlatform,
    readonly accessory: PlatformAccessory,
  ) {
    this.context = accessory.context as AccessoryContext
    const controller = this.context.controller
    // set accessory information
    const informationService = accessory.getService(this.platform.Service.AccessoryInformation)!
    informationService
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Spruce Irrigation')
      .setCharacteristic(this.platform.Characteristic.Model, controller.model_number)
      .setCharacteristic(this.platform.Characteristic.SerialNumber, controller.serial_number)
      .setCharacteristic(this.platform.Characteristic.FirmwareRevision, controller.firmware)
      .setCharacteristic(this.platform.Characteristic.ConfiguredName, controller.controller_name)

    accessory.on(PlatformAccessoryEvent.IDENTIFY, () => {
      this.platform.log.info('%s identified!', accessory.displayName)
    })

    // Master Valve Service
    this.masterValveService = accessory.getService('All Zones') ||
      this.accessory.addService(this.platform.Service.Valve, 'All Zones', 'Master Valve Service')
    this.masterValveService.setCharacteristic(this.platform.Characteristic.Name, 'All Zones')
    this.masterValveService.getCharacteristic(this.platform.Characteristic.Active)
      .onGet(this.getAnyZoneActive.bind(this))
      .onSet(this.setAllZonesActive.bind(this))
    this.masterValveService.getCharacteristic(this.platform.Characteristic.InUse)
      .onGet(this.getAnyZoneInUse.bind(this))

    // Sensors
    this.platform.spruceService.getSensorStatus(controller.device_id)
      .then(status => {
        if (status) {
          const sensorStatuses: Record<string, SensorStatus> = status
          for (const sensorId in sensorStatuses) {
            const sensorStatus = sensorStatuses[sensorId]
            this.sensors.push(new SpruceMoistureSensorService(this, sensorId, sensorStatus))
          }
        }
      })
      .catch(err => this.platform.log.error(err))

    // Zones
    for (const zoneNum in controller.zone) {
      if (controller.zone[zoneNum].zenabled === "1") {
        this.zones.push(new SpruceZone(this, Number(zoneNum), controller.zone[zoneNum]))
      }
    }
  }

  pollForNewData() {
    this.platform.spruceService.getZoneStatus(this.context.controller.device_id)
      .then(status => {
        if (status) {
          const zoneStatuses: ZoneStatus[] = status
          zoneStatuses.forEach(zStat =>
            this.zones.find(zone => zone.zoneNumber === zStat.zone)?.updateStatus(zStat)
          )
        }
      })
      .catch(err => this.platform.log.error(err))

    this.platform.spruceService.getSensorStatus(this.context.controller.device_id)
      .then(status => {
        if (status) {
          const sensorStatuses: Record<string, SensorStatus> = status
          for (const deviceId in sensorStatuses) {
            this.sensors.find(sensor => sensor.deviceId === deviceId)?.updateStatus(sensorStatuses[deviceId])
          }
        }
      })
      .catch(err => this.platform.log.error(err))
  }


  async getAnyZoneActive(): Promise<CharacteristicValue> {
    for (const zoneNum of this.zones) {
      if (this.platform.Characteristic.Active.ACTIVE === await zoneNum.getZoneActive()) {
        return this.platform.Characteristic.Active.ACTIVE
      }
    }
    return this.platform.Characteristic.Active.INACTIVE
  }

  async setAllZonesActive(value: CharacteristicValue): Promise<void> {
    if (value === this.platform.Characteristic.Active.ACTIVE) {
      return this.platform.spruceService.runAllZones(this.platform.config.runMinutes * 60)
    } else {
      return this.platform.spruceService.stopAllZones()
    }
  }

  async getAnyZoneInUse(): Promise<CharacteristicValue> {
    for (const zoneNum of this.zones) {
      if (this.platform.Characteristic.InUse.IN_USE === await zoneNum.getZoneInUse()) {
        return this.platform.Characteristic.InUse.IN_USE
      }
    }
    return this.platform.Characteristic.InUse.NOT_IN_USE
  }
}
