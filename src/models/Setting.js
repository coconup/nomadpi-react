import BaseModel from './abstract/BaseModel';

// Initializer
class Setting extends BaseModel() {
  constructor(data) {
    super(data)
  }

  toJSONPayload(state) {
    return {
      setting_key: this.setting_key,
      label: this.label,
      value: this.value
    }
  }
};

export default Setting;
