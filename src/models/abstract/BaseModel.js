const BaseModel = (parentClass = Object) => class extends parentClass {
  constructor(attributes={}) {
    super();
    Object.keys(attributes).map(k => this[k] = attributes[k]);

    if(!this.id) {
      this.pseudoId = parseInt(Math.random()*1000000)
    };
  }

  get key() {
    return `${this.constructor.name}-${this.id || this.pseudoId}`
  }

  get snakecaseType() {
    throw `\`snakecaseType\` is not implemented`;
  }

  get tags() {
    return [
      {
        id: this.id,
        type: this.constructor.name
      }
    ]
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