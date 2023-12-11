import BaseModel from './abstract/BaseModel';

// Initializer
class Switchable extends BaseModel() {
  constructor({key, type, data}) {
    if(!key || !type) {
      throw '`key` and `type` are required when creating an instance of `Switchable`'
    }

    const defaultAttributes = {
      group: {
        name: 'General',
        enabled: false,
        actionSwitches: []
      }
    }

    const {name, ...rest} = data;
      
    let parsedAttributes = {};
    try { 
      parsedAttributes = JSON.parse(name) 
    } catch(e) {
      if(typeof name === 'string' && !['wait', 'false'].includes(name)) {
        parsedAttributes = {
          name
        }
      }
    }
    
    super({
      ...defaultAttributes,
      ...rest,
      ...parsedAttributes,
      type,
      key
    });

    this.id = parseInt(this.key.replace(this.camelType, ''));
    this.group.index ||= 100 + this.id;
  }

  get camelType() {
    if(this.type === 'relay') {
      return 'Relay'
    } else if(this.type === 'wrelay') {
      return 'WifiRelay'
    }
  }
  
  get frontendType() {
    if(this.type === 'relay') {
      return 'Relay'
    } else if(this.type === 'wrelay') {
      return 'WiFi Relay'
    }
  }

  get routes() {
   	return {
      toggle: `toggle/${this.type}/${this.id}`
   	};
 	}

  get tags() {
    return [
      {
        id: this.id,
        type: this.type
      }
    ]
  }

  get actionSwitches() {
    return this._actionSwitches || [];
  }

  set actionSwitches(val) {
    this._actionSwitches = val;
  }

  get attributesJSON() {
    return JSON.stringify({
      name: this.name,
      group: this.group,
      icon: this.icon,
      enabled: this.enabled,
      actionSwitches: this.actionSwitches
    })
  }

  toJSONPayload() {
    return {
      id: this.id,
      type: this.type,
      name: this.attributesJSON
    }
  }
};

export default Switchable;
