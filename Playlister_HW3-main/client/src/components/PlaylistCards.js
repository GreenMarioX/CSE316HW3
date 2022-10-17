import { useContext, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import { GlobalStoreContext } from '../store'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function PlaylistCards() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    const checkKeyPressed = useCallback((event) => {
        if(event.ctrlKey) {
            if(event.key === 'z' && store.hasUndo === true && store.openModal === false)
                store.undo();
            if(event.key === 'y' && store.hasRedo === true && store.openModal === false) 
                store.redo();
        }
      }, [store.hasUndo, store.hasRedo, store.openModal]);
    useEffect(() => {
      document.addEventListener("keydown", checkKeyPressed, false);
      return () => {
        document.removeEventListener("keydown", checkKeyPressed, false);
      };
    }, [checkKeyPressed]);

    if(store.currentList !== null){
        return (
            <div id="playlist-cards">
            {
                store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))
            }
            </div>
        )
    }
    else {
        return(
            <div id="playlist-cards"></div>
        )
        
    }
    
}

export default PlaylistCards;