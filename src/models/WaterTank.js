import BaseModel from './abstract/BaseModel';

// Initializer
class WaterTank extends BaseModel() {
  constructor(data) {
    const parsedConnectionParams = JSON.parse(data.connection_params || '{}');
    const parsedVolumetricParams = JSON.parse(data.volumetric_params || '{}');

    super({
      ...data,
      connection_params: parsedConnectionParams,
      volumetric_params: parsedVolumetricParams,
    })
  }

  toJSONPayload() {
    return {
      id: this.id,
      name: this.name,
      connection_type: this.connection_type,
      connection_params: JSON.stringify(this.connection_params),
      volumetric_type: this.volumetric_type,
      volumetric_params: JSON.stringify(this.volumetric_params)
    }
  }
};

export default WaterTank;
