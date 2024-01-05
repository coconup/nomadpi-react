import BaseModel from './abstract/BaseModel';

// Initializer
class WifiRelaySwitch extends BaseModel() {
  constructor(data) {
    super({
      ...data
    });
  }
  
  get frontendType() {
    return 'WiFi Relay';
  }

  get snakecaseType() {
    return 'wifi_relay';
  }

  get actor() {
    return `${this.snakecaseType}-${this.id}`;
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
      icon: this.icon,
      vendor_id: this.vendor_id,
      mqtt_topic: this.mqtt_topic,
      relay_position: this.relay_position,
    }
  }
};

export default WifiRelaySwitch;
