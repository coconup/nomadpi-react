import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { makeCrudEndpoints } from '../crudBuilder';

import Credentials from '../../models/Credentials';

const BASE_URL = process.env.SERVICES_API_BASE_URL || 'http://localhost:3002';

export const vanPiServicesAPI = createApi({
  reducerPath: 'vanpi-services-api',
  tagTypes: [
    'Credentials'
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
      blinkCamerasLogin: builder.mutation({
        query: ({email, password}) => ({
          url: `services/blink-cameras/login`,
          method: 'post',
          body: {
            email,
            password
          },
        })
      }),

      blinkCamerasVerify: builder.mutation({
        query: ({tier, account_id, client_id, auth_token, verification_code}) => ({
          url: `/services/blink-cameras/login-verify`,
          method: 'post',
          body: {
            pin: parseInt(verification_code),
            auth_token,
            tier,
            account_id,
            client_id
          }
        })
      }),
    };

    [
      {
        apiPath: 'credentials',
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
})

export const {
  useBlinkCamerasLoginMutation,
  useBlinkCamerasVerifyMutation,
  
  useGetCredentialsQuery,
  useUpdateCredentialsMutation,
  useCreateCredentialsMutation,
  useDeleteCredentialsMutation
} = vanPiServicesAPI;