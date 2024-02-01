import { useState } from 'react';

import {
  getApisState
} from '../../utils';

import {
  useBlinkCamerasHomescreenQuery
} from '../../apis/van-pi/vanpi-app-api';

import Select from '../ui/Select';

const BlinkCameraSelector = ({ cameraId, onChange }) => {
  const [cameras, setCameras] = useState(null);

  const apiBlinkCamerasHomescreen = useBlinkCamerasHomescreenQuery();

  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors
  } = getApisState([
    apiBlinkCamerasHomescreen
  ]);

  if(isSuccess && !cameras) {
    setCameras(apiBlinkCamerasHomescreen.data.cameras);
  }
  
  if (isLoading) {
    return <div>Loading</div>
  } else if(isSuccess && cameras) {
    const options = cameras.map(({ id: value, name: label }) => ({
      label,
      value
    }))

    return (
      <Select
        label="Blink camera"
        value={cameraId}
        onChange={(event) => {
          const camera = cameras.find(c => c.id === event.target.value);
          
          const {
            network_id,
            id: camera_id
          } = camera;

          onChange({ network_id, camera_id });
        }}
        options={options}
      />
    )
  } else if (isError) {
    const {status, error: message} = errors[0];
    return <div>{message}</div>
  }
}

export default BlinkCameraSelector;