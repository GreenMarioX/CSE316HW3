import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function EditSongModal()  {
    const { store } = useContext(GlobalStoreContext);
    if (store.songIndexEditing !== undefined) {
        let song = store.currentList.songs[store.songIndexEditing];
        document.getElementById("modal-edit-title").value = song.title;
        document.getElementById("modal-edit-artist").value = song.artist;
        document.getElementById("modal-edit-youTubeId").value = song.youTubeId;
    }

    function handleConfirm(event) {
        let editSong = {
            title: document.getElementById("modal-edit-title").value,
            artist: document.getElementById("modal-edit-artist").value,
            youTubeId: document.getElementById("modal-edit-youTubeId").value
        }
        store.editMarkedSong(editSong);
        store.hideEditSongModal();
    }

    function handleCancel(event) {
        store.hideEditSongModal();
    }
    
    return (
        <div 
            className="modal" 
            id="edit-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog">
                    <div className="modal-header"> Edit song? </div>
                    <div className="modal-input-fields">
                        <div className="modal-edit-textbox"> Title: </div>
                        <input type="text" id="modal-edit-title" className="modal-edit-textbox" ></input>
                        <div className="modal-edit-textbox"> Artist: </div>
                        <input type="text" id="modal-edit-artist" className="modal-edit-textbox"></input>
                        <div className="modal-edit-textbox"> YouTube Id: </div>
                        <input type="text" id="modal-edit-youTubeId" className="modal-edit-textbox"></input>
                    </div>
                    <div id="confirm-cancel-container" className="modal-footer">
                        <button id="edit-song-confirm-button" onClick={handleConfirm}> <b>Confirm</b> </button>
                        <button id="edit-song-cancel-button" onClick={handleCancel}> <b>Cancel</b> </button>
                    </div>
                </div>
        </div>
    );
    
}

export default EditSongModal;