import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import { Icon} from '@mui/material';

import { useGetWaterTanksQuery, useUpdateWaterTankMutation, useCreateWaterTankMutation } from '../../apis/nomadpi/nomadpi-app-api';

import WaterTankForm from '../water-tank-form/WaterTankForm';
import EmptyResourcePage from '../empty-resource-page/EmptyResourcePage';

import WaterTank from '../../models/WaterTank';

import Loading from '../ui/Loading';

const WaterTanksForm = () => {
  const initialState = {
    waterTanks: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiWaterTanks = useGetWaterTanksQuery();

  const [
    updateWaterTankTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useUpdateWaterTankMutation();

  const [
    createWaterTankTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useCreateWaterTankMutation();

  const isLoading = apiWaterTanks.isLoading;
  const isFetching = apiWaterTanks.isFetching;
  const isSuccess = apiWaterTanks.isSuccess;
  const isError = apiWaterTanks.isError;
  const error = apiWaterTanks.error;

  if(isSuccess && !state.init) {
    setState({
      ...state,
      waterTanks: apiWaterTanks.data,
      init: true
    });
  };

  const { waterTanks } = state;

  const addWaterTank = () => {
    const newWaterTank = new WaterTank({});

    setState({
      ...state,
      waterTanks: [
        ...waterTanks,
        newWaterTank
      ]
    })
  };

  const onWaterTankChange = (wifiWaterTank, attrs) => {
    const newWaterTanks = waterTanks.map(item => {
      if((item.id || item.pseudoId) === (wifiWaterTank.id || wifiWaterTank.pseudoId)) {
        const newItem = item.clone();
        Object.keys(attrs).forEach(k => newItem[k] = attrs[k]);
        return newItem;
      } else {
        return item;
      }
    })

    setState({...state, waterTanks: newWaterTanks})
  };

  const refetchData = () => {
    apiWaterTanks.refetch().then((result) => setState({...state, waterTanks: result.data}));
  };

  const saveWaterTanks = () => {
    waterTanks.forEach(item => {
      if(!!item.id) {
        updateWaterTankTrigger(item.toJSONPayload()).then(refetchData);
      } else {
        createWaterTankTrigger(item.toJSONPayload()).then(refetchData);
      }
    });
  };

  let content;
  if (isLoading) {
    return <Loading size={40} fullPage />
  } else if(isSuccess) {
    if(waterTanks.length === 0) {
      return (
        <EmptyResourcePage
          onClick={addWaterTank}
          buttonLabel={'Add a water tank'}
        />
      )
    }

    content = (
      <Box>
        {
          waterTanks.map(item =>(
            <WaterTankForm
              editable
              key={item.key}
              waterTank={item}
              onChange={onWaterTankChange}
            />
          ))
        }
      </Box>
    );
  } else if (isError) {
  	const {status, error: message} = error;
    content = <div>{message}</div>
  }

  return (
    <Box
      sx={{
        margin: '0px auto'
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          right: '50px',
          bottom: '50px'
        }}>
        <Fab 
          color="primary" 
          aria-label="add"
          onClick={addWaterTank}
        >
          <Icon>add</Icon>
        </Fab>
        <Fab
          color="primary" 
          aria-label="save"
          onClick={saveWaterTanks}
          sx={{
            marginLeft: '10px'
          }}
        >
          <Icon>check</Icon>
        </Fab>
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
        {content}
      </Box>
    </Box>
  )
}

export default WaterTanksForm;