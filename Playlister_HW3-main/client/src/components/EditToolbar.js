import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";
    let disabledButtonClass = "playlister-button-disabled";

    function handleAdd() {
        store.addSongTransaction();
    }

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }

    let canUndo = store.hasUndo() && store.currentList != null;
    let canRedo = store.hasRedo() && store.currentList != null;
    let canClose = store.currentList != null ? true : false;
    let canAdd = store.currentList != null ? true : false;

    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={!canAdd}
                value="+"
                className={canAdd ? enabledButtonClass : disabledButtonClass}
                onClick={handleAdd}
            />
            <input
                type="button"
                id='undo-button'
                disabled={!canUndo}
                value="⟲"
                className={canUndo ? enabledButtonClass : disabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={!canRedo}
                value="⟳"
                className={canRedo ? enabledButtonClass : disabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={!canClose}
                value="&#x2715;"
                className={canClose ? enabledButtonClass : disabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;