import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [draggedTo, setDrag] = useState(false);
    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDrag(false);
    }

    function handleDragStart(event) {
        event.dataTransfer.setData("id", event.target.id);
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDrag(true);
    }

    function handleDrop(event) {
        event.preventDefault();
        let endId = event.target.id;
        endId = endId.substring(endId.indexOf("-") + 1);
        let startId = event.dataTransfer.getData("id");
        startId = startId.substring(startId.indexOf("-") + 1);
        setDrag(false);
        store.moveSongTransaction(parseInt(startId), parseInt(endId));
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;