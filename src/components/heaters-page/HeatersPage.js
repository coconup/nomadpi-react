import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { useLocation } from "wouter";

import { getApisState } from '../../utils';

import HeaterPage from '../heater-page/HeaterPage';
import BottomNavigation from '../ui/BottomNavigation';
import Container from '../ui/Container';

import EmptyResourcePage from '../empty-resource-page/EmptyResourcePage';

import {
  useGetHeatersQuery,
  useUpdateHeaterMutation
} from '../../apis/nomadpi/nomadpi-app-api';

export default function HeatersPage() {
  const [location, setLocation] = useLocation();

  const initialState = {
    heaters: [],
    init: false
  };

  const [state, setState] = useState(initialState);
  const [isSaved, setIsSaved] = useState(false);

  const {
    heaters
  } = state;

  const apiHeaters = useGetHeatersQuery();
  const [
    updateHeaterTrigger, 
    updateHeaterState
  ] = useUpdateHeaterMutation();
  
  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors
  } = getApisState([
    apiHeaters
  ]);

  let saveTimeout;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      heaters: apiHeaters.data,
      selectedTab: (apiHeaters.data[0] || {}).name,
      init: true
    });
  };

  function decimalToTime(value) {
    const hours = Math.floor(value);
    const minutes = Math.round((value % 1) * 60);

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  const onChange = (heater, attrs) => {
    const newHeaters = heaters.map(item => {
      if((item.id || item.pseudoId) === (heater.id || heater.pseudoId)) {
        const newItem = item.clone();
        Object.keys(attrs).forEach(k => newItem[k] = attrs[k]);
        return newItem;
      } else {
        return item;
      }
    })
    clearTimeout(saveTimeout);
    setState({...state, heaters: newHeaters});
    saveTimeout = setTimeout(() => {
      setIsSaved(false);
    }, 1000);
  };

  const refetchData = () => {
    try {
      apiHeaters.refetch().then((result) => setState({...state, heaters: result.data}));  
    } catch(e) {
      console.error('error refetching heaters: ', e);
    }
  };

  const saveHeaters = () => {
    heaters.forEach(item => {
      updateHeaterTrigger(item.toJSONPayload()).then(refetchData);
    })
  };

  useEffect(() => {
    if(!isSaved) {
      setIsSaved(true);
      saveHeaters();
    }
  }, [isSaved]);

  const selectedHeater = heaters.find(h => h.name === state.selectedTab);

  if(heaters.length === 0) {
    return (
      <EmptyResourcePage
        onClick={() => setLocation("/settings/heaters")}
        buttonLabel='Go to settings'
        icon={'settings'}
      />
    )
  }

  return (
    <Container>
      {
        selectedHeater && (
          <HeaterPage
            heater={selectedHeater}
            onChange={onChange}
          />
        )
      }
      {
        heaters.length > 1 && (
          <BottomNavigation
            tabs={heaters.map(({ name }) => ({name}))}
            value={state.selectedTab}
            onChange={(event, value) => {
              setState({...state, selectedTab: value})
            }}
          />
        )
      }
    </Container>
  );
}