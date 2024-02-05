import { useState } from 'react';

import {
  getApisState
} from '../../utils';

import {
  useGetFrigateConfigQuery
} from '../../apis/van-pi/vanpi-app-api';

import Select from '../ui/Select';

const FrigateCameraSelector = ({ cameraId, onChange }) => {
  const [cameras, setCameras] = useState(null);

  const apiFrigateConfig = useGetFrigateConfigQuery();

  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors
  } = getApisState([
    apiFrigateConfig
  ]);

  if(isSuccess && !cameras) {
    const apiCameras = Object.keys(apiFrigateConfig.data.cameras).map(camera_id => {
      const {
        name
      } = apiFrigateConfig.data.cameras[camera_id];
      
      return {
        camera_id,
        name
      }
    });

    setCameras(apiCameras);
  }
  
  if (isLoading) {
    return <div>Loading</div>
  } else if(isSuccess && cameras) {
    const options = cameras.map(({ camera_id: value, name: label }) => ({
      label,
      value
    }))

    return (
      <Select
        label="Camera"
        value={cameraId}
        onChange={(event) => {
          const camera = cameras.find(c => c.camera_id === event.target.value);
          
          const {
            camera_id
          } = camera;

          onChange({ camera_id });
        }}
        options={options}
      />
    )
  } else if (isError) {
    const {status, error: message} = errors[0];
    return <div>{message}</div>
  }
}

export default FrigateCameraSelector;