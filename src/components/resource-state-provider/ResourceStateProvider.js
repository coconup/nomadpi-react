import { useState, useEffect } from 'react';

import { getApisState } from '../../utils';

import {
  useGetGpsStateQuery,
  useGetRelaysStateQuery,
  useGetModesStateQuery,
  useGetBatteriesStateQuery,
  useGetWaterTanksStateQuery,
  useGetTemperatureSensorsStateQuery,
  useGetSolarChargeControllersStateQuery,
} from '../../apis/van-pi/vanpi-app-api';

const ResourceStateProvider = () => {
  const apiGpsState = useGetGpsStateQuery();
  const apiRelaysState = useGetRelaysStateQuery();
  const apiModesState = useGetModesStateQuery();
  const apiBatteriesState = useGetBatteriesStateQuery();
  const apiWaterTanksState = useGetWaterTanksStateQuery();
  const apiTemperatureSensorsState = useGetTemperatureSensorsStateQuery();
  const apiSolarChargeControllersState = useGetSolarChargeControllersStateQuery();

  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors
  } = getApisState([
    apiGpsState,
    apiRelaysState,
    apiModesState,
    apiBatteriesState,
    apiWaterTanksState,
    apiTemperatureSensorsState,
    apiSolarChargeControllersState
  ]);

  const refetch = async () => {
    await apiGpsState.refetch();
    await apiRelaysState.refetch();
    await apiModesState.refetch();
    await apiBatteriesState.refetch();
    await apiWaterTanksState.refetch();
    await apiTemperatureSensorsState.refetch();
    await apiSolarChargeControllersState.refetch();
  };

  useEffect(() => {
    const intervalId = setInterval(refetch, 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
}

export default ResourceStateProvider;