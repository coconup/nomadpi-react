import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import { Icon} from '@mui/material';

import { useGetCamerasQuery, useUpdateCameraMutation, useCreateCameraMutation } from '../../apis/van-pi/vanpi-app-api';
import { useGetCredentialsQuery, useUpdateCredentialsMutation, useCreateCredentialsMutation } from '../../apis/van-pi/vanpi-services-api';

import CameraForm from '../camera-form/CameraForm';

import Camera from '../../models/Camera';
import Credentials from '../../models/Credentials';

const CamerasForm = () => {
  const initialState = {
    credentials: [],
    cameras: [],
    init: false
  };

  const [state, setState] = useState(initialState);  

  let apiCameras = useGetCamerasQuery();

  const [
    updateCameraTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useUpdateCameraMutation();

  const [
    createCameraTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useCreateCameraMutation();

  let apiCredentials = useGetCredentialsQuery();

  const [
    updateCredentialsTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useUpdateCredentialsMutation();

  const [
    createCredentialsTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useCreateCredentialsMutation();

  const isLoading = apiCameras.isLoading || apiCredentials.isLoading;
  const isFetching = apiCameras.isFetching || apiCredentials.isFetching;
  const isSuccess = apiCameras.isSuccess && apiCredentials.isSuccess;
  const isError = apiCameras.isError || apiCredentials.isError;
  const error = apiCameras.error || apiCredentials.error;

  const { 
    cameras,
    credentials
  } = state;

  const credentialServices = {
    amazon_blink: 'blink-cameras'
  };

  if(isSuccess && !state.init) {
    const missingCredentials = Object.values(credentialServices).filter(s => !apiCredentials.data.find(a => a.service_id === s)).map(service_id => {
      return new Credentials({service_id});
    });

    setState({
      ...state,
      cameras: apiCameras.data,
      credentials: [
        ...apiCredentials.data,
        ...missingCredentials
      ],
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

  const addCredentials = (attrs) => {
    const newCredentials = new Credentials(attrs);

    setState({
      ...state,
      credentials: [
        ...credentials,
        newCredentials
      ]
    })
  };

  const onCredentialsChange = (credentialsItem, attrs) => {
    const newCredentials = credentials.map(item => {
      if((item.id || item.pseudoId) === (credentialsItem.id || credentialsItem.pseudoId)) {
        const newItem = item.clone();
        Object.keys(attrs).forEach(k => newItem[k] = attrs[k]);
        return newItem;
      } else {
        return item;
      }
    })

    setState({...state, credentials: newCredentials});
  };

  const refetchCredentialsData = () => {
    apiCredentials.refetch().then((result) => setState({...state, credentials: result.data}));
  };

  const saveCredentials = (item, callback) => {
    if(!!item.id) {
      updateCredentialsTrigger(item.toJSONPayload()).then(refetchCredentialsData).then(callback);
    } else {
      createCredentialsTrigger(item.toJSONPayload()).then(refetchCredentialsData).then(callback);
    };
  };

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if(isSuccess) {
    content = (
      <Box>
        {
          cameras.map(item =>(
            <CameraForm
              credentials={credentials}
              addCredentials={addCredentials}
              saveCredentials={saveCredentials}
              onCredentialsChange={onCredentialsChange}
              credentialServices={credentialServices}
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