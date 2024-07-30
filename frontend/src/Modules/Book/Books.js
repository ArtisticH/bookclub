import { handleActions } from "redux-actions";
import axios from "axios";

const GET_BOOKS = "Books/GET_BOOKS";
const GET_BOOKS_SUCCESS = "Books/GET_BOOKS_SUCCESS";
const GET_BOOKS_FAILURE = "Books/GET_BOOKS_FAILURE";

const getBooks = () => async (dispatch) => {
  dispatch({ type: GET_BOOKS });
  try {
    const res = await axios.get('/books');
    const books = res.data;
    dispatch({
      type: GET_BOOKS_SUCCESS,
      payload: books,
    });
  } catch (e) {
    dispatch({
      type: GET_BOOKS_FAILURE,
    });
    throw e;
  }
};

const containerState = {
  loading: false,
  books: [],
};

const books = handleActions( // 루트 리듀서
  {
    [GET_BOOKS]: (state) => ({
      ...state,
      loading: true,
    }),
    [GET_BOOKS_SUCCESS]: (state, action) => ({
      loading: false,
      books: action.payload,
    }),
    [GET_BOOKS_FAILURE]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  containerState
);


export { getBooks };
export default books;
