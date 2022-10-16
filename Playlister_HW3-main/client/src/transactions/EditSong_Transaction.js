import jsTPS_Transaction from "../common/jsTPS.js"

export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, songIndex, oldSong, newSong) {
        super();
        this.store = initStore;
        this.songIndex = songIndex;
        this.oldSong = oldSong;
        this.newSong = newSong;
    }

    doTransaction() {
        this.store.editSong(this.songIndex, this.newSong);
    }
    
    undoTransaction() {
        this.store.editSong(this.songIndex, this.oldSong);
    }
}