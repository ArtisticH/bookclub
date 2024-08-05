import { handleActions } from "redux-actions";
import axios from "axios";
import { produce } from "immer";

const GET_LIST = "LIST/GET_LIST";
const GET_LIST_SUCCESS = "LIST/GET_LIST_SUCCESS";
const GET_LIST_FAILURE = "LIST/GET_LIST_FAILURE";
const ADD_LIST = "LIST/ADD_LIST";
const UPDATE_LISTS = "LIST/UPDATE_LISTS";
const DELETE_LISTS = "LIST/DELETE_LISTS";
const UPDATE_OTHERS = "LIST/UPDATE_OTHERS";

const getList = (forderId, memberId) => async (dispatch) => {
  dispatch({ type: GET_LIST });
  try {
    const res = await axios.get(`${process.env.REACT_APP_WAITLIST_API_URL}/list/${forderId}/${memberId}`, {withCredentials: true});
    const data = res.data;
    dispatch({
      type: GET_LIST_SUCCESS,
      payload: data, // 객체
    });
  } catch (e) {
    dispatch({
      type: GET_LIST_FAILURE,
    });
    throw e;
  }
};

const containerState = {
  loading: false,
  data: [],
};

const list = handleActions(
  {
    [GET_LIST]: (state) => ({
      ...state,
      loading: true,
    }),
    [GET_LIST_SUCCESS]: (state, action) => ({
      loading: false,
      data: action.payload,
    }),
    [GET_LIST_FAILURE]: (state) => ({
      ...state,
      loading: false,
    }),
    [ADD_LIST]: (state, action) =>
      produce(state, (draft) => {
        draft.data.count++; // 하나 추가
      }),
    [UPDATE_LISTS]: (state, action) =>
      produce(state, (draft) => {
        draft.data.lists = action.payload;
      }),
    [DELETE_LISTS]: (state, action) =>
      produce(state, (draft) => {
        draft.data.count -= action.payload;
      }),
    [UPDATE_OTHERS]: (state, action) =>
    produce(state, (draft) => {
      draft.data.others = action.payload;
    }),
    
  },
  containerState
);

const addList = () => ({ type: ADD_LIST });
const updateLists = (lists) => ({ type: UPDATE_LISTS, payload: lists });
const deleteLists = (length) => ({ type: DELETE_LISTS, payload: length });
const updateOthers = (others) => ({ type: UPDATE_OTHERS, payload: others });
const componentState = {
  modal: {
    add: false,
    move: false,
  },
  last: null,
  page: 1,
  selected: [],
};

function componentReducer(state, action) {
  switch (action.type) {
    case "MODAL_ADD_OPEN":
      return produce(state, (draft) => {
        draft.modal.add = true;
        draft.modal.move = false;
      });
    case "MODAL_ADD_CANCEL":
      return produce(state, (draft) => {
        draft.modal.add = false;
      });
    case "MODAL_MOVE_OPEN":
      return produce(state, (draft) => {
        draft.modal.add = false;
        draft.modal.move = true;
      });
    case "MODAL_MOVE_CANCEL":
      return produce(state, (draft) => {
        draft.modal.move = false;
      });
    case "NO_MODAL_OPEN":
      return produce(state, (draft) => {
        draft.modal.move = false;
        draft.modal.add = false;
      });
    case "LAST":
      const count = action.count;
      const last = count % 15 === 0 ? count / 15 : Math.floor(count / 15) + 1;
      return produce(state, (draft) => {
        draft.last = last;
      });
    case "PAGE": // 현재 페이지
      return produce(state, (draft) => {
        draft.page = action.payload;
        draft.selected = [];
      });
    case "ADD_SELECT": // 선택한 애들 모으기
      return produce(state, (draft) => {
        draft.selected.push(action.id);
      });
    case "REMOVE_SELECT": // 선택한 애들 모으기
      return produce(state, (draft) => {
        const index = draft.selected.findIndex((id) => id == action.id);
        draft.selected.splice(index, 1);
      });
      case "RESET_SELECTED": 
      return produce(state, (draft) => {
        draft.selected = [];
      });
  }
}

export {
  getList,
  addList,
  updateLists,
  deleteLists,
  updateOthers,
  componentState,
  componentReducer,
};

export default list;
