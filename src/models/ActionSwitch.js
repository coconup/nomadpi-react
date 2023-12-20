import BaseModel from './abstract/BaseModel';
import RelaySwitch from './RelaySwitch';

// Initializer
class ActionSwitch extends BaseModel() {
  constructor(data) {
    const parsedRelaySwitches = JSON.parse(data.relay_switches || '[]')

    super({
      ...data,
      relay_switches: parsedRelaySwitches,
    })
  }

  get frontendType() {
    return 'Action Switch';
  }

  get snakecaseType() {
    return 'action_switch';
  }

  toJSONPayload(state) {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      relay_switches: JSON.stringify(this.relay_switches.map(({relay_switch_id, on_state, off_state}) => ({relay_switch_id, on_state, off_state})))
    }
  }
};

const validateItems = (items) => {
  if(items.find(el => el.constructor !== RelaySwitch)) {
    throw '`ActionSwitch` `items` must be instances of `RelaySwitch`'
  }
};

export default ActionSwitch;
