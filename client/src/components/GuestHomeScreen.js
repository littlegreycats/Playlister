import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const GuestHomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadPublicPlaylists();
        console.log(store.idNamePairs)
    }, []);

    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    
    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
                <Typography variant="h2">Public Playlists</Typography>
            </div>
            <div id="list-selector-list">
                {   
                    listCard
                }
            </div>
        </div>
    )
}

export default GuestHomeScreen;