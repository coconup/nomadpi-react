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

  get connection_type_options() {
    return [
      {
        value: 'ble',
        label: 'Bluetooth'
      }
    ]
  };

  get device_type_options() {
    if(this.connection_type === 'ble') {
      return [
        {
          value: 'jbd',
          label: 'JBD BMS'
        }
      ]
    };
    
    return [];
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

export default Battery;
