import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { makeCrudEndpoints } from '../crudBuilder';

import {
  toSnakeCase,
  uppercaseFirstLetter
} from '../../utils';

import { resourceNames } from '../../app/resourceStateMiddleware';

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
import SolarChargeController from '../../models/SolarChargeController';

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
    'SolarChargeController',
    'WaterTank',
    'Sensor',
    'Camera',
    'Heater',
    'TemperatureSensor',
    'RelaysState',
    'ModesState',
    'BatteryState',
    'SolarChargecontrollerState',
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

    // Resource State endpoints
    resourceNames.forEach(name => {
      endpoints[`get${uppercaseFirstLetter(name)}State`] = builder.query({
        query: () => `${toSnakeCase(name)}/state`,
        transformResponse: (result, meta) => {
          if(result) {
            return result;
          }
        },
        providesTags: (result) => {
          return [{type: `${uppercaseFirstLetter(name)}State`}]
        }
      })
    });

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
      },
      {
        apiPath: 'solar_charge_controllers',
        model: SolarChargeController,
        resourceNameSingular: 'SolarChargeController',
        resourceNamePlural: 'SolarChargeControllers'
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

  usePostModeStateMutation,
  
  useUpdateSettingMutation,
  useGetSettingsQuery,

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
  
  useGetSolarChargeControllersQuery,
  useUpdateSolarChargeControllerMutation,
  useCreateSolarChargeControllerMutation,
  useDeleteSolarChargeControllerMutation,

  useGetGpsStateQuery,
  useGetRelaysStateQuery,
  useGetModesStateQuery,
  useGetBatteriesStateQuery,
  useGetWaterTanksStateQuery,
  useGetTemperatureSensorsStateQuery,
  useGetSolarChargeControllersStateQuery,
} = vanPiAppAPI;