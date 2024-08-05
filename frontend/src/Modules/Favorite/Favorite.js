import { handleActions } from "redux-actions";
import axios from "axios";

const GET_FAVORITE = "Favorite/GET_FAVORITE";
const GET_FAVORITE_SUCCESS = "Favorite/GET_FAVORITE_SUCCESS";
const GET_FAVORITE_FAILURE = "Favorite/GET_FAVORITE_FAILURE";

export const getFavorite = () => async (dispatch) => {
  dispatch({ type: GET_FAVORITE });
  try {
    const response = await axios.get(`${process.env.REACT_APP_WAITLIST_API_URL}/favorite`, {withCredentials: true});
    dispatch({
      type: GET_FAVORITE_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: GET_FAVORITE_FAILURE,
    });
    throw e;
  }
};

const initialState = {
  loading: false,
  categories: null,
};

const favorite = handleActions(
  {
    [GET_FAVORITE]: (state) => ({
      ...state,
      loading: true,
    }),
    [GET_FAVORITE_SUCCESS]: (state, action) => ({
      loading: false,
      categories: action.payload,
    }),
    [GET_FAVORITE_FAILURE]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  initialState
);

export default favorite;
