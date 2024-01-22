import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Icon} from '@mui/material';

import {
  DragDropContext,
  Droppable,
  Draggable
} from "react-beautiful-dnd";

import { 
  useGetRelaysQuery, 
  useGetWifiRelaysQuery, 
  useGetModesQuery, 
  useGetActionSwitchesQuery, 
  useGetSwitchGroupsQuery,
  useUpdateSwitchGroupMutation,
  useCreateSwitchGroupMutation,
  useDeleteSwitchGroupMutation
} from '../../apis/van-pi/vanpi-app-api';

import SwitchGroupForm from '../switch-group-form/SwitchGroupForm';

import SwitchGroup from '../../models/SwitchGroup';

const SwitchGroupsForm = () => {
  const initialState = {
    switchGroups: [],
    relaySwitches: [],
    wifiRelaySwitches: [],
    modeSwitches: [],
    actionSwitches: [],
    init: false,
    editingGroup: {}
  };

  const [state, setState] = useState(initialState);  

  const apiRelaySwitches = useGetRelaysQuery();
  const apiWifiRelaySwitches = useGetWifiRelaysQuery();
  const apiModeSwitches = useGetModesQuery();
  const apiActionSwitches = useGetActionSwitchesQuery();
  const apiSwitchGroups = useGetSwitchGroupsQuery();

  const isLoading = apiRelaySwitches.isLoading || apiWifiRelaySwitches.isLoading || apiActionSwitches.isLoading || apiSwitchGroups.isLoading || apiModeSwitches.isLoading;
  const isFetching = apiRelaySwitches.isFetching || apiWifiRelaySwitches.isFetching || apiActionSwitches.isFetching || apiSwitchGroups.isFetching || apiModeSwitches.isFetching;
  const isSuccess = apiRelaySwitches.isSuccess && apiWifiRelaySwitches.isSuccess && apiActionSwitches.isSuccess && apiSwitchGroups.isSuccess && apiModeSwitches.isSuccess;
  const isError = apiRelaySwitches.isError || apiWifiRelaySwitches.isError || apiActionSwitches.isError || apiSwitchGroups.isError || apiModeSwitches.isError;
  const error = apiRelaySwitches.error || apiWifiRelaySwitches.error || apiActionSwitches.error || apiSwitchGroups.error || apiModeSwitches.error;

  const [
    updateSwitchGroupTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useUpdateSwitchGroupMutation();

  const [
    createSwitchGroupTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useCreateSwitchGroupMutation();

  const [
    deleteSwitchGroupTrigger, 
    {
      // data={},
      // isLoading,
      // isFetching,
      // isSuccess,
      // isError,
      // error,
    }
  ] = useDeleteSwitchGroupMutation();

  if(isSuccess && !state.init) {
    setState({
      ...state,
      switchGroups: apiSwitchGroups.data,
      relaySwitches: apiRelaySwitches.data,
      wifiRelaySwitches: apiWifiRelaySwitches.data,
      modeSwitches: apiModeSwitches.data,
      actionSwitches: apiActionSwitches.data,
      init: true
    });
  };

  const {
    switchGroups,
    actionSwitches,
    relaySwitches,
    wifiRelaySwitches,
    modeSwitches
  } = state;

  const switchableItems = [
    ...actionSwitches,
    ...relaySwitches,
    ...wifiRelaySwitches,
    ...modeSwitches
  ];

  const ungroupedSwitches = switchableItems.filter(item => !switchGroups.find(group => group.hasItem(item)));
  let unusedGroup = new SwitchGroup({name: 'Unused'});
  unusedGroup.switches = ungroupedSwitches.map(item => unusedGroup.parseSwitchItem(item));

  const onDragEnd = ({ source, destination }) => {
    if (!destination) { return }

    let newSwitchGroups = [
      ...switchGroups.map(g => g.clone())
    ];

    let sourceGroup, destinationGroup;
    if(source.droppableId === unusedGroup.key) {
      sourceGroup = unusedGroup;
    } else {
      sourceGroup = newSwitchGroups.find(group => group.key === source.droppableId);
    }

    const item = sourceGroup.removeItem(source.index);

    if(destination.droppableId === unusedGroup.key) {
      destinationGroup = unusedGroup;
    } else {
      destinationGroup = newSwitchGroups.find(group => group.key === destination.droppableId);
    }

    destinationGroup.addItem(item, destination.index);

    setState({...state, switchGroups: newSwitchGroups});
  }

  const addGroup = () => {
    const newGroup = new SwitchGroup({
      name: `Group ${switchGroups.length + 1}`, 
      rank: switchGroups.length
    });

    setState({
      ...state,
      switchGroups: [
        ...switchGroups,
        newGroup
      ]
    })
  };

  const updateEditingGroup = (attrs) => {
    const editingGroup = state.editingGroup.clone();
    Object.keys(attrs).forEach(k => editingGroup[k] = attrs[k]);
    setState({...state, editingGroup});
  };

  const saveEditingGroup = () => {
    const newSwitchGroups = switchGroups.map(switchGroup => {
      if((switchGroup.id || switchGroup.pseudoId) === (state.editingGroup.id || state.editingGroup.pseudoId)) {
        return state.editingGroup.clone();
      } else {
        return switchGroup.clone()
      }
    });

    setState({...state, editingGroup: {}, switchGroups: newSwitchGroups});
  };

  const refetchData = () => {
    apiSwitchGroups.refetch().then((result) => setState({...state, switchGroups: result.data}));
  };

  const saveSwitchGroups = () => {
    switchGroups.forEach(item => {
      if(!!item.id) {
        if(item.isDeleted) {
          deleteSwitchGroupTrigger(item.toJSONPayload()).then(refetchData);  
        } else {
          updateSwitchGroupTrigger(item.toJSONPayload()).then(refetchData);
        }
      } else if(!item.isDeleted) {
        createSwitchGroupTrigger(item.toJSONPayload()).then(refetchData);
      }
    });
  };

  let content;
  if (isLoading) {
    content = <div>Loading</div>
  } else if (isSuccess) {
    content = [
      unusedGroup,
      ...switchGroups
    ].map(switchGroup => {
      const {name: groupName, icon, switches, key} = switchGroup;
      const sortedSwitches = switches.sort((a, b) => a.index - b.index);

      return (
          <Droppable key={key} droppableId={key}>
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
                  }}
                >
                  <Box
                    sx= {{
                      display: 'flex',
                      flexDirection: 'row',
                      margin: '5px 15px',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box 
                      sx={{
                        display: 'flex',
                        flexDirection:'row',
                        alignItems: 'center'
                      }}
                    >
                      <Typography 
                        color="secondary"
                        sx={{ 
                          fontSize: 16, 
                          fontWeight: 500, 
                          marginBottom: '0px', 
                          alignSelf: 'center'
                        }}
                      >
                          {groupName}
                      </Typography>
                      <Icon sx={{marginLeft: '15px'}}>{icon}</Icon>
                    </Box>
                    <Fab 
                      size="small"
                      color="primary" 
                      aria-label="edit"
                      onClick={() => setState({...state, editingGroup: switchGroup})}
                    >
                      <Icon>edit</Icon>
                    </Fab>
                  </Box>
                  {
                    sortedSwitches.map(({switch_type, switch_id}, index) => {

                      const switchable = switchableItems.find(item => item.snakecaseType === switch_type && item.id === switch_id);

                      return (
                        <Draggable
                          key={switchable.key}
                          draggableId={switchable.key}
                          index={index}
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
                              <Card sx={{ flex: 1, margin: '20px' }}>
                                <CardContent>
                                  <CardHeader
                                    avatar={
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center'
                                        }}>
                                        <Typography 
                                          sx={{ 
                                            fontSize: 16, 
                                            fontWeight: 500, 
                                            marginBottom: '0px', 
                                            alignSelf: 'center'
                                          }} color="primary" gutterBottom>
                                          {switchable.name}
                                        </Typography>
                                        <Icon sx={{marginLeft: '15px'}}>{switchable.icon}</Icon>
                                      </Box>
                                    }
                                  />
                                </CardContent>
                              </Card>
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
    });
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
              disabled={switchGroups.length >= 6}
            >
              <Icon>add</Icon>
            </Fab>
            <Fab
              color="primary" 
              aria-label="save"
              onClick={() => saveSwitchGroups()}
              sx={{
                marginLeft: '10px'
              }}
            >
              <Icon>check</Icon>
            </Fab>
          </Box>
          <SwitchGroupForm 
            open={!!(state.editingGroup.id || state.editingGroup.pseudoId)}
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

export default SwitchGroupsForm;