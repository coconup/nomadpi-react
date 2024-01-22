import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

import { getApisState } from '../../utils';

import HeaterPage from '../heater-page/HeaterPage';
import BottomNavigation from '../ui/BottomNavigation';
import Container from '../ui/Container';

import {
  useGetHeatersQuery,
  useUpdateHeaterMutation
} from '../../apis/van-pi/vanpi-app-api';

export default function HeatersPage() {
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
    setIsSaved(false);
  };

  const refetchData = () => {
    apiHeaters.refetch().then((result) => setState({...state, heaters: result.data}));
  };

  const saveHeaters = () => {
    heaters.forEach(item => {
      updateHeaterTrigger(item.toJSONPayload()).then(refetchData);
    })
  };

  useEffect(() => {
    saveTimeout = setTimeout(() => {
      if(!isSaved) {
        setIsSaved(true);
      } else {
        saveHeaters();
      }
    }, 1000);
  }, [isSaved]);

  const selectedHeater = heaters.find(h => h.name === state.selectedTab);

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
      <BottomNavigation
        tabs={heaters.map(({ name }) => ({name}))}
        value={state.selectedTab}
        onChange={(event, value) => {
          setState({...state, selectedTab: value})
        }}
      />
    </Container>
  );
}