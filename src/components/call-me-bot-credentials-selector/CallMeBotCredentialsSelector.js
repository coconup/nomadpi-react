import { useState, useEffect } from 'react';

import { getApisState } from '../../utils';

import {
  Box,
  Button,
  Fab,
  Icon,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

import {
  useGetCredentialsQuery,
  useUpdateCredentialsMutation,
  useCreateCredentialsMutation
} from '../../apis/van-pi/vanpi-app-api';

import Credentials from '../../models/Credentials';

const CallMeBotCredentialsSelector = () => {
  const apiCredentials = useGetCredentialsQuery();

  const [
    updateCredentialsTrigger,
    updateCredentialsState
  ] = useUpdateCredentialsMutation();

  const [
    createCredentialsTrigger,
    createCredentialsState
  ] = useCreateCredentialsMutation();

  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors
  } = getApisState([
    apiCredentials
  ]);

  const [editMode, setEditMode] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const onSave = () => {
    if(credentials.id) {
      updateCredentialsTrigger(credentials.toJSONPayload()).then(() => setEditMode(false));
    } else {
      createCredentialsTrigger(credentials.toJSONPayload()).then(() => setEditMode(false));
    }
  };

  const onChange = (attrs) => {
    let newCredentials = credentials.clone();
    Object.keys(attrs).forEach(k => newCredentials[k] = attrs[k]);
    setCredentials(newCredentials);
  }
  
  let content;

  if(isLoading) {
    content = <div>Loading</div>
  } else if(!credentials) {
    const serviceId = 'call-me-bot';
    const credentialsFromApi = apiCredentials.data.find(c => c.service_id === serviceId);
    if(credentialsFromApi) {
      setCredentials(credentialsFromApi);
    } else {
      const newCredentials = new Credentials({
        name: 'CallMeBot',
        service_id: serviceId
      });
      setCredentials(newCredentials);
      setEditMode(true);
    }
  } else {
    const { api_key } = credentials.value;

    content = (
      <Box sx={{display: 'flex', flexDirection: 'column', flex: 1}}>
        {
          editMode && (
            <Box sx={{display: 'flex', flexDirection: 'column', flex: 1}}>
              <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <TextField
                  label="CallMeBot API Key"
                  type="password"
                  value={api_key || ''}
                  sx={{margin: '15px 15px 15px', flex: 1}}
                  onChange={(event) => onChange({ value: { api_key: event.target.value } })}
                />
                <Fab 
                  size="small"
                  color="primary" 
                  aria-label="save"
                  onClick={onSave}
                  sx={{
                    marginRight: '15px'
                  }}
                >
                  <Icon>check</Icon>
                </Fab>
                {
                  credentials.id && (
                    <Fab 
                      size="small"
                      color="primary" 
                      aria-label="edit"
                      onClick={() => setEditMode(false)}
                      sx={{
                        marginRight: '15px'
                      }}
                    >
                      <Icon>close</Icon>
                    </Fab>
                  )
                }
              </Box>
            </Box>
          ) || (
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <TextField
                disabled
                label="Credentials"
                value={credentials.name || ''}
                sx={{margin: '5px 15px', flex: 1}}
              />
              <Fab 
                size="small"
                color="primary" 
                aria-label="edit"
                onClick={() => setEditMode(true)}
                sx={{
                  marginRight: '5px'
                }}
              >
                <Icon>edit</Icon>
              </Fab>
            </Box>
          )
        }
      </Box>
    );
  }

  // const modalStyle = {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  //   width: 400,
  //   bgcolor: 'background.paper',
  //   border: '2px solid #000',
  //   boxShadow: 24,
  //   p: 4,
  // };

  return (
    <Box>
      {content}
    </Box>
  )
}

export default CallMeBotCredentialsSelector;