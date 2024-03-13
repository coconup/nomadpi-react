import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { isPlatform } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import { makeCrudEndpoints } from '../crudBuilder';
import { selectApiBaseUrl } from '../../app/store';

import {
  toSnakeCase,
  uppercaseFirstLetter
} from '../../utils';

import Credentials from '../../models/Credentials';
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

let wsBaseUrl;

const toPlural = (resource) => {
  return {
    relay: 'relays',
    wifi_relay: 'wifi_relays',
    action_switch: 'action_switches',
    mode: 'modes'
  }[resource];
};

const dynamicBaseQuery = async (args, api, extraOptions) => {
  const baseUrl = selectApiBaseUrl(api.getState());

  if (!baseUrl.http) {
    return {
      error: {
        status: 400,
        statusText: 'Bad Request',
        data: 'No hostname set',
      },
    }
  };

  wsBaseUrl = baseUrl.ws;

  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl.http,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
    credentials: "include"
  });

  return baseQuery(args, api, extraOptions)
};

export const vanPiAppAPI = createApi({
  reducerPath: 'nomadpi-app-api',
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
    'RelayState',
    'ModeState',
    'BatteryState',
    'SolarChargecontrollerState',
    'WaterTankState',
    'SensorState',
    'UsbDevices',
    'Settings',
    'AlarmState',
  ],
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => {
    let endpoints = {
      postSwitchState: builder.mutation({
        query: ({switch_type, switch_id, ...body}) => {
          return {
            url: `${toPlural(switch_type)}/${switch_id}/state`,
            method: 'post',
            body
          }
        },
        invalidatesTags: (result, error, payload, request) => {
          if(result) {
            return [{type: `RelaysState`}];
          }
        }
      }),

      postAlarmState: builder.mutation({
        query: (body) => {
          return {
            url: `alarm/state`,
            method: 'post',
            body
          }
        },
        invalidatesTags: (result, error, payload, request) => {
          if(result) {
            return [
              {type: `AlarmState`},
              {type: `FrigateConfig`}
            ];
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
      }),

      getServiceCredentials: builder.query({
        query: ({ service_id }) => ({
          url: `/services/credentials/service/${service_id}`,
          method: 'get'
        })
      }),

      postButterflyIntent: builder.mutation({
        query: (data) => ({
          url: `butterfly/engine/intent`,
          method: 'post',
          body: data,
          timeout: 20000
        })
      }),

      postButterflyCommandConfirmation: builder.mutation({
        query: (data) => ({
          url: `butterfly/engine/command_confirmation`,
          method: 'post',
          body: data,
          timeout: 20000
        })
      }),

      postButterflyServiceFunction: builder.mutation({
        query: ({ service_id, function_name, ...body }) => ({
          url: `butterfly/services/${service_id}/${function_name}`,
          method: 'post',
          body,
          timeout: 20000
        })
      }),

      getFrigateConfig: builder.query({
        query: () => `/frigate/config`,
        transformResponse: (result, meta) => {
          return result
        },
        providesTags: (result) => {
          return [{type: 'FrigateConfig'}]
        }
      })
    };

    const stateResourceNames = [
      'gps',
      'modes',
      'switchables',
      'batteries',
      'waterTanks',
      'temperatureSensors',
      'solarChargeControllers',
      'alarm'
    ];

    // Resource State endpoints
    stateResourceNames.forEach(name => {
      endpoints[`get${uppercaseFirstLetter(name)}State`] = builder.query({
        query: () => `${toSnakeCase(name)}/state`,
        transformResponse: (result, meta) => {
          if(result) {
            return result;
          }
        },
        // providesTags: (result) => {
        //   return [{type: `${uppercaseFirstLetter(name)}State`}]
        // }
        async onCacheEntryAdded(
          arg,
          { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
        ) {
          if(wsBaseUrl) {
            const ws = new WebSocket(`${wsBaseUrl}/${toSnakeCase(name)}/state`)
            try {
              await cacheDataLoaded;

              const listener = (event) => {
                const data = JSON.parse(event.data);

                updateCachedData((draft) => {
                  Object.assign(draft, data);
                });
              }

              ws.addEventListener('message', listener)
            } catch {
              // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
              // in which case `cacheDataLoaded` will throw
            }
            // cacheEntryRemoved will resolve when the cache subscription is no longer active
            await cacheEntryRemoved
            // perform cleanup steps once the `cacheEntryRemoved` promise resolves
            ws.close()
          }
        },
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
      },
      {
        apiPath: 'services/credentials',
        model: Credentials,
        resourceNameSingular: 'Credentials',
        resourceNamePlural: 'Credentials'
      }
    ].forEach(spec => {
      endpoints = {
        ...endpoints,
        ...makeCrudEndpoints(spec, builder)
      }
    });

    return endpoints;
  },
});

export const {
  usePostSwitchStateMutation,
  usePostAlarmStateMutation,
  
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
  useGetSwitchablesStateQuery,
  useGetModesStateQuery,
  useGetBatteriesStateQuery,
  useGetWaterTanksStateQuery,
  useGetTemperatureSensorsStateQuery,
  useGetSolarChargeControllersStateQuery,
  useGetAlarmStateQuery,

  usePostButterflyIntentMutation,
  usePostButterflyCommandConfirmationMutation,
  usePostButterflyServiceFunctionMutation,

  useGetFrigateConfigQuery,
  
  useGetCredentialsQuery,
  useUpdateCredentialsMutation,
  useCreateCredentialsMutation,
  useDeleteCredentialsMutation,

  useGetServiceCredentialsQuery
} = vanPiAppAPI;