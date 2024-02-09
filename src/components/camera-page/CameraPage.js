import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Icon,
  Paper,
  Typography
} from '@mui/material';

import Metric from '../ui/Metric';

export default function CameraPage({ camera }) {
  const [ts, setTs] = useState(null);

  const {
    id,
    name,
    connection_params,
    thumbnailUrl
  } = camera;

  const {
    camera_id
  } = connection_params;

  const frigateConfig = useSelector(state => state.frigate.config);

  useEffect(() => {
    const intervalId = setInterval(() => setTs(Math.floor(Date.now() / 1000)), 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  let content;
  if (!frigateConfig) {
    content = <div>Loading</div>
  } else {
    const cameraConfig = frigateConfig.cameras[camera_id];

    const {
      motion,
      detect,
      snapshots,
      record
    } = cameraConfig;

    const motionEnabled = !!motion;
    const detectEnabled = detect.enabled;
    const snapshotsEnabled = snapshots.enabled;
    const recordEnabled = record.enabled;

    content = (
      <Card>
        <img
          style={{
            width: '100%'
          }}
          src={`${thumbnailUrl}?h=300&ts=${ts}`}
        />
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h5">
            { name }
          </Typography>
          <Box>
            <Icon sx={{
              color: motionEnabled ? 'primary.main' : 'text.disabled',
              mr: '8px'
            }}>
              videocam
            </Icon>
            <Icon sx={{
              color: detectEnabled ? 'primary.main' : 'text.disabled',
              mr: '8px'
            }}>
              sensor_occupied
            </Icon>
            <Icon sx={{
              color: recordEnabled ? 'primary.main' : 'text.disabled',
              mr: '8px'
            }}>
              camera_roll
            </Icon>
            <Icon sx={{
              color: snapshotsEnabled ? 'primary.main' : 'text.disabled',
              mr: '8px'
            }}>
              collections
            </Icon>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return content;
}