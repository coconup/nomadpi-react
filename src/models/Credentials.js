import BaseModel from './abstract/BaseModel';

// Initializer
class Credentials extends BaseModel() {
  constructor(data) {
    const parsedValue = JSON.parse(data.value || '{}');

    super({
      ...data,
      value: parsedValue
    })
  }

  toJSONPayload() {
    return {
      id: this.id,
      name: this.name,
      service_id: this.service_id,
      value: JSON.stringify(this.value)
    }
  }
};

export default Credentials;
