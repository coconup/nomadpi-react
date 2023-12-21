import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://127.0.0.1:1880/api/v1'

export const vanPiAPI = createApi({
  reducerPath: 'vanpi-api',
  tagTypes: ['StateGPIO'],
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => (
    {
      getStateGPIO: builder.query({
        query: () => `state_gpio`,
        transformResponse: (result, meta) => {
          if(result) {
            return result;
          }
        },
        providesTags: (result) => {
          return [{type: 'StateGPIO'}]
        }
      })
    }
  )
})

export const {
  useGetStateGPIOQuery,
} = vanPiAPI;