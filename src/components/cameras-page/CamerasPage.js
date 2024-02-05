import { useState } from 'react';

import {
  getApisState
} from '../../utils';

import {
  Box,
  ButtonBase,
  Unstable_Grid2 as Grid
} from '@mui/material';

import Container from '../ui/Container';

import CameraPage from '../camera-page/CameraPage';

import {
  useGetCamerasQuery,
  useGetFrigateConfigQuery
} from '../../apis/van-pi/vanpi-app-api';

export default function CamerasPage() {
  const initialState = {
    cameras: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  const apiCameras = useGetCamerasQuery();
  const apiFrigateConfig = useGetFrigateConfigQuery();

  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors
  } = getApisState([
    apiCameras,
    apiFrigateConfig
  ]);

  if(isSuccess && !state.init) {
    setState({
      ...state,
      cameras: apiCameras.data,
      init: true
    });
  };

  const {
    cameras
  } = state;

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if(isSuccess && state.init) {
    content = cameras.map(camera => (
      <Grid 
        key={camera.key}
        xs={12}
        sm={8}
        md={6}
        // lg={4}
      >
        <CameraPage
          camera={camera}
        />
      </Grid>
    ));
  } else if (isError) {
    const {status, error: message} = errors[0];
    content = <div>{message}</div>
  }

  return (
    <Container>
      <Grid
        container
        spacing={2}
        sx={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {content}
      </Grid>
    </Container>
  );
}