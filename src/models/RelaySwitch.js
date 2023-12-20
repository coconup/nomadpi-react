import BaseModel from './abstract/BaseModel';

// Initializer
class RelaySwitch extends BaseModel() {
  constructor(data) {
    super({
      ...data,
      enabled: data.enabled === 1
    });
  }
  
  get frontendType() {
    if(this.target_type === 'relay') {
      return 'Relay'
    } else if(this.target_type === 'wifi_relay') {
      return 'WiFi Relay'
    }
  }

  get snakecaseType() {
    return 'relay_switch';
  }

  get routes() {
    return {
      // toggle: `toggle/${this.target_type}/${this.id}`
    };
  }

  toJSONPayload() {
    return {
      id: this.id,
      target_id: this.target_id,
      target_type: this.target_type,
      name: this.name,
      icon: this.icon,
      enabled: this.enabled
    }
  }
};

export default RelaySwitch;
