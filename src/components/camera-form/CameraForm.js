import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import { Icon} from '@mui/material';
import Camera from '../../models/Camera';

import BlinkCamerasCredentialsSelector from '../blink-cameras-credentials-selector/BlinkCamerasCredentialsSelector';

export default function CameraForm({camera, credentials, addCredentials, saveCredentials, onChange, onCredentialsChange, editable, credentialServices}) {
  const {
    name,
    vendor_id,
    product_id,
    vendor_id_options,
    product_id_options,
    connection_type_options,
    connection_type,
    connection_params
  } = camera;

  const {
    device_type,
    device_id,
    mqtt_topic
  } = connection_params;

  return (
    <Card sx={{ width: 400, margin: '20px' }}>
      <CardContent>
        <TextField
          label="Name"
          value={name || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(camera, {name: event.target.value})}
        />
        <FormControl sx={{display: 'flex', margin: '15px'}}>
          <InputLabel>Vendor</InputLabel>
          <Select
            value={vendor_id || ''}
            label="Vendor"
            onChange={(event) => {
              onChange(camera, {vendor_id: event.target.value, product_id: null, connection_type: null, connection_params: {}})}
            }
          >
            {
              vendor_id_options.map(({label, value}) => {
                return <MenuItem key={`vendor_id-${value}`} value={value}>{ label }</MenuItem>
              })
            }
          </Select>
        </FormControl>
        <FormControl sx={{display: 'flex', margin: '15px'}}>
          <InputLabel>Product</InputLabel>
          <Select
            value={product_id || ''}
            label="Product"
            onChange={(event) => onChange(camera, {product_id: event.target.value, connection_type: null, connection_params: {}})}
          >
            {
              product_id_options.map(({label, value}) => {
                return <MenuItem key={`product_id-${value}`} value={value}>{ label }</MenuItem>
              })
            }
          </Select>
        </FormControl>
        <FormControl sx={{display: 'flex', margin: '15px'}}>
          <InputLabel>Connection type</InputLabel>
          <Select
            value={connection_type || ''}
            label="Connection type"
            onChange={(event) => onChange(camera, {connection_type: event.target.value, connection_params: {}})}
          >
            {
              connection_type_options.map(({label, value}) => {
                return <MenuItem key={`connection_type-${value}`} value={value}>{ label }</MenuItem>
              })
            }
          </Select>
        </FormControl>
        {
          connection_type === 'http_api' && vendor_id === 'amazon' && product_id === 'blink' && (
            <Box>
              <BlinkCamerasCredentialsSelector
                credentials={credentials}
                onCredentialsChange={onCredentialsChange}
                addCredentials={addCredentials}
                saveCredentials={saveCredentials}
                credentialServices={credentialServices}
              />
            </Box>
          )
        }
      </CardContent>
    </Card>
  );
}