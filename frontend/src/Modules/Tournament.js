import { handleActions } from "redux-actions";
import axios from "axios";

const GET_CATEGORY = "Category/GET_CATEGORY";
const GET_CATEGORY_SUCCESS = "Category/GET_CATEGORY_SUCCESS";
const GET_CATEGORY_FAILURE = "Category/GET_CATEGORY_FAILURE";

export const getCategory = (id, round) => async (dispatch) => {
  dispatch({ type: GET_CATEGORY });
  try {
    const response = await axios.get(`/favorite/${id}/${round}`);
    dispatch({
      type: GET_CATEGORY_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: GET_CATEGORY_FAILURE,
    });
    throw e;
  }
};

const initialState = {
  loading: false,
  category: null,
};

const tournament = handleActions(
  {
    [GET_CATEGORY]: (state) => ({
      ...state,
      loading: true,
    }),
    [GET_CATEGORY_SUCCESS]: (state, action) => ({
      loading: false,
      category: action.payload,
    }),
    [GET_CATEGORY_FAILURE]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  initialState
);

export default tournament;
