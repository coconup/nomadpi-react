import BaseModel from './abstract/BaseModel';

// Initializer
class ModeSwitch extends BaseModel() {
  constructor(data) {
    super({
      ...data
    });
  }
  
  get frontendType() {
    return 'Mode';
  }

  get snakecaseType() {
    return 'mode';
  }

  get actor() {
    return `${this.snakecaseType}-${this.id}`;
  }

  get routes() {
    return {
      // toggle: ...
    };
  }

  toJSONPayload() {
    return {
      id: this.id,
      name: this.name,
      mode_key: this.mode_key,
      icon: this.icon
    }
  }
};

export default ModeSwitch;
