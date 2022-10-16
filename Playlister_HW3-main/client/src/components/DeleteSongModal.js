import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteSongModal() {
    const { store } = useContext(GlobalStoreContext);
    let title = store.songIndexDeletion !== undefined ? store.currentList.songs[store.songIndexDeletion].title : "";

    function handleConfirm(event) {
        store.hideDeleteSongModal();
        store.deleteMarkedSong();
    }

    function handleCancel(event) {
        store.hideDeleteSongModal();
    }

    return (
        <div 
            className="modal" 
            id="delete-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog">
                    <div className="modal-header"> Remove song? </div>
                    <div className="dialog-header"> Are you sure you wish to permanently remove <b> {title} </b> from the playlist? </div>
                    <div id="confirm-cancel-container" className="modal-footer">
                        <button id="delete-song-confirm-button" onClick={handleConfirm}> <b>Confirm</b> </button>
                        <button id="delete-song-cancel-button" onClick={handleCancel}> <b>Cancel</b> </button>
                    </div>
                </div>
        </div>
    );
}

export default DeleteSongModal;