import jsTPS_Transaction from "../common/jsTPS.js"

export default class MoveSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initIndexOld, initIndexNew) {
        super();
        this.store = initStore;
        this.initIndexOld = initIndexOld;
        this.initIndexNew = initIndexNew;
    }

    doTransaction() {
        this.store.moveSong(this.initIndexOld, this.initIndexNew);
    }
    
    undoTransaction() {
        this.store.moveSong(this.initIndexNew, this.initIndexOld);
    }
}