export type AccessoryContext = {
  version: string
  controller: ControllerSettings
}

// Spruce API types
export type Controller = {
  serial_number: string;
  model_number: string;
  firmware: string;
  gateway: string;
  num_zones: string;
  date_added: string;
  controller_name: string;
  device_id: string;
}

export type ControllerSettings = {
  serial_number: string;
  model_number: string;
  firmware: string;
  gateway: string;
  num_zones: string;
  date_added: string;
  zone: Record<string, Zone>;
  climate_adjust_rules: string;
  controller_name: string;
  freeze_delay_enabled: string;
  freeze_temperature: string;
  latitude: string;
  location_name: string;
  longitude: string;
  manual_max_time: string;
  rain_delay_inches: string;
  timezone: string;
  tz_offset: string;
  wind_mph: string;
  device_id: string;
  schedules: Record<string, Schedule>;
}

export type Zone = {
  gpm: string;
  landscape_type: string;
  nozzle_type: string;
  sensor: string;
  slope: string;
  soil_type: string;
  sun: string;
  zenabled: string;
  zone_name: string;
}

/*
 * Active Zone:
  {
      "zone": 2,
      "zone_state": 1,
      "epoch_time": 1679034772,
      "duration": 60,
      "schedule_id": 0,
      "current_et": 1.824,
      "current_percent_fill": 153,
      "epoch_time_et": 1678956552
  }
 *
 */
export type ZoneStatus = {
  'zone': number // 0,
  'zone_state': number // 0,
  'epoch_time': number // 1678373280,
  'duration': number // 0,
  'schedule_id': number // 2542,
  'current_et': number // 0,
  'current_percent_fill': number // 0,
  'epoch_time_et': number // null
}

export type SensorStatus = {
  'device_id': string // "000Djbhj40DB133",
  'sensor_name': string // "Berry Sensor",
  'moisture': number // 38,
  'moisture_DTepoch': number // 1583818827,
  'temperature': number // 37,
  'temperature_DTepoch': number // 1583827373,
  'signal': number // -86,
  'signal_DTepoch': number // 1583827373,
  'battery': string // "2.359",
  'battery_DTepoch': number // 1583823770,
  'latest_DTepoch': number // 1583827373
}

export type Schedule = {
  schedule_name: string;
  schedule_enabled: string;
  schedule_type: string;
  controller: string;
  schedule_created: string;
}

export type ScheduleSettings = {
  schedule_id: number;
  start_time: string;
  next_date: string;
  prediction_json: any;
  DTepoch: number;
}

export type Forecast = Record<string, any>
/*
 {
    "average_change": -0.07,
    "average_rain": 0.049,
    "average_eto": 0.119,
    "controller_id": "",
    "last_sunrise": 1664892840,
    "last_sunset": 1664934360,
    "2022-10-10": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-19": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-18": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-17": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-16": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-15": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-14": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-13": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-12": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-11": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-06": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-09": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-08": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-07": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-10-05": {
        "is_estimated": true,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "eto": 0.119,
        "precip_inches": 0
    },
    "2022-09-30": {
        "is_estimated": false,
        "sunrise": 1664546940,
        "sunset": 1664589240,
        "temp_max": 79.84,
        "temp_min": 51.5,
        "wind": 3.87,
        "wind_bearing": 353,
        "humidity": 0.69,
        "sun": 0.73,
        "precip_inches": 0,
        "eto": 0.1
    },
    "2022-10-01": {
        "is_estimated": false,
        "sunrise": 1664633400,
        "sunset": 1664675520,
        "temp_max": 86.07,
        "temp_min": 55.7,
        "wind": 5.18,
        "wind_bearing": 41,
        "humidity": 0.53,
        "sun": 0.98,
        "precip_inches": 0,
        "eto": 0.16
    },
    "2022-10-02": {
        "is_estimated": false,
        "sunrise": 1664719860,
        "sunset": 1664761800,
        "temp_max": 88.28,
        "temp_min": 54.2,
        "wind": 2.69,
        "wind_bearing": 357,
        "humidity": 0.55,
        "sun": 1,
        "precip_inches": 0,
        "eto": 0.14
    },
    "2022-10-03": {
        "is_estimated": false,
        "sunrise": 1664806320,
        "sunset": 1664848080,
        "temp_max": 88.66,
        "temp_min": 53.95,
        "wind": 1.89,
        "wind_bearing": 28,
        "humidity": 0.52,
        "sun": 1,
        "precip_inches": 0,
        "eto": 0.13
    },
    "2022-10-04": {
        "is_estimated": false,
        "sunrise": 1664892840,
        "sunset": 1664934360,
        "temp_max": 84.75,
        "temp_min": 55.49,
        "wind": 1.78,
        "wind_bearing": 233,
        "humidity": 0.57,
        "sun": 1,
        "precip_inches": 0,
        "eto": 0.12
    },
    "2022-09-29": {
        "hourly": [
            {
                "temperature": 62.68,
                "wind_speed": 4.82,
                "wind_gust": 14.51
            },
            {
                "temperature": 62.35,
                "wind_speed": 4.85,
                "wind_gust": 14.45
            },
            {
                "temperature": 62.19,
                "wind_speed": 4.93,
                "wind_gust": 14.46
            },
            {
                "temperature": 62.33,
                "wind_speed": 4.85,
                "wind_gust": 13.94
            },
            {
                "temperature": 62.24,
                "wind_speed": 4.78,
                "wind_gust": 13.84
            },
            {
                "temperature": 62.56,
                "wind_speed": 4.76,
                "wind_gust": 13.35
            },
            {
                "temperature": 61.77,
                "wind_speed": 4.28,
                "wind_gust": 12.35
            },
            {
                "temperature": 60.72,
                "wind_speed": 3.69,
                "wind_gust": 10.41
            }
        ],
        "is_estimated": false,
        "sunrise": 1664460420,
        "sunset": 1664502960,
        "temp_max": 69.92,
        "temp_min": 59.02,
        "wind": 3.58,
        "wind_bearing": 184,
        "humidity": 0.79,
        "sun": 0.21,
        "precip_inches": 0.2016,
        "eto": 0.04
    },
    "2022-09-27": {
        "hourly": {
            "7": {
                "temperature": 56.17,
                "wind_speed": 2.71,
                "wind_gust": 5.46
            },
            "8": {
                "temperature": 57.67,
                "wind_speed": 2.92,
                "wind_gust": 6.58
            },
            "9": {
                "temperature": 61.37,
                "wind_speed": 3.48,
                "wind_gust": 7.01
            },
            "10": {
                "temperature": 65.79,
                "wind_speed": 3.64,
                "wind_gust": 6.26
            },
            "11": {
                "temperature": 69.79,
                "wind_speed": 4.54,
                "wind_gust": 6.93
            },
            "12": {
                "temperature": 72.96,
                "wind_speed": 5.37,
                "wind_gust": 7.97
            },
            "13": {
                "temperature": 76.11,
                "wind_speed": 6.3,
                "wind_gust": 8.94
            },
            "14": {
                "temperature": 78.35,
                "wind_speed": 6.83,
                "wind_gust": 9.98
            },
            "15": {
                "temperature": 79.92,
                "wind_speed": 6.83,
                "wind_gust": 9.5
            },
            "16": {
                "temperature": 80.16,
                "wind_speed": 6.89,
                "wind_gust": 9.8
            },
            "17": {
                "temperature": 79.44,
                "wind_speed": 6.96,
                "wind_gust": 10.58
            },
            "18": {
                "temperature": 77.28,
                "wind_speed": 6.6,
                "wind_gust": 11.88
            },
            "19": {
                "temperature": 73.43,
                "wind_speed": 5.92,
                "wind_gust": 13.64
            },
            "20": {
                "temperature": 70.22,
                "wind_speed": 5.02,
                "wind_gust": 10.26
            },
            "21": {
                "temperature": 68.07,
                "wind_speed": 4.26,
                "wind_gust": 8.12
            },
            "22": {
                "temperature": 66.28,
                "wind_speed": 4.13,
                "wind_gust": 8.05
            },
            "23": {
                "temperature": 64.59,
                "wind_speed": 3.77,
                "wind_gust": 7.69
            }
        },
        "is_estimated": false,
        "sunrise": 1664287500,
        "sunset": 1664330340,
        "temp_max": 80.7,
        "temp_min": 55.67,
        "wind": 4.22,
        "wind_bearing": 212,
        "humidity": 0.69,
        "sun": 0.74,
        "precip_inches": 0,
        "eto": 0.1
    },
    "2022-09-28": {
        "hourly": [
            {
                "temperature": 63.52,
                "wind_speed": 3.55,
                "wind_gust": 7.04
            },
            {
                "temperature": 62.71,
                "wind_speed": 3.29,
                "wind_gust": 6.45
            },
            {
                "temperature": 61.94,
                "wind_speed": 2.9,
                "wind_gust": 5.72
            },
            {
                "temperature": 60.95,
                "wind_speed": 2.69,
                "wind_gust": 4.8
            },
            {
                "temperature": 59.6,
                "wind_speed": 2.94,
                "wind_gust": 5.79
            },
            {
                "temperature": 58.59,
                "wind_speed": 2.84,
                "wind_gust": 5.61
            },
            {
                "temperature": 57.55,
                "wind_speed": 2.44,
                "wind_gust": 4.94
            },
            {
                "temperature": 56.97,
                "wind_speed": 1.59,
                "wind_gust": 3.84
            },
            {
                "temperature": 57.17,
                "wind_speed": 1.52,
                "wind_gust": 3.85
            },
            {
                "temperature": 58.58,
                "wind_speed": 2.17,
                "wind_gust": 6.91
            },
            {
                "temperature": 59.92,
                "wind_speed": 3.04,
                "wind_gust": 8.61
            },
            {
                "temperature": 61.64,
                "wind_speed": 3.55,
                "wind_gust": 10.29
            },
            {
                "temperature": 63.18,
                "wind_speed": 4.87,
                "wind_gust": 13.24
            },
            {
                "temperature": 64.33,
                "wind_speed": 5.72,
                "wind_gust": 13.44
            },
            {
                "temperature": 66.85,
                "wind_speed": 6.82,
                "wind_gust": 14.05
            },
            {
                "temperature": 69.99,
                "wind_speed": 7.28,
                "wind_gust": 14.88
            },
            {
                "temperature": 71.09,
                "wind_speed": 7.09,
                "wind_gust": 14.2
            },
            {
                "temperature": 69.8,
                "wind_speed": 6.86,
                "wind_gust": 13.86
            },
            {
                "temperature": 68.34,
                "wind_speed": 6.1,
                "wind_gust": 14.08
            },
            {
                "temperature": 65.79,
                "wind_speed": 4.62,
                "wind_gust": 12.06
            },
            {
                "temperature": 64.59,
                "wind_speed": 4.01,
                "wind_gust": 13.32
            },
            {
                "temperature": 63.97,
                "wind_speed": 3.97,
                "wind_gust": 13.21
            },
            {
                "temperature": 63.04,
                "wind_speed": 4.11,
                "wind_gust": 11.68
            },
            {
                "temperature": 63.14,
                "wind_speed": 4.36,
                "wind_gust": 12.27
            }
        ],
        "is_estimated": false,
        "sunrise": 1664373960,
        "sunset": 1664416680,
        "temp_max": 71.59,
        "temp_min": 56.44,
        "wind": 4.12,
        "wind_bearing": 192,
        "humidity": 0.73,
        "sun": 0.1,
        "precip_inches": 0.1392,
        "eto": 0.04
    }
}
  */

