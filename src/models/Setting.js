import BaseModel from './abstract/BaseModel';

// Initializer
class Setting extends BaseModel() {
  constructor(data) {
    super(data)

    this.parseValue();
  }

  parseValue() {
    if(['json', 'boolean'].includes(this.type)) {
      this.value = JSON.parse(this.value)
    }
  }

  get encodedValue() {
    if(this.value !== undefined && ['json', 'boolean'].includes(this.type)) {
      return JSON.stringify(this.value);
    } else {
      return this.value;
    }
  }

  toJSONPayload(state) {
    return {
      setting_key: this.setting_key,
      label: this.label,
      value: this.encodedValue
    }
  }
};

export default Setting;
