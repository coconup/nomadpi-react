import BaseModel from './abstract/BaseModel';

// Initializer
class SwitchGroup extends BaseModel() {
  constructor(data) {
    const parsedSwitches = JSON.parse(data.switches || '[]')

    super({
      ...data,
      switches: parsedSwitches,
    })
  }

  get enabled() {
    return !!this.switches.find(i => i.enabled)
  }

  toJSONPayload(state) {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      switches: JSON.stringify(this.switches)
    }
  }

  removeItem(index) {
    return this.switches.splice(index, 1)[0];
  }

  hasItem(item) {
    const parsedItem = this.parseSwitchItem(item);
    return !!this.switches.find(({switch_type, switch_id}) => {
      return parsedItem.switch_type === switch_type && parsedItem.switch_id === switch_id
    });
  }

  parseSwitchItem(item) {
    return {
      switch_type: item.snakecaseType,
      switch_id: item.id
    }
  }

  addItem(parsedItem, _index) {
    this.switches = [
      ...this.switches.slice(0, _index),
      parsedItem,
      ...this.switches.slice(_index)
    ].map((item, index) => ({...item, index}));
  }
};

export default SwitchGroup;