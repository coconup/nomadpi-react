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
  useGetCredentialsQuery();

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

  const initialState = {
    edit_mode: false
  }

  const [state, setState] = useState(initialState);

  const {
    edit_mode
  } = state;

  const onSave = () => {
    saveCredentials(credentials, () => setState(initialState));
  };
  
  let content;
  if(!credentials) {
    addCredentials({
      name: 'CallMeBot',
      service_id: 'call_me_bot'
    })
  } else {
    const {
      email,
      password
    } = credentials.value;

    if(!state.edit_mode && !credentials.id) {
      setState({...state, edit_mode: true});
    };

    content = (
      <Box sx={{display: 'flex', flexDirection: 'column', flex: 1}}>
        {
          edit_mode && (
            <Box sx={{display: 'flex', flexDirection: 'column', flex: 1}}>
              <TextField
                label="Email"
                value={email || ''}
                sx={{margin: '15px 15px 15px', flex: 1}}
                onChange={(event) => onCredentialsChange(credentials, {value: {...credentials.value, email: event.target.value}})}
              />
              <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <TextField
                  label="Password"
                  type="password"
                  value={password || ''}
                  sx={{margin: '5px 15px', flex: 1}}
                  onChange={(event) => onCredentialsChange(credentials, {value: {...credentials.value, password: event.target.value}})}
                />
                <Fab 
                  size="small"
                  color="primary" 
                  aria-label="edit"
                  onClick={onLogin}
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
                      onClick={() => setState({...state, edit_mode: false})}
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
                onClick={() => setState({...state, edit_mode: true})}
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

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box>
      <Modal open={credentials.client_verification_required || false}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Verification required
          </Typography>
          <TextField
            type="number"
            label="Verification code"
            value={verification_code}
            sx={{margin: '15px', display: 'flex'}}
            onChange={(event) => setState({...state, verification_code: event.target.value})}
          />
          <Button variant="contained" onClick={onVerificationSubmit}>Submit</Button>
        </Box>
      </Modal>
      {content}
    </Box>
  )
}

export default CallMeBotCredentialsSelector;