import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { makeCrudEndpoints } from '../crudBuilder';

import RelaySwitch from '../../models/RelaySwitch';
import WifiRelaySwitch from '../../models/WifiRelaySwitch';
import ModeSwitch from '../../models/ModeSwitch';
import ActionSwitch from '../../models/ActionSwitch';
import SwitchGroup from '../../models/SwitchGroup';
import Setting from '../../models/Setting';
import Battery from '../../models/Battery';
import WaterTank from '../../models/WaterTank';
import Sensor from '../../models/Sensor';
import Camera from '../../models/Camera';
import Heater from '../../models/Heater';
import TemperatureSensor from '../../models/TemperatureSensor';

const BASE_URL = process.env.API_BASE_URL || 'http://raspberrypi.local:3001';

export const vanPiAppAPI = createApi({
  reducerPath: 'vanpi-app-api',
  tagTypes: [
    'RelaySwitch',
    'WifiRelaySwitch',
    'ModeSwitch',
    'ActionSwitch',
    'SwitchGroup',
    'Setting',
    'Battery',
    'WaterTank',
    'Sensor',
    'Camera',
    'Heater',
    'TemperatureSensor',
    'RelaysState',
    'ModesState',
    'BatteryState',
    'WaterTankState',
    'SensorState',
    'UsbDevices',
    'Settings',
  ],
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
    credentials: "include"
  }),
  endpoints: (builder) => {
    let endpoints = {
      login: builder.mutation({
        query: (credentials) => ({
          url: '/auth/login',
          method: 'POST',
          body: credentials,
        }),
      }),
      checkAuthStatus: builder.query({
        query: () => 'auth/status',
      }),

      postRelaysState: builder.mutation({
        query: (body) => ({
          url: `relays/state`,
          method: 'post',
          body
        }),
        invalidatesTags: (result, error, payload, request) => {
          if(result) {
            return [{type: 'RelaysState'}];
          }
        }
      }),

      getRelaysState: builder.query({
        query: () => `relays/state`,
        transformResponse: (result, meta) => {
          if(result) {
            return result;
          }
        },
        providesTags: (result) => {
          return [{type: 'RelaysState'}]
        }
      }),

      postModeState: builder.mutation({
        query: ({mode_key, ...body}) => ({
          url: `modes/${mode_key}`,
          method: 'post',
          body
        }),
        invalidatesTags: (result, error, payload, request) => {
          if(result) {
            return [{type: 'ModesState'}];
          }
        }
      }),

      getModesState: builder.query({
        query: () => `modes/state`,
        transformResponse: (result, meta) => {
          if(result) {
            return result;
          }
        },
        providesTags: (result) => {
          return [{type: 'ModesState'}]
        }
      }),

      getBatteryState: builder.query({
        query: ({
          connection_type,
          device_type,
          device_id
        }) => `batteries/${connection_type}/${device_type}/${device_id}/state`,
        transformResponse: (result, meta) => {
          return result;
        },
        providesTags: (result) => {
          return [{type: 'BatteryState'}]
        }
      }),

      getWaterTankState: builder.query({
        query: ({
          connection_type,
          device_type,
          device_id
        }) => `water_tanks/${connection_type}/${device_type}/${device_id}/state`,
        transformResponse: (result, meta) => {
          return result;
        },
        providesTags: (result) => {
          return [{type: 'WaterTankState'}]
        }
      }),

      getUsbDevices: builder.query({
        query: () => `usb_devices`,
        transformResponse: (result, meta) => {
          if(result) {
            return result;
          }
        },
        providesTags: (result) => {
          return [{type: 'UsbDevices'}]
        }
      }),

      getSettings: builder.query({
        query: () => `settings`,
        transformResponse: (result, meta) => {
          if(result) {
            console.log(result.map(row => new Setting(row)))
            return result.map(row => new Setting(row));
          }
        },
        providesTags: (result) => {
          return [{type: 'Settings'}]
        }
      }),

      updateSetting: builder.mutation({
        query: (data) => ({
          url: `settings/${data.setting_key}`,
          method: 'put',
          body: data
        }),
        invalidatesTags: (result, error, payload, request) => {
          if(result) {
            return [{type: 'Settings'}]
          }
        }
      })
    };

    [
      {
        apiPath: 'relays',
        model: RelaySwitch,
        resourceNameSingular: 'Relay',
        resourceNamePlural: 'Relays'
      },
      {
        apiPath: 'wifi_relays',
        model: WifiRelaySwitch,
        resourceNameSingular: 'WifiRelay',
        resourceNamePlural: 'WifiRelays'
      },
      {
        apiPath: 'modes',
        model: ModeSwitch,
        resourceNameSingular: 'Mode',
        resourceNamePlural: 'Modes'
      },
      {
        apiPath: 'action_switches',
        model: ActionSwitch,
        resourceNameSingular: 'ActionSwitch',
        resourceNamePlural: 'ActionSwitches'
      },
      {
        apiPath: 'switch_groups',
        model: SwitchGroup,
        resourceNameSingular: 'SwitchGroup',
        resourceNamePlural: 'SwitchGroups'
      },
      {
        apiPath: 'batteries',
        model: Battery,
        resourceNameSingular: 'Battery',
        resourceNamePlural: 'Batteries'
      },
      {
        apiPath: 'water_tanks',
        model: WaterTank,
        resourceNameSingular: 'WaterTank',
        resourceNamePlural: 'WaterTanks'
      },
      {
        apiPath: 'sensors',
        model: Sensor,
        resourceNameSingular: 'Sensor',
        resourceNamePlural: 'Sensors'
      },
      {
        apiPath: 'cameras',
        model: Camera,
        resourceNameSingular: 'Camera',
        resourceNamePlural: 'Cameras'
      },
      {
        apiPath: 'heaters',
        model: Heater,
        resourceNameSingular: 'Heater',
        resourceNamePlural: 'Heaters'
      },
      {
        apiPath: 'temperature_sensors',
        model: TemperatureSensor,
        resourceNameSingular: 'TemperatureSensor',
        resourceNamePlural: 'TemperatureSensors'
      }
    ].forEach(spec => {
      endpoints = {
        ...endpoints,
        ...makeCrudEndpoints(spec, builder)
      }
    });

    return endpoints;
  },
})

export const {
  useLoginMutation,
  useCheckAuthStatusQuery,

  usePostRelaysStateMutation,
  useGetRelaysStateQuery,

  usePostModeStateMutation,
  useGetModesStateQuery,
  
  useUpdateSettingMutation,
  useGetSettingsQuery,

  useGetBatteryStateQuery,
  useGetWaterTankStateQuery,

  useGetUsbDevicesQuery,

  useGetRelaysQuery,
  useUpdateRelayMutation,
  useCreateRelayMutation,
  useDeleteRelayMutation,

  useGetWifiRelaysQuery,
  useUpdateWifiRelayMutation,
  useCreateWifiRelayMutation,
  useDeleteWifiRelayMutation,

  useGetModesQuery,
  useUpdateModeMutation,
  useCreateModeMutation,
  useDeleteModeMutation,
  
  useGetActionSwitchesQuery,
  useUpdateActionSwitchMutation,
  useCreateActionSwitchMutation,
  useDeleteActionSwitchMutation,
  
  useGetSwitchGroupsQuery,
  useUpdateSwitchGroupMutation,
  useCreateSwitchGroupMutation,
  useDeleteSwitchGroupMutation,
  
  useGetBatteriesQuery,
  useUpdateBatteryMutation,
  useCreateBatteryMutation,
  useDeleteBatteryMutation,
  
  useGetWaterTanksQuery,
  useUpdateWaterTankMutation,
  useCreateWaterTankMutation,
  useDeleteWaterTankMutation,
  
  useGetSensorsQuery,
  useUpdateSensorMutation,
  useCreateSensorMutation,
  useDeleteSensorMutation,
  
  useGetCamerasQuery,
  useUpdateCameraMutation,
  useCreateCameraMutation,
  useDeleteCameraMutation,
  
  useGetHeatersQuery,
  useUpdateHeaterMutation,
  useCreateHeaterMutation,
  useDeleteHeaterMutation,
  
  useGetTemperatureSensorsQuery,
  useUpdateTemperatureSensorMutation,
  useCreateTemperatureSensorMutation,
  useDeleteTemperatureSensorMutation,
} = vanPiAppAPI;