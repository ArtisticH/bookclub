import { handleActions } from "redux-actions";
import axios from "axios";
import { produce } from "immer";

const GET_APILISTS = "APILISTS/GET_APILISTS";
const GET_APILISTS_SUCCESS = "APILISTS/GET_APILISTS_SUCCESS";
const GET_APILISTS_FAILURE = "APILISTS/GET_APILISTS_FAILURE";

const getApiLists = (type) => async (dispatch) => {
  dispatch({ type: GET_APILISTS });
  try {
    const res = await axios.get(`/open/${type}`);
    console.log(res);
    const data = res.data;
    dispatch({
      type: GET_APILISTS_SUCCESS,
      payload: data, // 객체
    });
  } catch (e) {
    dispatch({
      type: GET_APILISTS_FAILURE,
    });
    throw e;
  }
};

const containerState = {
  loading: false,
  data: [],
};

const apilists = handleActions(
  {
    [GET_APILISTS]: (state) => ({
      ...state,
      loading: true,
    }),
    [GET_APILISTS_SUCCESS]: (state, action) => ({
      loading: false,
      data: action.payload,
    }),
    [GET_APILISTS_FAILURE]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  containerState
);

const componentState = {
  last: null,
  page: 1,
  selected: [],
  modal: {
    move: false,
    add: false,
  },
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
    case "NO_MODAL":
      return produce(state, (draft) => {
        draft.modal.add = false;
        draft.modal.move = false;
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

export { getApiLists, componentState, componentReducer };

export default apilists;
