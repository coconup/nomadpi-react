import {
  Card,
  CardContent,
  Box,
  TextField,
} from '@mui/material';

import FrigateCameraSelector from '../frigate/FrigateCameraSelector';

import Select from '../ui/Select';

export default function CameraForm({camera, onChange, editable }) {
  const {
    name,
    connection_type_options,
    connection_type,
    connection_params={}
  } = camera;

  const { camera_id } = connection_params;

  return (
    <Card sx={{ width: '80vw', maxWidth: 400, margin: '20px' }}>
      <CardContent>
        <TextField
          label="Name"
          value={name || ''}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange(camera, {name: event.target.value})}
        />
        <Select
          label="Connection type"
          value={connection_type}
          onChange={(event) => onChange(camera, {connection_type: event.target.value, connection_params: {}})}
          options={connection_type_options}
        />
        {
          connection_type === 'frigate' && (
            <Box>
              <FrigateCameraSelector
                cameraId={camera_id}
                onChange={({ camera_id }) => onChange(camera, {connection_params: { ...connection_params, camera_id }})}
              />
            </Box>
          )
        }
      </CardContent>
    </Card>
  );
}