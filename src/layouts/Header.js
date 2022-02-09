//import * from MUI
import * as Mui from '@mui/material';

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export default function Header() {
    return (
        <Mui.Box sx={{ flexGrow: 1 }}>
        <Mui.AppBar position="static" 
            css={css`background-color: #f44336; top:0; position:fixed;`}
        >
          <Mui.Toolbar>    
            <Mui.Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pokémon App
            </Mui.Typography>
          </Mui.Toolbar>
        </Mui.AppBar>
      </Mui.Box>
    );
  }