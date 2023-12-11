import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import { Icon} from '@mui/material';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useGetSwitchablesQuery } from '../../apis/van-pi/van-pi-api';
import { useUpdateSwitchableMutation } from '../../apis/van-pi/van-pi-api';

import SwitchableForm from '../switchable-form/SwitchableForm';
import SwitchableGroupForm from '../switchable-group-form/SwitchableGroupForm';

import { switchableGroupsFromItems, SwitchableGroup } from '../../models/SwitchableGroup';

const SettingsPanel = () => {
  const relays = useGetSwitchablesQuery('relay');
  const wifiRelays = useGetSwitchablesQuery('wrelay');

  const [
    updateSwitchableTrigger, 
    {
      data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useUpdateSwitchableMutation();

  let sourceData = [
    ...relays.data || [],
    ...wifiRelays.data || []
  ];

  const switchableGroupsFromSource = switchableGroupsFromItems(sourceData);

  const isLoading = relays.isLoading || wifiRelays.isLoading;
  const isFetching = relays.isFetching || wifiRelays.isFetching;
  const isSuccess = relays.isSuccess && wifiRelays.isSuccess;
  const isError = relays.isError || wifiRelays.isError;
  const error = relays.error || wifiRelays.error;

  const [state, setState] = useState({
    switchableGroups: [],
    init: false,
    editingGroup: {}
  });

  if(isSuccess && !state.init) {
    setState({
      ...state,
      switchableGroups: switchableGroupsFromSource,
      init: true
    });
  };

  const {switchableGroups} = state;
  const switchableItems = switchableGroups.map(({items}) => items).flat();

  const onDragEnd = ({ source, destination }) => {
    if (!destination) { return }

    const sourceGroupName = source.droppableId.replace('SwitchableGroupConfig-', '');
    const destinationGroupName = destination.droppableId.replace('SwitchableGroupConfig-', '');

    let newSwitchableGroups = [
      ...switchableGroups.map(g => g.clone())
    ];

    const item = (
      newSwitchableGroups
        .find(({name}) => name === sourceGroupName)
        .removeItem(source.index)
    );

    newSwitchableGroups
      .find(({name}) => name === destinationGroupName)
      .addItem(item, destination.index);

    setState({...state, switchableGroups: newSwitchableGroups});
  }

  const addGroup = () => {
    const newGroup = new SwitchableGroup({
      name: `Group ${switchableGroups.length + 1}`, 
      rank: switchableGroups.length
    });

    setState({
      ...state,
      switchableGroups: [
        ...switchableGroups,
        newGroup
      ]
    })
  };

  const onSwitchableChange = (switchable, attrs) => {
    console.log(attrs)
    let newSwitchableGroups = [
      ...switchableGroups.map(switchableGroup => {
        let newGroup = switchableGroup.clone();
        let item = newGroup.items.find(({key}) => key === switchable.key)
        if(item) {
          Object.keys(attrs).forEach(k => item[k] = attrs[k]);
        }
        return newGroup;
      })
    ];

    setState({...state, switchableGroups: newSwitchableGroups})
  };

  const updateEditingGroup = (attrs) => {
    const editingGroup = state.editingGroup.clone();
    Object.keys(attrs).forEach(k => editingGroup[k] = attrs[k]);
    setState({...state, editingGroup});
  };

  const saveEditingGroup = () => {
    const newSwitchableGroups = switchableGroups.map(switchableGroup => {
      if(switchableGroup.id === state.editingGroup.id) {
        return state.editingGroup.clone();
      } else {
        return switchableGroup.clone()
      }
    });

    setState({...state, editingGroup: {}, switchableGroups: newSwitchableGroups});
  };

  const saveSwitchableGroups = () => {
    switchableGroups.forEach(({items}) => {
      items.forEach(item => updateSwitchableTrigger(item.toJSONPayload()))
    })
  };

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if (isSuccess) {
    const renderedGroups = switchableGroups.map(switchableGroup => {
      const {id: groupId, name: groupName, icon: groupIcon, items} = switchableGroup;
      const groupKey = `SwitchableGroupConfig-${groupName}`;

      return (
          <Droppable key={groupKey} droppableId={groupKey}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                // style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                <Paper
                  elevation={1}
                  sx={{
                    margin: '15px',
                    padding: '20px',
                    width: '315px',
                    backgroundColor: 'grey.50'
                  }}>
                  <Box
                    sx= {{
                      display: 'flex',
                      flexDirection: 'row',
                      margin: '5px 15px',
                      justifyContent: 'space-between'
                    }}>
                    <Box 
                      sx={{
                        display: 'flex',
                        flexDirection:'row',
                        alignItems: 'center'
                      }}>
                      <Typography 
                        color="secondary"
                        sx={{ 
                          fontSize: 16, 
                          fontWeight: 500, 
                          marginBottom: '0px', 
                          alignSelf: 'center'
                        }}>
                        
                          {groupName}
                      </Typography>
                      <Icon sx={{marginLeft: '15px'}}>{groupIcon}</Icon>
                    </Box>
                    <Fab 
                      size="small"
                      color="primary" 
                      aria-label="edit"
                      onClick={() => setState({...state, editingGroup: switchableGroup})}
                    >
                      <Icon>edit</Icon>
                    </Fab>
                  </Box>
                  {
                    items.map((switchable) => {
                      const switchableKey = `${switchable.camelType}Config-${switchable.id}`;

                      return (
                        <Draggable
                          key={switchableKey}
                          draggableId={switchableKey}
                          index={switchable.group.index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              // style={getItemStyle(
                              //   snapshot.isDragging,
                              //   provided.draggableProps.style
                              // )}
                            >
                              <SwitchableForm 
                                switchable={switchable}
                                onChange={onSwitchableChange}
                              />
                            </div>
                          )}
                        </Draggable>
                      )
                    })
                  }
                  {provided.placeholder}
                </Paper>
              </div>
            )}
          </Droppable>
      )
    })

    content = renderedGroups
  } else if (isError) {
  	const {status, error: message} = error;
    content = <div>{message}</div>
  }

  return (
    <Box
      sx={{
        margin: '0px auto'
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{
          display: 'flex', 
          flexDirection: 'column',
          overflowX: 'scroll',
          overflowY: 'hidden',
          whiteSpace: 'nowrap'
        }}>
          <Box
            sx={{
              position: 'fixed',
              right: '50px',
              bottom: '50px'
            }}>
            <Fab 
              color="primary" 
              aria-label="add"
              onClick={() => addGroup()}
              disabled={switchableGroups.length >= 6}
            >
              <Icon>add</Icon>
            </Fab>
            <Fab
              color="primary" 
              aria-label="save"
              onClick={() => saveSwitchableGroups()}
              sx={{
                marginLeft: '10px'
              }}
            >
              <Icon>check</Icon>
            </Fab>
          </Box>
          <SwitchableGroupForm 
            groupId={state.editingGroup.id}
            groupName={state.editingGroup.name}
            groupIcon={state.editingGroup.icon}
            onClose={() => setState({...state, editingGroup: {}})}
            onChange={updateEditingGroup}
            onSave={saveEditingGroup}
          />
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
            {content}
          </Box>
        </Box>
      </DragDropContext>
    </Box>
  )
}

export default SettingsPanel;