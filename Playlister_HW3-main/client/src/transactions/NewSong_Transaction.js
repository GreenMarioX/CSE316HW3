import jsTPS_Transaction from "../common/jsTPS.js"

export default class NewSong_Transaction extends jsTPS_Transaction {
    constructor(initStore) {
        super();
        this.store = initStore
    }

    doTransaction() {
        console.log("HELLO0");

        this.store.addSong();
    }
    
    undoTransaction() {
        this.store.deleteSong(this.store.getPlaylistSize() - 1);
    }
}