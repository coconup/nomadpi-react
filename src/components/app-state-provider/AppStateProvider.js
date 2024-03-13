import {
  useGetGpsStateQuery,
  useGetSwitchablesStateQuery,
  useGetModesStateQuery,
  useGetBatteriesStateQuery,
  useGetWaterTanksStateQuery,
  useGetTemperatureSensorsStateQuery,
  useGetSolarChargeControllersStateQuery,
  useGetAlarmStateQuery,

  useGetSettingsQuery,

  useGetServiceCredentialsQuery
} from '../../apis/nomadpi/nomadpi-app-api';

function AppStateProvider() {
  useGetGpsStateQuery();
  useGetSwitchablesStateQuery();
  useGetModesStateQuery();
  useGetBatteriesStateQuery();
  useGetWaterTanksStateQuery();
  useGetTemperatureSensorsStateQuery();
  useGetSolarChargeControllersStateQuery();
  useGetAlarmStateQuery();

  useGetSettingsQuery();

  useGetServiceCredentialsQuery({ service_id: 'google-maps' });
  useGetServiceCredentialsQuery({ service_id: 'open-weather-map' });
  useGetServiceCredentialsQuery({ service_id: 'open-ai' });
  useGetServiceCredentialsQuery({ service_id: 'eleven-labs' });

  return null;
}

export default AppStateProvider;
