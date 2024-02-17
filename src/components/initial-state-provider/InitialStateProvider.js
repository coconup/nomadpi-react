import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

import { getApisState } from '../../utils';

import {
  useGetGpsStateQuery,
  useGetRelaysStateQuery,
  useGetModesStateQuery,
  useGetBatteriesStateQuery,
  useGetWaterTanksStateQuery,
  useGetTemperatureSensorsStateQuery,
  useGetSolarChargeControllersStateQuery,
  useGetAlarmStateQuery,

  useGetSettingsQuery,

  useGetServiceCredentialsQuery
} from '../../apis/van-pi/vanpi-app-api';

const InitialStateProvider = () => {
  useGetGpsStateQuery();
  useGetRelaysStateQuery();
  useGetModesStateQuery();
  useGetBatteriesStateQuery();
  useGetWaterTanksStateQuery();
  useGetTemperatureSensorsStateQuery();
  useGetSolarChargeControllersStateQuery();
  useGetAlarmStateQuery();

  useGetSettingsQuery();

  useGetServiceCredentialsQuery({ service_id: 'google-maps' });
  useGetServiceCredentialsQuery({ service_id: 'open-ai' });
  useGetServiceCredentialsQuery({ service_id: 'eleven-labs' });
}

export default InitialStateProvider;