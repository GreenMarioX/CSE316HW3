import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import NewSong_Transaction from '../transactions/NewSong_Transaction.js';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction.js';
import EditSong_Transaction from '../transactions/EditSong_Transaction.js';

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_SONG_FOR_EDITING: "MARK_SONG_FOR_EDITING",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    openModal: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    openModal: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    openModal: false
                })
            }

            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    openModal: false
                });
            }

            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    openModal: true
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    openModal: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.MARK_SONG_FOR_EDITING: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songIndexEditing: payload,
                    openModal: true
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    store.addSong = function() {
        async function asyncAddSong() {
            let defaultSong = {
                artist: "Unknown",
                title: "Untitled",
                youTubeId: "dQw4w9WgXcQ"
            };
            store.currentList.songs.push(defaultSong);
            store.updatePlaylist();
        }
        asyncAddSong();
    }

    store.deleteSong = function(index) {
        async function asyncDeleteSong() {
            store.currentList.songs.splice(index, 1);
            store.updatePlaylist();
        }
        asyncDeleteSong();
    }

    store.addSongTransaction = function() {
        let transaction = new NewSong_Transaction(this);
        tps.addTransaction(transaction);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.updatePlaylist = function() {
        async function asyncUpdatePlaylist() {
            const response = await api.updatePlaylist(store.currentList._id, store.currentList);
            if(response.data.success) 
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
        }
        asyncUpdatePlaylist();
    }
    
    // CREATE NEW LIST
    store.createNewList = function () {
        let playlist = {
            name: `Untitled ` + store.newListCounter,
            songs: [],
        };
        async function asyncCreateNewList() {
            let response = await api.createPlaylist(playlist);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: response.data.playlist,
                });
                store.history.push("/playlist/" + response.data.playlist._id);
            }
        }
        asyncCreateNewList();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.moveSong = function(begin, end) {
        let temp = store.currentList.songs[begin];
        if (begin < end) {
            for (let i = begin; i < end; i++) {
                store.currentList.songs[i] = store.currentList.songs[i + 1];
            }
        }
        else if (begin > end) {
            for (let i = begin; i > end; i--) {
                store.currentList.songs[i] = store.currentList.songs[i - 1];
            }     
        }
        store.currentList.songs[end] = temp;
        store.updatePlaylist();
    }

    store.moveSongTransaction = function(beginIndex, endIndex) {
        let transaction = new MoveSong_Transaction(store, beginIndex, endIndex);
        tps.addTransaction(transaction);
    }


    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    store.hasUndo = function () {
        return tps.hasTransactionToUndo();
    }
    store.hasRedo = function () {
        return tps.hasTransactionToRedo();
    }

    store.showEditSongModal = function(index) {
        let modal = document.getElementById('edit-song-modal');
        modal.classList.add('is-visible');
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_EDITING, 
            payload: index
        });
    }
    
    store.hideEditSongModal = function() {
        let modal = document.getElementById('edit-song-modal');
        modal.classList.remove('is-visible');
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST, 
            payload: store.currentList
        });
    }

    store.editMarkedSong = function(editedSong) {
        let song = store.currentList.songs[store.songIndexEditing];
        store.editSongTransaction(store.songIndexEditing, song, editedSong);
    }

    store.editSong = function(index, newSong) {
        store.currentList.songs[index] = newSong;
        store.updatePlaylist();
    }

    store.editSongTransaction = function(index, oldSong, newSong) {
        let transaction = new EditSong_Transaction(this, index, oldSong, newSong);
        tps.addTransaction(transaction);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}