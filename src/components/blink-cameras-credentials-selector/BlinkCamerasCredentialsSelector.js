import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import { Icon} from '@mui/material';

import {
  useBlinkCamerasLoginMutation,
  useBlinkCamerasVerifyMutation
} from '../../apis/van-pi/vanpi-services-api';

const BlinkCredentialsCredentialsSelector = ({credentials: credentialsList=[], credentialServices, addCredentials, onCredentialsChange, saveCredentials}) => {
  const initialState = {
    verification_code: '',
    edit_mode: false
  }

  const [state, setState] = useState(initialState);

  const {
    verification_code,
    edit_mode
  } = state;

  const [
    loginTrigger, 
    loginRequest
  ] = useBlinkCamerasLoginMutation();

  const [
    verifyTrigger, 
    verifyRequest
  ] = useBlinkCamerasVerifyMutation();

  const credentials = credentialsList.find(c => c.service_id === credentialServices.amazon_blink);

  const onLogin = () => {
    const {
      email,
      password
    } = credentials.value;

    const payload = {
      unique_id: crypto.randomUUID(),
      reauth: true,
      email,
      password
    };

    loginTrigger(payload).then(({data}) => {
      if(data) {
        onCredentialsChange(
          credentials,
          {
            ...credentials,
            client_verification_required: data.account.client_verification_required,
            value: {
              ...credentials.value,
              auth_token: data.auth.token,
              account_id: data.account.account_id,
              client_id: data.account.client_id,
              tier: data.account.tier,
            }
          }
        )
      }
    });
  };

  const onVerificationSubmit = () => {
    const {
      tier,
      account_id,
      client_id,
      auth_token
    } = credentials.value;

    verifyTrigger({tier, account_id, client_id, auth_token, verification_code}).then(({data={}}) => {
      if(data.valid) {
        saveCredentials(credentials, () => setState(initialState));
      }
    })
  };
  
  let content;
  if(!credentials) {
    addCredentials({
      name: 'Blink cameras',
      service_id: credentialServices.amazon_blink
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
        <Divider sx={{margin: '15px'}} />
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

export default BlinkCredentialsCredentialsSelector;