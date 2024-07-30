import { handleActions } from "redux-actions";
import axios from "axios";
import { produce } from "immer";

const GET_BOOK = "Book/GET_BOOK";
const GET_BOOK_SUCCESS = "Book/GET_BOOK_SUCCESS";
const GET_BOOK_FAILURE = "Book/GET_BOOK_FAILURE";

const getBook = (id) => async (dispatch) => {
  dispatch({ type: GET_BOOK });
  try {
    const res = await axios.get(`/books/${id}`);
    const book = res.data;
    dispatch({
      type: GET_BOOK_SUCCESS,
      payload: book, // 객체
    });

  } catch (e) {
    dispatch({
      type: GET_BOOK_FAILURE,
    });
    throw e;
  }
};

const containerState = {
  loading: false,
  book: null,
};

const book = handleActions( // 루트 리듀서
  {
    [GET_BOOK]: (state) => ({
      ...state,
      loading: true,
    }),
    [GET_BOOK_SUCCESS]: (state, action) => ({
      loading: false,
      book: action.payload, // 객체
    }),
    [GET_BOOK_FAILURE]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  containerState
);

const componentState = {
  form: false,
};

function componentReducer(state, action) {
  switch(action.type) {
    case 'SHOW_FORM':
      return produce(state, draft => {
        draft.form = true;
      })
    case 'CANCEL_FORM':
      return produce(state, draft => {
        draft.form = false;
      })
  }
}

export { getBook, componentState, componentReducer };
export default book;
