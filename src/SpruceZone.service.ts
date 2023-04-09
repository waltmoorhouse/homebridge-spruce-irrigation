import {Zone, ZoneStatus} from './spruce.types'
import {CharacteristicValue, Service} from 'homebridge'
import {SpruceControllerPlatformAccessory} from './platform-accessory'

export class SpruceZone {
  private readonly valveService: Service
  private zoneInUse = false
  private readonly duration: number

  constructor(
    private readonly spruceControllerPlatformAccessory: SpruceControllerPlatformAccessory,
    readonly zoneNumber: number,
    private readonly zone: Zone
  ) {
    this.duration = this.spruceControllerPlatformAccessory.platform.config.runMinutes * 60

    this.valveService = spruceControllerPlatformAccessory.accessory.getService(zone.zone_name) ||
      this.spruceControllerPlatformAccessory.accessory
        .addService(spruceControllerPlatformAccessory.platform.Service.Valve, zone.zone_name, 'Irrigation Zone '+zoneNumber)
    this.valveService.setCharacteristic(this.spruceControllerPlatformAccessory.platform.Characteristic.Name, zone.zone_name)
    this.valveService.getCharacteristic(this.spruceControllerPlatformAccessory.platform.Characteristic.Active)
      .onGet(this.getZoneActive.bind(this))
      .onSet(this.setZoneActive.bind(this))
    this.valveService.getCharacteristic(this.spruceControllerPlatformAccessory.platform.Characteristic.InUse)
      .onGet(this.getZoneInUse.bind(this))
  }

  async getZoneActive(): Promise<CharacteristicValue> {
    return this.zoneInUse?
      this.spruceControllerPlatformAccessory.platform.Characteristic.Active.ACTIVE :
      this.spruceControllerPlatformAccessory.platform.Characteristic.Active.INACTIVE
  }

  async setZoneActive(value: CharacteristicValue): Promise<void> {
    if (value === this.spruceControllerPlatformAccessory.platform.Characteristic.Active.ACTIVE) {
      this.zoneInUse = true
      return this.spruceControllerPlatformAccessory.platform.spruceService!.turnOnZone(this.zoneNumber,
        this.duration)
    } else {
      this.zoneInUse = false
      return this.spruceControllerPlatformAccessory.platform.spruceService!.turnOffZone(this.zoneNumber)
    }
  }

  async getZoneInUse(): Promise<CharacteristicValue> {
    return this.zoneInUse ?
      this.spruceControllerPlatformAccessory.platform.Characteristic.InUse.IN_USE :
      this.spruceControllerPlatformAccessory.platform.Characteristic.InUse.NOT_IN_USE
  }

  updateStatus(zStat: ZoneStatus) {
    this.zoneInUse = zStat.zone_state === 1
    this.valveService.updateCharacteristic(this.spruceControllerPlatformAccessory.platform.Characteristic.Active,
      this.zoneInUse ?
        this.spruceControllerPlatformAccessory.platform.Characteristic.Active.ACTIVE :
        this.spruceControllerPlatformAccessory.platform.Characteristic.Active.INACTIVE)
    this.valveService.updateCharacteristic(this.spruceControllerPlatformAccessory.platform.Characteristic.InUse,
      this.zoneInUse ?
        this.spruceControllerPlatformAccessory.platform.Characteristic.InUse.IN_USE :
        this.spruceControllerPlatformAccessory.platform.Characteristic.InUse.NOT_IN_USE)
  }
}
