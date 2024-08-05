import { handleActions } from "redux-actions";
import axios from "axios";
import { produce } from "immer";

const GET_SEARCH = "SEARCH/GET_SEARCH";
const GET_SEARCH_SUCCESS = "SEARCH/GET_SEARCH_SUCCESS";
const GET_SEARCH_FAILURE = "SEARCH/GET_SEARCH_FAILURE";

const getSearch = () => async (dispatch) => {
  dispatch({ type: GET_SEARCH });
  try {
    const res = await axios.get(`${process.env.REACT_APP_WAITLIST_API_URL}/open/search`, {withCredentials: true});
    const { user } = res.data;
    dispatch({
      type: GET_SEARCH_SUCCESS,
      payload: user, // 객체
    });
  } catch (e) {
    dispatch({
      type: GET_SEARCH_FAILURE,
    });
    throw e;
  }
};

const containerState = {
  loading: false,
  user: [],
};

const search = handleActions(
  {
    [GET_SEARCH]: (state) => ({
      ...state,
      loading: true,
    }),
    [GET_SEARCH_SUCCESS]: (state, action) => ({
      loading: false,
      user: action.payload,
    }),
    [GET_SEARCH_FAILURE]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  containerState
);

const componentState = {
  folders: [],
  modal: {
    move: false,
    add: false,
    result: false,
  },
  lists: [],
  option: null,
  kwd: null,
  select: null,
};

function componentReducer(state, action) {
  switch (action.type) {
    case "MODAL_MOVE_OPEN":
      return produce(state, (draft) => {
        draft.modal.move = true;
        draft.modal.add = false;
      });
    case "MODAL_ADD_OPEN":
      return produce(state, (draft) => {
        draft.modal.add = true;
        draft.modal.move = false;
      });
    case "NO_RESULT_MODAL":
      return produce(state, (draft) => {
        draft.modal.add = false;
        draft.modal.move = false;
        draft.modal.result = false;
      });
    case "NO_MODAL":
      return produce(state, (draft) => {
        draft.modal.add = false;
        draft.modal.move = false;
        draft.modal.result = false;
      });
    case "FOLDERS":
      return produce(state, (draft) => {
        draft.folders = action.payload;
      });
    case "DONE_SEARCH":
      return produce(state, (draft) => {
        draft.modal.result = true;
        draft.lists = action.lists;
        draft.option = action.option;
        draft.kwd = action.kwd;
      });
    case "CLICK_WISHLIST":
      return produce(state, (draft) => {
        draft.modal.move = true;
        draft.folders = action.folders;
        draft.select = action.list;
      });
    case "CLICK_WISHLIST":
      return produce(state, (draft) => {
        draft.modal.move = true;
        draft.folders = action.folders;
        draft.select = action.list;
      });
    case "RESET_SELECT":
      return produce(state, (draft) => {
        draft.select = null;
      });
  }
}

export { getSearch, componentState, componentReducer };

export default search;
