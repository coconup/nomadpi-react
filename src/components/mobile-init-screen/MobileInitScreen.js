import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

import {
  Icon,
  Box,
  Fab,
  Paper,
  TextField,
} from '@mui/material';

import Container from '../ui/Container';

const MobileInitScreen = ({ onSave }) => {
  const [localHostname, setLocalHostname] = useState(null);
  const [remoteHostname, setRemoteHostname] = useState(null);

  const [error, setError] = useState({});

  useEffect(() => {
    const fetchPreferences = async () => {
      const { value: localHostname } = await Preferences.get({ key: 'local-hostname' });
      const { value: remoteHostname } = await Preferences.get({ key: 'remote-hostname' });

      setLocalHostname(localHostname);
      setRemoteHostname(remoteHostname);
    };

    fetchPreferences();
  }, []);

  const handleSave = async () => {
    if(!localHostname) {
      setError({...error, localHostname: 'Local app URL is required'});
    } else {
      await Preferences.set({
        key: 'local-hostname',
        value: localHostname,
      });

      console.log('set prefs')

      if(remoteHostname) {
        await Preferences.set({
          key: 'remote-hostname',
          value: remoteHostname,
        });
      };

      console.log('onSave', onSave)

      if(onSave) onSave();
    }
  }

  return (
    <Container>
      <Paper sx={{
        flex: 1,
        padding: '25px'
      }}>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <Box sx={{flex: 1, maxWidth: 600}}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <TextField
                label="Local app hostname"
                type="url"
                required
                error={!!error.localHostname}
                helperText={error.localHostname}
                placeholder="nomadpi.local"
                value={localHostname || ''}
                sx={{margin: '15px', display: 'flex'}}
                onChange={(event) => setLocalHostname(event.target.value)}
              />
              <TextField
                label="Remote app hostname"
                type="url"
                error={!!error.remoteHostname}
                helperText={error.remoteHostname}
                placeholder="mydomain.com"
                value={remoteHostname || ''}
                sx={{margin: '15px', display: 'flex'}}
                onChange={(event) => setRemoteHostname(event.target.value)}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
      <Box
        sx={{
          position: 'fixed',
          right: '50px',
          bottom: '50px'
        }}>
        <Fab
          color="primary" 
          aria-label="save"
          onClick={handleSave}
          sx={{
            marginLeft: '10px'
          }}
        >
          <Icon>check</Icon>
        </Fab>
      </Box>
    </Container>
  )
}

export default MobileInitScreen;