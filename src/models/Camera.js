import BaseModel from './abstract/BaseModel';
import { BASE_URL } from '../apis/nomadpi/nomadpi-app-api';

// Initializer
class Camera extends BaseModel() {
  constructor(data) {
    const parsedConnectionParams = JSON.parse(data.connection_params || '{}');

    super({
      ...data,
      connection_params: parsedConnectionParams
    })
  }

  get connection_type_options() {
    return [
      {
        value: 'frigate',
        label: 'Frigate'
      }
    ];
  };

  get thumbnailUrl() {
    return `${BASE_URL}/frigate/${this.connection_params.camera_id}/latest.jpg`;
  };

  toJSONPayload() {
    return {
      id: this.id,
      name: this.name,
      connection_type: this.connection_type,
      connection_params: JSON.stringify(this.connection_params)
    }
  }
};

export default Camera;
