import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import RelaySwitch from '../../models/RelaySwitch';
import ActionSwitch from '../../models/ActionSwitch';
import SwitchGroup from '../../models/SwitchGroup';

// const BASE_URL = 'http://raspberrypi.local:3001'

// const BASE_URL = window.location.origin.includes(':3000') ? window.location.origin.replace('3000', '3001') : window.location.origin.replace('/app.', '/api.');

const BASE_URL = 'https://api.monsterpi.net'

export const vanPiAppAPI = createApi({
  reducerPath: 'vanpi-app-api',
  tagTypes: [
    'RelaySwitch',
    'ActionSwitch',
    'SwitchGroup',
    'SwitchState'
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

      postRelayState: builder.mutation({
        query: ({relay_position, ...body}) => ({
          url: `relays/${relay_position}`,
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
    };

    [
      {
        apiPath: 'relays',
        model: RelaySwitch,
        resourceNameSingular: 'Relay',
        resourceNamePlural: 'Relays'
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
      }
    ].forEach(spec => {
      // GET endpoint
      endpoints[`get${spec.resourceNamePlural}`] = builder.query({
        query: () => `/${spec.apiPath}`,
        transformResponse: (result, meta) => {
          if(result) {
            return result.map(row => new spec.model(row));
          }
        },
        providesTags: (result) => {
          return result ? result.map(({tags}) => tags) : []
        }
      });

      // POST endpoint
      endpoints[`create${spec.resourceNameSingular}`] = builder.mutation({
        query: (data) => ({
          url: `${spec.apiPath}`,
          method: 'post',
          body: data
        }),
        invalidatesTags: (result, error, payload, request) => {
          if(result) {
            const item = new spec.model(result);
            return item.tags;
          }
        }
      });

      // PUT endpoint
      endpoints[`update${spec.resourceNameSingular}`] = builder.mutation({
        query: (data) => ({
          url: `${spec.apiPath}/${data.id}`,
          method: 'put',
          body: data
        }),
        invalidatesTags: (result, error, payload, request) => {
          if(result) {
            const item = new spec.model(result);
            return item.tags;
          }
        }
      });

      // DELETE endpoint
      endpoints[`delete${spec.resourceNameSingular}`] = builder.mutation({
        query: (data) => ({
          url: `${spec.apiPath}/${data.id}`,
          method: 'delete'
        }),
        invalidatesTags: (result, error, payload, request) => {
          if(result) {
            const item = new spec.model(result);
            return item.tags;
          }
        }
      });
    });

    return endpoints;
  },
})

export const {
  useLoginMutation,
  useCheckAuthStatusQuery,

  usePostRelayStateMutation,
  useGetRelaysStateQuery,

  useGetRelaysQuery,
  useUpdateRelayMutation,
  useCreateRelayMutation,
  useDeleteRelayMutation,
  
  useGetActionSwitchesQuery,
  useUpdateActionSwitchMutation,
  useCreateActionSwitchMutation,
  useDeleteActionSwitchMutation,
  
  useGetSwitchGroupsQuery,
  useUpdateSwitchGroupMutation,
  useCreateSwitchGroupMutation,
  useDeleteSwitchGroupMutation
} = vanPiAppAPI;