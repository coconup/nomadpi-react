import BaseModel from './abstract/BaseModel';

// Initializer
class SecurityAlarmCameraRule extends BaseModel() {
  constructor(data={}) {
    super(data);
  }

  get arm_on_options() {
    return [
      {
        label: 'Alarm is enabled',
        value: 'alarm_on'
      },
      {
        label: 'Alarm is triggered',
        value: 'trigger'
      },
    ]
  };

  toJSONPayload() {
    return {
      camera_id: this.camera_id,
      trigger_on_motion: this.trigger_on_motion,
      trigger_on_detect: this.trigger_on_detect,
      arm_on: this.arm_on, // 'trigger' / 'alarm_on'
    }
  }
};

export default SecurityAlarmCameraRule;
