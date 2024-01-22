import {
  Icon,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from '@mui/material';

const BottomNavigationComponent = (props) => {
  const {
    value,
    onChange,
    tabs
  } = props;

  const renderedTabs = tabs.map(tab => {
    const {
      name,
      icon
    } = tab;

    return (
      <BottomNavigationAction
        key={name}
        label={name}
        value={name}
        icon={icon && <Icon>{icon}</Icon>}
      />
    )
  })

  return(
    <Paper 
      sx={{
        position: 'fixed', 
        bottom: 0,
        left: 0,
        right: 0
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={onChange}
      >
        { renderedTabs }
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNavigationComponent;