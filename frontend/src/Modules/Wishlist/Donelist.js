import { handleActions } from "redux-actions";
import axios from "axios";
import { produce } from "immer";

const GET_DONELIST = "DONELIST/GET_DONELIST";
const GET_DONELIST_SUCCESS = "DONELIST/GET_DONELIST_SUCCESS";
const GET_DONELIST_FAILURE = "DONELIST/GET_DONELIST_FAILURE";
const UPDATE_DONELISTS = 'DONELIST/UPDATE_DONELISTS'
const DELETE_DONELISTS = 'DONELIST/DELETE_DONELISTS'

const getDonelist = (memberId) => async (dispatch) => {
  dispatch({ type: GET_DONELIST });
  try {
    const res = await axios.get(`${process.env.REACT_APP_WAITLIST_API_URL}/donelist/${memberId}`, {withCredentials: true});
    const data = res.data;
    dispatch({
      type: GET_DONELIST_SUCCESS,
      payload: data, // 객체
    });
  } catch (e) {
    dispatch({
      type: GET_DONELIST_FAILURE,
    });
    throw e;
  }
};

const containerState = {
  loading: false,
  data: [],
};

const donelist = handleActions(
  {
    [GET_DONELIST]: (state) => ({
      ...state,
      loading: true,
    }),
    [GET_DONELIST_SUCCESS]: (state, action) => ({
      loading: false,
      data: action.payload,
    }),
    [GET_DONELIST_FAILURE]: (state) => ({
      ...state,
      loading: false,
    }),
    // [ADD_DONELIST]: (state, action) =>
    //   produce(state, (draft) => {
    //     draft.data.count++; // 하나 추가
    //   }),
    [UPDATE_DONELISTS]: (state, action) =>
      produce(state, (draft) => {
        draft.data.donelists = action.payload;
      }),
    [DELETE_DONELISTS]: (state, action) =>
      produce(state, (draft) => {
        draft.data.count -= action.payload;
      }),
    // [UPDATE_OTHERS]: (state, action) =>
    // produce(state, (draft) => {
    //   draft.data.others = action.payload;
    // }),
    
  },
  containerState
);

// const addDONELIST = () => ({ type: ADD_DONELIST });
const updateDonelists = (donelists) => ({ type: UPDATE_DONELISTS, payload: donelists });
const deleteDonelists = (length) => ({ type: DELETE_DONELISTS, payload: length });
// const updateOthers = (others) => ({ type: UPDATE_OTHERS, payload: others });
const componentState = {
  last: null,
  page: 1,
  selected: [],
};

function componentReducer(state, action) {
  switch (action.type) {
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

export {
  getDonelist,
  updateDonelists,
  deleteDonelists,
  componentState,
  componentReducer,
};

export default donelist;
