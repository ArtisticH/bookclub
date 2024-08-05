import { handleActions } from "redux-actions";
import axios from "axios";
import { produce } from "immer";

const GET_WISH = "WISH/GET_WISH";
const GET_WISH_SUCCESS = "WISH/GET_WISH_SUCCESS";
const GET_WISH_FAILURE = "WISH/GET_WISH_FAILURE";
const ADD_FOLDER = "WISH/ADD_FOLDER";
const CHANGE_NAME = "WISH/CHANGE_NAME";
const DELETE_FOLDER = "WISH/DELETE_FOLDER";
const CHANGE_PUBLIC = "WISH/CHANGE_PUBLIC";
const CHANGE_DONE_PUBLIC = "WISH/CHANGE_DONE_PUBLIC";
const NEW_FOLDERS = "WISH/NEW_FOLDERS";

const getWishlist = (id) => async (dispatch) => {
  dispatch({ type: GET_WISH });
  try {
    const res = await axios.get(`${process.env.REACT_APP_WAITLIST_API_URL}/wishlist/${id}`, {withCredentials: true});
    const data = res.data;
    dispatch({
      type: GET_WISH_SUCCESS,
      payload: data, // 객체
    });
  } catch (e) {
    dispatch({
      type: GET_WISH_FAILURE,
    });
    throw e;
  }
};

const containerState = {
  loading: false,
  data: [],
};

const wishlist = handleActions(
  {
    [GET_WISH]: (state) => ({
      ...state,
      loading: true,
    }),
    [GET_WISH_SUCCESS]: (state, action) => ({
      loading: false,
      data: action.payload,
    }),
    [GET_WISH_FAILURE]: (state) => ({
      ...state,
      loading: false,
    }),
    [ADD_FOLDER]: (state, action) =>
      produce(state, (draft) => {
        draft.data.folders.push(action.payload);
        draft.total++;
      }),
    [CHANGE_NAME]: (state, action) =>
      produce(state, (draft) => {
        const index = draft.data.folders.findIndex(
          (folder) => folder.id === action.payload.id
        );
        draft.data.folders[index].title = action.payload.title;
      }),
    [DELETE_FOLDER]: (state, action) =>
      produce(state, (draft) => {
        const index = draft.data.folders.findIndex(
          (folder) => folder.id == action.payload
        );
        draft.data.folders.splice(index, 1);
        draft.total--;
      }),
    [CHANGE_PUBLIC]: (state, action) =>
      produce(state, (draft) => {
        const index = draft.data.folders.findIndex(
          (folder) => folder.id === action.payload.id
        );
        draft.data.folders[index].public = action.payload.boolean;
      }),
    [CHANGE_DONE_PUBLIC]: (state, action) =>
      produce(state, (draft) => {
        draft.data.done.public = action.payload;
      }),

    [NEW_FOLDERS]: (state, action) =>
      produce(state, (draft) => {
        draft.data.folders = action.payload;
      }),
  },
  containerState
);

const addFolder = (folder) => ({ type: ADD_FOLDER, payload: folder });
const changeName = (id, title) => ({
  type: CHANGE_NAME,
  payload: { id, title },
});
const deleteFolder = (id) => ({
  type: DELETE_FOLDER,
  payload: id,
});
const changePublic = (id, boolean) => ({
  type: CHANGE_PUBLIC,
  payload: { id, boolean },
});
const newFolders = (newFolders) => ({
  type: NEW_FOLDERS,
  payload: newFolders,
});
const changeDonePublic = (boolean) => ({
  type: CHANGE_DONE_PUBLIC,
  payload: boolean,
});

const componentState = {
  menu: {
    folder: false,
    blank: false,
    done: false,
  },
  modal: {
    add: false,
    change: false,
  },
  position: {
    x: null,
    y: null,
  },
  currentFolder: null,
};

function componentReducer(state, action) {
  switch (action.type) {
    case "MENU_BLANK_OPEN":
      return produce(state, (draft) => {
        draft.menu.blank = true;
        draft.menu.folder = false;
        draft.menu.done = false;
        draft.position.x = action.position.x;
        draft.position.y = action.position.y;
      });
    case "MENU_FOLDER_OPEN":
      return produce(state, (draft) => {
        draft.menu.folder = true;
        draft.menu.blank = false;
        draft.menu.done = false;
        draft.position.x = action.position.x;
        draft.position.y = action.position.y;
        // 어떤 폴더를 클릭했는지 기록해놔
        draft.currentFolder = action.currentFolder;
      });
    case "MENU_DONE_OPEN":
      return produce(state, (draft) => {
        draft.menu.folder = false;
        draft.menu.blank = false;
        draft.menu.done = true;
        draft.position.x = action.position.x;
        draft.position.y = action.position.y;
      });
    case "NO_MENU_OPEN":
      return produce(state, (draft) => {
        draft.menu.blank = false;
        draft.menu.folder = false;
        draft.menu.done = false;
        draft.position.x = null;
        draft.position.y = null;
      });
    case "MODAL_ADD_OPEN":
      return produce(state, (draft) => {
        draft.modal.add = true;
        draft.menu.blank = false;
      });
    case "MODAL_CHANGE_OPEN":
      return produce(state, (draft) => {
        draft.modal.change = true;
        draft.menu.folder = false;
      });
    case "MODAL_ADD_CANCEL":
      return produce(state, (draft) => {
        draft.modal.add = false;
      });
    case "MODAL_CHANGE_CANCEL":
      return produce(state, (draft) => {
        draft.modal.change = false;
      });
  }
}

export {
  getWishlist,
  addFolder,
  changeName,
  deleteFolder,
  changePublic,
  newFolders,
  changeDonePublic,
  componentState,
  componentReducer,
};
export default wishlist;
