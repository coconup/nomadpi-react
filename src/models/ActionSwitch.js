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

  get actor() {
    return `${this.snakecaseType}-${this.id}`;
  }

  toJSONPayload(state) {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      relay_switches: JSON.stringify(this.relay_switches.map(({item_id, on_state, off_state}) => ({item_id, on_state, off_state})))
    }
  }
};

export default ActionSwitch;
