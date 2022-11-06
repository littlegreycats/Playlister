import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    let text ="";
    if (store.currentList)
        text = store.currentList.name;
    return (
        <Box sx={{ flexGrow: 1 }} id="playlister-statusbar">
            <AppBar position="static">
                <Typography variant="h4" style={{textAlign: "center"}}>{text}</Typography>
            </AppBar>
        </Box>
    );
}

export default Statusbar;