const BaseModel = (parentClass = Object) => class extends parentClass {
  constructor(attributes) {
    super();
    Object.keys(attributes).map(k => this[k] = attributes[k]);
  }

  get isModelInstance() {
    return true;
  }

  get attributes() {
    return Object.keys(this);
  }

  toJSONPayload(method = this.inferMethod) {
    throw("toJSONPayload not implemented");
  }

  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
  }
};

export default BaseModel;