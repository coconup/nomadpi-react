import { useState } from 'react';

import { getApisState } from '../../utils';

import {
  Box,
  Fab,
  Icon
} from '@mui/material';

import {
  useGetCamerasQuery,
  useUpdateCameraMutation,
  useCreateCameraMutation,
} from '../../apis/nomadpi/nomadpi-app-api';

import CameraForm from '../camera-form/CameraForm';
import EmptyResourcePage from '../empty-resource-page/EmptyResourcePage';

import Camera from '../../models/Camera';

import Loading from '../ui/Loading';

const CamerasForm = () => {
  const initialState = {
    cameras: [],
    init: false
  };

  const [state, setState] = useState(initialState);

  const { 
    cameras
  } = state;

  let apiCameras = useGetCamerasQuery();

  const [
    updateCameraTrigger, 
    updateCameraState
  ] = useUpdateCameraMutation();

  const [
    createCameraTrigger, 
    createCameraState
  ] = useCreateCameraMutation();

  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors
  } = getApisState([
    apiCameras
  ]);

  if(isSuccess && !state.init) {
    setState({
      ...state,
      cameras: apiCameras.data,
      init: true
    });
  };

  const addCamera = () => {
    const newCamera = new Camera({});

    setState({
      ...state,
      cameras: [
        ...cameras,
        newCamera
      ]
    })
  };

  const onCameraChange = (camera, attrs) => {
    const newCameras = cameras.map(item => {
      if((item.id || item.pseudoId) === (camera.id || camera.pseudoId)) {
        const newItem = item.clone();
        Object.keys(attrs).forEach(k => newItem[k] = attrs[k]);
        return newItem;
      } else {
        return item;
      }
    })

    setState({...state, cameras: newCameras})
  };

  const refetchCamerasData = () => {
    apiCameras.refetch().then((result) => setState({...state, cameras: result.data}));
  };

  const saveCameras = () => {
    cameras.forEach(item => {
      if(!!item.id) {
        updateCameraTrigger(item.toJSONPayload()).then(refetchCamerasData);
      } else {
        createCameraTrigger(item.toJSONPayload()).then(refetchCamerasData);
      }
    });
  };

  let content;
  if (isLoading) {
    return <Loading size={40} fullPage />
  } else if(isSuccess) {
    if(cameras.length === 0) {
      return (
        <EmptyResourcePage
          onClick={addCamera}
          buttonLabel={'Add a camera'}
        />
      )
    }

    content = (
      <Box>
        {
          cameras.map(item =>(
            <CameraForm
              editable
              key={item.key}
              camera={item}
              onChange={onCameraChange}
            />
          ))
        }
      </Box>
    );
  } else if (isError) {
  	const {status, error: message} = errors[0];
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
          onClick={addCamera}
        >
          <Icon>add</Icon>
        </Fab>
        <Fab
          color="primary" 
          aria-label="save"
          onClick={saveCameras}
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

export default CamerasForm;