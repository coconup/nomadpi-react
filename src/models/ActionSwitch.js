import BaseModel from './abstract/BaseModel';
import Switchable from './Switchable';

// Initializer
class ActionSwitch extends BaseModel() {
  constructor({name, icon, items=[]}) {
    if(!name) {
      throw '`name`is required when creating an instance of `ActionSwitch`';
    }
    
    super({
      name,
      icon,
      items
    });

    this.id = this.name;
    console.log(this.id)
  }

  set name(val) {
    this._name = val;
  }

  get name() {
    return this._name;
  }

  set icon(val) {
    this._icon = val;
  }

  get icon() {
    return this._icon;
  }

  set items(val) {
    this._items = val;
  }

  get items() {
    return this._items;
  }

  toJSONPayload(state) {
    return {
      name: this.name,
      icon: this.icon,
      id: this.id || this.name,
      state
    }
  }
};

const validateItems = (items) => {
  if(items.find(el => el.constructor !== Switchable)) {
    throw '`ActionSwitch` `items` must be instances of `Switchable`'
  }
};

const actionSwitchesFromItems = (items) => {
  validateItems(items);

  console.log('items', items)

  let actionSwitchesNames = [...new Set(items.map(({actionSwitches=[]}) => actionSwitches.map(a => a.name)).flat())];

  return actionSwitchesNames.map(name => {
    const _name = name
    const actionSwitch = items.map(({actionSwitches=[]}) => actionSwitches).flat(2).find(a => a.name === name);
    const actionSwitchItems = (
      items
        .filter(el => el.actionSwitches.find(a => a.name === name))
        .map((switchable) => {
          const actionSwitch = switchable.actionSwitches.find(a => a.name === name);

          if(name) {
            return {
              switchable,
              state: actionSwitch.state,
              name: actionSwitch.name,
              id: actionSwitch.id
            }
          }
        })
    );

    return new ActionSwitch({
      name: actionSwitch.name,
      icon: actionSwitch.icon,
      items: actionSwitchItems
    })
  })
};

export {
  ActionSwitch,
  actionSwitchesFromItems
};
