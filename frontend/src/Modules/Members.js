import { handleActions } from "redux-actions";
import axios from "axios";
import { produce } from "immer";

const GET_MEMBER = "MEMBER/GET_MEMBER";
const GET_MEMBER_SUCCESS = "MEMBER/GET_MEMBER_SUCCESS";
const GET_MEMBER_FAILURE = "MEMBER/GET_MEMBER_FAILURE";

const getMembers = () => async (dispatch) => {
  dispatch({ type: GET_MEMBER });
  try {
    const res = await axios.get(`/members`);
    const data = res.data;
    dispatch({
      type: GET_MEMBER_SUCCESS,
      payload: data, // 객체
    });
  } catch (e) {
    dispatch({
      type: GET_MEMBER_FAILURE,
    });
    throw e;
  }
};

const containerState = {
  loading: false,
  data: [],
};

const members = handleActions(
  // 루트 리듀서
  {
    [GET_MEMBER]: (state) => ({
      ...state,
      loading: true,
    }),
    [GET_MEMBER_SUCCESS]: (state, action) => ({
      loading: false,
      data: action.payload, // 객체
    }),
    [GET_MEMBER_FAILURE]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  containerState
);

const componentState = {
  who: 0,
  show: false,
};

function componentReducer(state, action) {
  switch (action.type) {
    case "OPEN":
      return produce(state, (draft) => {
        draft.who = action.id;
        draft.show = true;
      });
    case "CLOSE":
      return produce(state, (draft) => {
        draft.who = 0;
        draft.show = false;
      });
  }
}

export { getMembers, componentState, componentReducer };
export default members;
