import { handleActions } from "redux-actions";
import axios from "axios";
import { produce } from "immer";

const GET_LIST = "LIST/GET_LIST";
const GET_LIST_SUCCESS = "LIST/GET_LIST_SUCCESS";
const GET_LIST_FAILURE = "LIST/GET_LIST_FAILURE";

const getList = (forderId, memberId) => async (dispatch) => {
  dispatch({ type: GET_LIST });
  try {
    const res = await axios.get(`/list/${forderId}/${memberId}`);
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
  },
  containerState
);

const componentState = {
};

function componentReducer(state, action) {
  switch (action.type) {

  }
}

export {
  getList,
  componentState,
  componentReducer,
};
export default list;
