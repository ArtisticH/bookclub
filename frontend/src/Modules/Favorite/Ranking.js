import { handleActions } from "redux-actions";
import axios from "axios";

const GET_RANKING = "Ranking/GET_RANKING";
const GET_RANKING_SUCCESS = "Ranking/GET_RANKING_SUCCESS";
const GET_RANKING_FAILURE = "Ranking/GET_RANKING_FAILURE";

export const getRanking = (id) => async (dispatch) => {
  dispatch({ type: GET_RANKING });
  try {
    const response = await axios.get(`${process.env.REACT_APP_WAITLIST_API_URL}/favorite/ranking/${id}`, {withCredentials: true});
    dispatch({
      type: GET_RANKING_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: GET_RANKING_FAILURE,
    });
    throw e;
  }
};

const initialState = {
  loading: false,
  result: null,
};

const ranking = handleActions(
  {
    [GET_RANKING]: (state) => ({
      ...state,
      loading: true,
    }),
    [GET_RANKING_SUCCESS]: (state, action) => ({
      loading: false,
      result: action.payload,
    }),
    [GET_RANKING_FAILURE]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  initialState
);

export default ranking;
