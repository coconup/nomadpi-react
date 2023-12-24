import BaseModel from './abstract/BaseModel';

// Initializer
class RelaySwitch extends BaseModel() {
  constructor(data) {
    super({
      ...data
    });
  }
  
  get frontendType() {
    return 'Relay';
  }

  get snakecaseType() {
    return 'relay';
  }

  get routes() {
    return {
      // toggle: `toggle/${this.relay_position}`
    };
  }

  toJSONPayload() {
    return {
      id: this.id,
      name: this.name,
      relay_position: this.relay_position,
      icon: this.icon
    }
  }
};

export default RelaySwitch;
