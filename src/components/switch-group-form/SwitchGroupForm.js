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

export default function SwitchGroupForm({open, groupName, groupIcon='', onClose, onChange, onSave}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit switches group
        </Typography>
        <TextField
          label="Label"
          value={groupName}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange({name: event.target.value})}
        />
        <TextField
          label="Icon"
          value={groupIcon}
          sx={{margin: '15px', display: 'flex'}}
          onChange={(event) => onChange({icon: event.target.value})}
        />

        <Button variant="contained" onClick={onSave}>Save</Button>
      </Box>
    </Modal>
  );
}