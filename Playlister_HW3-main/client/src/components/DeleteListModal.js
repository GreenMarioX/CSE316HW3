import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function DeleteListModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = store.listIndexDeletion ? store.listIndexDeletion.name : "";

    function handleConfirm(event) {
        store.hideDeleteListModal();
        store.deleteMarkedList();
    }

    function handleCancel(event) {
        store.hideDeleteListModal();
    }

    return (
        <div 
            className="modal" 
            id="delete-list-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog">
                    <div className="modal-header"> Delete playlist? </div>
                    <div className="dialog-header"> Are you sure you wish to permanently delete the <b>{name}</b> playlist? </div>
                    <div id="confirm-cancel-container" className="modal-footer">
                        <button id="delete-list-confirm-button" onClick={handleConfirm}> <b>Confirm</b> </button>
                        <button id="delete-list-cancel-button" onClick={handleCancel}> <b>Cancel</b> </button>
                    </div>
                </div>
        </div>
    );
}

export default DeleteListModal;