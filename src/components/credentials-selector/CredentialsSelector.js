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
} from '../../apis/nomadpi/nomadpi-app-api';

import Credentials from '../../models/Credentials';

import Loading from '../ui/Loading';

const CredentialsSelector = ({ serviceId, serviceName, fields, disabled }) => {
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
    content = <Loading />
  } else if(!credentials) {
    const credentialsFromApi = apiCredentials.data.find(c => c.service_id === serviceId);
    if(credentialsFromApi) {
      setCredentials(credentialsFromApi);
    } else {
      const newCredentials = new Credentials({
        name: serviceName,
        service_id: serviceId
      });
      setCredentials(newCredentials);
      setEditMode(true);
    }
  } else {
    content = (
      <Box sx={{display: 'flex', flexDirection: 'column', flex: 1}}>
        {
          editMode && (
            <Box sx={{display: 'flex', flexDirection: 'column', flex: 1}}>
              {
                fields.map(({ key, label }, index) => {
                  return (
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                      <TextField
                        disabled={disabled}
                        key={`${serviceId}-${key}-edit`}
                        label={label}
                        type="password"
                        value={credentials.value[key] || (disabled ? '••••••' : '')}
                        sx={{margin: '15px 15px 15px', flex: 1}}
                        onChange={(event) => onChange({ value: { ...credentials.value, [key]: event.target.value } })}
                      />
                      {
                        index === fields.length - 1 && (
                          <Box>
                            <Fab 
                              disabled={disabled}
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
                                  disabled={disabled}
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
                        )
                      }
                    </Box>
                  )
                })
              }
            </Box>
          ) || (
            fields.map(({ key, label }, index) => {
              return (
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <TextField
                    disabled
                    key={`${serviceId}-${key}-show`}
                    label={label}
                    value="••••••••••••"
                    sx={{margin: '5px 15px', flex: 1}}
                  />
                  {
                    index === fields.length - 1 && (
                      <Fab 
                        disabled={disabled}
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
                    )
                  }
                </Box>
              )
            })
          )
        }
      </Box>
    );
  }

  return (
    <Box sx={{ mt: '10px'}}>
      {content}
    </Box>
  )
}

export default CredentialsSelector;