import jsTPS_Transaction from "../common/jsTPS.js"

export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, songIndex, song) {
        super();
        this.store = initStore;
        this.songIndex = songIndex;
        this.song = song;
    }

    doTransaction() {
        this.store.deleteSong(this.songIndex);
    }
    
    undoTransaction() {
        console.log("SONG: " + this.song);
        this.store.addSongParameters(this.songIndex, this.song);
    }
} 