import BaseModel from './abstract/BaseModel';
import Switchable from './Switchable';

// Initializer
class SwitchableGroup extends BaseModel() {
  constructor({name, icon, rank, items=[]}) {
    if(!name) {
      throw '`name`is required when creating an instance of `SwitchableGroup`';
    } else {
      validateItems(items);
    }
    
    super({
      name,
      icon,
      rank,
      items
    });

    this.id = this.name;
  }

  set name(val) {
    this._name = val;
    this.updateItems();
  }

  get name() {
    return this._name;
  }

  set icon(val) {
    this._icon = val;
    this.updateItems();
  }

  get icon() {
    return this._icon;
  }

  set rank(val) {
    this._rank = val;
    this.updateItems();
  }

  get rank() {
    return this._rank;
  }

  get enabled() {
    return !!this.items.find(i => i.enabled)
  }

  toJSONPayload() {
    return {
      name: this.name,
      icon: this.icon,
      rank: this.rank
    }
  }

  removeItem(index) {
    const item = this.items.splice(index, 1)[0];
    this.updateItems();
    return item;
  }

  addItem(item, index) {
    const items = [
      ...this.items.slice(0, index),
      item,
      ...this.items.slice(index)
    ]
    this.items = items;
    this.updateItems();
  }

  updateItems() {
    if(this.items) {
      this.items = this.items.map((item, index) => {
        const newItem = item.clone()
        newItem.group = {
          ...this.toJSONPayload(),
          index
        }
        return newItem;
      });
    }
  }
};

const validateItems = (items) => {
  if(items.find(el => el.constructor !== Switchable)) {
    throw '`SwitchableGroup` `items` must be instances of `Switchable`'
  }
};

const switchableGroupsFromItems = (items) => {
  validateItems(items);

  let groupNames = [...new Set(items.map(({group}) => group.name))];

  return groupNames.map(groupName => {
    const groupItems = (
      items
        .filter(el => el.group.name === groupName)
        .sort((el, i) => el.group.index)
        .map((switchable, index) => {
          switchable.group.index = index;
          return switchable
        })
    );

    const itemGroupAttributes = groupItems[0] ? groupItems[0].group : {name: 'General'};

    return new SwitchableGroup({
      name: itemGroupAttributes.name,
      icon: itemGroupAttributes.icon,
      rank: itemGroupAttributes.rank,
      items: groupItems
    })
  })
};

export {
  SwitchableGroup,
  switchableGroupsFromItems
};
