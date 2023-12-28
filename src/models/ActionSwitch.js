import BaseModel from './abstract/BaseModel';
import RelaySwitch from './RelaySwitch';

// Initializer
class ActionSwitch extends BaseModel() {
  constructor(data) {
    const parsedRelaySwitches = JSON.parse(data.switches || '[]')

    super({
      ...data,
      switches: parsedRelaySwitches,
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
      switches: JSON.stringify(this.switches.map(({switch_type, switch_id, on_state}) => ({switch_type, switch_id, on_state})))
    }
  }
};

export default ActionSwitch;
