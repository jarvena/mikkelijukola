import { useState } from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: 'red'
}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: 'blue',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  visibility: 'visible',
  left: 'calc(50% - 15px)',
}));

export default function LayerSelector() {
  const [open, setOpen] = useState(true);
  const toggleDrawer = (newStatus = !open) => {
    setOpen(newStatus);
  };

  return(
    <Root>
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            overflow: 'visible',
          },
        }}
      />
      <SwipeableDrawer
        anchor='bottom'
        open={open}
        onOpen={() => toggleDrawer(true)}
        onClose={() => toggleDrawer(false)}
        swipeAreaWidth={40}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Puller onClick={() => toggleDrawer(false)}/>
        <Box display="flex" flexWrap="wrap" alignItems="center">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <FormLabel id="bgmap-radio-buttons-group-label">Taustakartta</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="MapAnt"
              name="radio-buttons-group"
            >
              <FormControlLabel value="MapAnt" control={<Radio />} label="MapAnt" />
              <FormControlLabel value="aerial" control={<Radio />} label="Ilmakuva" />
              <FormControlLabel value="topo" control={<Radio />} label="Maastokartta" />
            </RadioGroup>
          </FormControl>
          <FormGroup sx={{ m: 1, minWidth: 120 }}>
            <FormLabel id="overlay-checkbox-group-label">Aineistot</FormLabel>
            <FormControlLabel control={<Checkbox />} label="Harjoituskieltoalue" />
            <FormControlLabel control={<Checkbox defaultChecked />} label="Vanhat kartat" />
            <FormControlLabel control={<Checkbox />} label="Disabled" />
          </FormGroup>
        </Box>
      </SwipeableDrawer>
    </Root>
  )
}