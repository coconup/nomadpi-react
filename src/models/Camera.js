import BaseModel from './abstract/BaseModel';

// Initializer
class Camera extends BaseModel() {
  constructor(data) {
    const parsedConnectionParams = JSON.parse(data.connection_params || '{}');

    super({
      ...data,
      connection_params: parsedConnectionParams
    })
  }

  get vendor_id_options() {
    return [
      {
        value: 'amazon',
        label: 'Amazon'
      }
    ]
  };

  get product_id_options() {
    if(this.vendor_id === 'amazon') {
      return [
        {
          value: 'blink',
          label: 'Blink cameras'
        }
      ]
    }

    return [];
  };

  get connection_type_options() {
    if(this.vendor_id === 'amazon' && this.product_id === 'blink') {
      return [
        {
          value: 'http_api',
          label: 'HTTP API'
        }
      ]
    }

    return [];
  };

  toJSONPayload() {
    return {
      id: this.id,
      name: this.name,
      vendor_id: this.vendor_id,
      product_id: this.product_id,
      connection_type: this.connection_type,
      connection_params: JSON.stringify(this.connection_params)
    }
  }
};

export default Camera;
