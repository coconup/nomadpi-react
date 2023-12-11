import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Switchable from '../../models/Switchable';

const BASE_URL = 'http://localhost:1880'

export const vanPiAPI = createApi({
  reducerPath: 'van-pi-api',
  tagTypes: ['relay'],
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSwitchables: builder.query({
      query: (type) => `/${type}`,
      transformResponse: (result, meta, payload) => {
        const type = payload;
        if(result && Object.keys(result)) {
          return Object.keys(result).map(key => {
            // const {
            //   name,
            //   state
            // } = result[key];
            
            // return {
            //   type,
            //   id: parseInt(key.toLowerCase().replace(type, '')),
            //   name,
            //   state
            // }

            return new Switchable({key, type, data: result[key]});
          })
        }
      },
      providesTags: (result) => {
        return result ? result.map(({tags}) => tags) : []
      }
    }),
    toggleSwitchable: builder.mutation({
      query: (switchableItem) => ({
        url: switchableItem.routes.toggle,
        method: 'put'
      }),
      invalidatesTags: (result, error, switchableItem, request) => {
        return [switchableItem.tags]
      }
    }),
    updateSwitchable: builder.mutation({
      query: ({type, id, name}) => ({
        url: `names/${type}/${id}/${name}`,
        method: 'put'
      }),
      invalidatesTags: (result, error, {type, id}, request) => {
        return [{ type, id }]
      }
    })
  })
})

export const {
  useGetSwitchablesQuery,
  useToggleSwitchableMutation,
  useUpdateSwitchableMutation
} = vanPiAPI