import {Controller, ControllerSettings, Forecast, ScheduleSettings, SensorStatus, ZoneStatus} from './spruce.types'
import {Logging} from 'homebridge'
import axios from 'axios'
import qs from 'qs'

export class SpruceService {
  private readonly BASE_URL = 'https://api.spruceirrigation.com/v2'
  private borked = false
  private netFails = 0

  constructor(
    private readonly authToken: string,
    private readonly networkRetries: number,
    private readonly log: Logging
  ) {
    axios.interceptors.response.use(response=> {
      this.netFails = 0
      return response
    }, error => {
      this.log.error(error)
      if (++this.netFails > this.networkRetries)  {
        this.borked = true
      }
    })
  }

  async getControllers(): Promise<Array<ControllerSettings>> {
    const controllers: ControllerSettings[] = []
    if (!this.borked) {
      try {
        const controllerRecords = await this.getControllerList()
        if (controllerRecords) {
          for (const key in controllerRecords) {
            const c = await this.getControllerSettings(key)
            if (c) {
              controllers.push(c)
            }
          }
        }
      } catch (e) {
        this.log.error(e)
      }
    }
    return controllers
  }

  // GET COMMANDS
  private async getControllerList(): Promise<Record<string, Controller> | void> {
    return axios.get(`${this.BASE_URL}/controllers`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    })
      .then(response => response?.data as Record<string, Controller>)
      .catch(error => {
        this.log.error(error)
        Promise.reject(error)
      })
  }

  private async getControllerSettings(controllerId: string): Promise<ControllerSettings | void> {
    return axios.get(`${this.BASE_URL}/controller_settings?controller_id=${controllerId}`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    })
      .then(response => response.data as ControllerSettings)
      .catch(error => {
        this.log.error(error)
        Promise.reject(error)
      })
  }

  async getScheduleSettings(controllerId: string, scheduleId: string): Promise<ScheduleSettings | void> {
    if (this.borked) {
      return Promise.reject("network issues")
    }
    return axios.get(`${this.BASE_URL}/schedule_settings?controller_id=${controllerId}&schedule_id=${scheduleId}`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    })
      .then(response => response.data as ScheduleSettings)
      .catch(error => {
        this.log.error(error)
        Promise.reject(error)
      })
  }

  async getZoneStatus(controllerId: string): Promise<Array<ZoneStatus> | void> {
    if (this.borked) {
      return Promise.reject("network issues")
    }
    return axios.get(`${this.BASE_URL}/zone_status?controller_id=${controllerId}`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    })
      .then(response => response.data as Array<ZoneStatus>)
      .catch(error => {
        this.log.error(error)
        Promise.reject(error)
      })
  }

  async getSensorStatus(controllerId: string): Promise<Record<string, SensorStatus> | void> {
    if (this.borked) {
      return Promise.reject("network issues")
    }
    return axios.get(`${this.BASE_URL}/sensor_status?controller_id=${controllerId}`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    })
      .then(response => response.data as Record<string, SensorStatus>)
      .catch(error => {
        this.log.error(error)
        Promise.reject(error)
      })
  }

  async getForecast(controllerId: string): Promise<Forecast | void> {
    if (this.borked) {
      return Promise.reject("network issues")
    }
    return axios.get(`${this.BASE_URL}/climate_forecast?controller_id=${controllerId}`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    })
      .then(response => response.data as Forecast)
      .catch(error => {
        this.log.error(error)
        Promise.reject(error)
      })
  }

  // POST COMMANDS

  async turnOffZone(zoneNumber: number) {
    return this.updateZone(zoneNumber, 0, 0)
  }

  async turnOnZone(zoneNumber: number, zoneTime: number) {
    return this.updateZone(zoneNumber, 1, zoneTime)
  }

  private async updateZone(zoneNumber: number, zoneState: number, zoneTime: number) {
    const data = qs.stringify({
      'zone': String(zoneNumber),
      'zonestate': String(zoneState),
      'zonetime': String(zoneTime)
    })

    axios({
      method: 'post',
      maxBodyLength: Infinity,
      url: `${this.BASE_URL}/zone`,
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    })
      .then((response) => {
        this.log.info('Valve state updated: '+response)
      })
      .catch((error) => {
        this.log.error(error)
      })
  }

  async runAllZones(zoneTime: number) {
    if (!this.borked) {
      const data = qs.stringify({
        'zonetime': String(zoneTime)
      });

      axios({
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this.BASE_URL}/runall`,
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
      })
        .then((response) => {
          this.log.info('Valves started:' + response)
        })
        .catch((error) => {
          this.log.error(error)
        })
    }
  }

  async stopAllZones() {
    if (!this.borked) {
      axios({
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this.BASE_URL}/stop`,
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then((response) => {
          this.log.info('All valves stopped: ' + response)
        })
        .catch((error) => {
          this.log.error(error)
        })
    }
  }

  async pauseSchedule(pauseTime?: number) {
    if (this.borked) {
      return Promise.reject("network issues")
    }
    return axios.postForm(`${this.BASE_URL}/pause`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.encodeForm({
        'pausetime': pauseTime,
      }),
    })
      .then(response => response.data)
      .catch(error => {
        this.log.error(error)
        Promise.reject(error)
      })
  }

  async resumeSchedule(pauseTime = 0) {
    if (this.borked) {
      return Promise.reject("network issues")
    }
    return axios.postForm(`${this.BASE_URL}/resume`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.encodeForm({
        'pausetime': pauseTime,
      }),
    })
      .then(response => response.data)
      .catch(error => {
        this.log.error(error)
        Promise.reject(error)
      })
  }

  async startSchedule(scheduleID: string) {
    return this.postSchedule(scheduleID, 1)
  }

  async stopSchedule(scheduleID: string) {
    return this.postSchedule(scheduleID, 0)
  }

  private async postSchedule(scheduleID: string, onoff: number) {
    if (this.borked) {
      return Promise.reject("network issues")
    }
    return axios.postForm(`${this.BASE_URL}/schedule`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.encodeForm({
        scheduleID,
        onoff
      }),
    })
      .then(response => response.data)
      .catch(error => {
        this.log.error(error)
        Promise.reject(error)
      })
  }

  private encodeForm(form: any) {
    const formBody = []
    for (const property in form) {
      formBody.push(encodeURIComponent(property) + '=' + encodeURIComponent(form[property]));
    }
    return formBody.join('&');
  }
}
