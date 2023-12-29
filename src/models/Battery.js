import BaseModel from './abstract/BaseModel';

// Initializer
class Battery extends BaseModel() {
  constructor(data) {
    const parsedConnectionParams = JSON.parse(data.connection_params || '{}')

    super({
      ...data,
      connection_params: parsedConnectionParams,
    })
  }

  toJSONPayload() {
    return {
      id: this.id,
      name: this.name,
      connection_type: this.connection_type,
      connection_params: JSON.stringify(this.connection_params)
    }
  }
};

export default Battery;
