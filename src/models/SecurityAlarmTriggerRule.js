import BaseModel from './abstract/BaseModel';

// Initializer
class SecurityAlarmTriggerRule extends BaseModel() {
  constructor(data={}) {
    super(data);
  }

  get trigger_type_options() {
    return [
      {
        label: 'Sensor',
        value: 'sensor'
      }
    ]
  };

  get trigger_sensor_types() {
    return [
      'vibration'
    ]
  };

  toJSONPayload() {
    return {
      trigger_type: this.trigger_type,
      trigger_id: this.trigger_id
    }
  }
};

export default SecurityAlarmTriggerRule;
