import {SensorStatus} from './spruce.types'
import {Service} from 'hap-nodejs/dist/lib/Service'
import {SpruceControllerPlatformAccessory} from './platform-accessory'
import {Characteristic} from 'hap-nodejs/dist/lib/Characteristic'
import {CharacteristicValue} from 'homebridge'

export class SpruceMoistureSensorService {
  private readonly temperatureService: Service
  private readonly moistureService: Service

  constructor(
    readonly spruceControllerPlatformAccessory: SpruceControllerPlatformAccessory,
    readonly deviceId: string,
    private sensorStatus: SensorStatus
  ) {
    this.temperatureService = spruceControllerPlatformAccessory.accessory.getService(sensorStatus.sensor_name + ' Temperature') ||
      this.spruceControllerPlatformAccessory.accessory
        .addService(Service.TemperatureSensor, sensorStatus.sensor_name + ' Temperature', 'Soil Moisture Sensor '+deviceId)
    this.temperatureService.getCharacteristic(Characteristic.CurrentTemperature)
      .onGet(this.getCurrentTemperature.bind(this))
    this.temperatureService.getCharacteristic(Characteristic.StatusLowBattery)
      .onGet(this.getBatteryLow.bind(this))

    this.moistureService = spruceControllerPlatformAccessory.accessory.getService(sensorStatus.sensor_name + ' Humidity') ||
      this.spruceControllerPlatformAccessory.accessory
        .addService(Service.HumiditySensor, sensorStatus.sensor_name + ' Humidity', 'Soil Moisture Sensor'+deviceId)
    this.moistureService.getCharacteristic(Characteristic.CurrentRelativeHumidity)
      .onGet(this.getHumidity.bind(this))
    this.moistureService.getCharacteristic(Characteristic.StatusLowBattery)
      .onGet(this.getBatteryLow.bind(this))
  }

  updateStatus(newStatus: SensorStatus) {
    this.sensorStatus = newStatus
    this.temperatureService.updateCharacteristic(Characteristic.CurrentTemperature, newStatus.temperature)
    this.moistureService.updateCharacteristic(Characteristic.CurrentRelativeHumidity, newStatus.moisture)
  }

  async getCurrentTemperature(): Promise<CharacteristicValue> {
    const temp = this.sensorStatus.temperature
    this.spruceControllerPlatformAccessory.platform.log.debug('%s: getTemperature -> %s', this.sensorStatus.sensor_name, temp)
    return temp
  }

  async getHumidity(): Promise<CharacteristicValue> {
    const rH = this.sensorStatus.moisture
    this.spruceControllerPlatformAccessory.platform.log.debug('%s: getHumidity -> %s', this.sensorStatus.sensor_name, rH)
    return rH
  }

  async getBatteryLow(): Promise<CharacteristicValue> {
    const batteryLow = Number(this.sensorStatus.battery) < Number(this.spruceControllerPlatformAccessory.platform.config.lowBatteryLevel)
    this.spruceControllerPlatformAccessory.platform.log.debug('%s: getBatteryLow -> %s',
      this.sensorStatus.sensor_name, batteryLow ? 'true' : 'false')
    return batteryLow ? Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW : Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL
  }
}
