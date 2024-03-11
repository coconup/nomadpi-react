import BaseModel from './abstract/BaseModel';

// Initializer
class Heater extends BaseModel() {
  constructor(data) {
    const parsedConnectionParams = JSON.parse(data.connection_params || '{}');
    const parsedHeaterSettings = JSON.parse(data.heater_settings || '{}');

    super({
      ...data,
      connection_params: parsedConnectionParams,
      heater_settings: parsedHeaterSettings
    })
  }
  
  get frontendType() {
    return 'Heater';
  }

  get snakecaseType() {
    return 'heater';
  }

  get vendor_id_options() {
    return [
      {
        value: 'webasto',
        label: 'Webasto'
      }
    ]
  };

  get product_id_options() {
    if(this.vendor_id === 'webasto') {
      return [
        {
          value: 'thermo_top_evo_5',
          label: 'Thermo Top Evo 5'
        }
      ]
    }

    return [];
  };

  get connection_type_options() {
    if(this.vendor_id === 'webasto' && this.product_id === 'thermo_top_evo_5') {
      return [
        {
          value: 'usb',
          label: 'USB (W-Bus)'
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
      connection_params: JSON.stringify(this.connection_params),
      heater_settings: JSON.stringify(this.heater_settings)
    }
  }
};

export default Heater;
