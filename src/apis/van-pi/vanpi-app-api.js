import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import RelaySwitch from '../../models/RelaySwitch';
import ActionSwitch from '../../models/ActionSwitch';
import SwitchGroup from '../../models/SwitchGroup';

const BASE_URL = 'http://127.0.0.1:3000'

export const vanPiAppAPI = createApi({
  reducerPath: 'vanpi-app-api',
  tagTypes: [
    'RelaySwitch',
    'ActionSwitch',
    'SwitchGroup'
  ],
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => {
    let endpoints = {
      toggleRelaySwitch: builder.mutation({
        // query: (switchableItem) => ({
        //   url: switchableItem.routes.toggle,
        //   method: 'put'
        // }),
        // invalidatesTags: (result, error, switchableItem, request) => {
        //   return [switchableItem.tags]
        // }
      })
    };

    [
      {
        apiPath: 'relay_switches',
        model: RelaySwitch,
        resourceNameSingular: 'RelaySwitch',
        resourceNamePlural: 'RelaySwitches'
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
  }
})

export const {
  useGetRelaySwitchesQuery,
  useToggleRelaySwitchMutation,
  useUpdateRelaySwitchMutation,
  useCreateRelaySwitchMutation,
  useDeleteRelaySwitchMutation,
  
  useGetActionSwitchesQuery,
  useUpdateActionSwitchMutation,
  useCreateActionSwitchMutation,
  useDeleteActionSwitchMutation,
  
  useGetSwitchGroupsQuery,
  useUpdateSwitchGroupMutation,
  useCreateSwitchGroupMutation,
  useDeleteSwitchGroupMutation
} = vanPiAppAPI;