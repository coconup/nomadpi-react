import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function LoginForm({onSubmit}) {
  const initialState = {
    username: '',
    password: ''
  };

  const [state, setState] = useState(initialState);

  const onChange = (attr) => {
    setState({...state, ...attr});
  };

  return (
    <Modal open>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Login
        </Typography>
        <TextField
          label="Username"
          value={state.username}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange({username: event.target.value})}
        />
        <TextField
          label="Password"
          type={'password'}
          value={state.password}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange({password: event.target.value})}
        />

        <Button variant="contained" onClick={() => onSubmit(state)}>Submit</Button>
      </Box>
    </Modal>
  );
}