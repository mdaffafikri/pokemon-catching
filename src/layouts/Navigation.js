//import * from MUI
import * as Mui from '@mui/material';
import * as Muicon from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export default function Header() {
    const navigate = useNavigate();

    return (
        <Mui.Box sx={{ width: '100%' }} css={css`bottom:0; position:fixed;`}>
            <Mui.BottomNavigation showLabels css={css`background-color: #f44336;`}
            value={'value'}
            onChange={(event, newValue) => {
              navigate(newValue);
            }}
            >
                <Mui.BottomNavigationAction css={css`color: white;`} label="Pokemon List" icon={<Muicon.CatchingPokemon />} value="/" />
                <Mui.BottomNavigationAction css={css`color: white;`} label="My Pokemon" icon={<Muicon.Pets />} value="my-list" />
            </Mui.BottomNavigation>
        </Mui.Box>
    );
}