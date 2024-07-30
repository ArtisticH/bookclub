import { handleActions } from "redux-actions";
import axios from "axios";
import { produce } from "immer";

const GET_BOOK = "Book/GET_BOOK";
const GET_BOOK_SUCCESS = "Book/GET_BOOK_SUCCESS";
const GET_BOOK_FAILURE = "Book/GET_BOOK_FAILURE";
const UPDATE_STAR = "Book/UPDATE_STAR";
const UPDATE_TOTAL_REVIEW = "Book/UPDATE_TOTAL_REVIEW";
const UPDATE_REVIEWS = "Book/UPDATE_REVIEWS";
const UPDATE_LIKE = "Book/UPDATE_LIKE";

const getBook = (id) => async (dispatch) => {
  dispatch({ type: GET_BOOK });
  try {
    const res = await axios.get(`/books/${id}`);
    const data = res.data;
    dispatch({
      type: GET_BOOK_SUCCESS,
      payload: data, // 객체
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
  data: null,
};

const book = handleActions(
  // 루트 리듀서
  {
    [GET_BOOK]: (state) => ({
      ...state,
      loading: true,
    }),
    [GET_BOOK_SUCCESS]: (state, action) => ({
      loading: false,
      data: action.payload, // 객체
    }),
    [GET_BOOK_FAILURE]: (state) => ({
      ...state,
      loading: false,
    }),
    [UPDATE_STAR]: (state, action) =>
      produce(state, (draft) => {
        draft.data.starArr = action.payload.starArr;
        draft.data.starNum = action.payload.starNum;
      }),
    [UPDATE_TOTAL_REVIEW]: (state, action) =>
      produce(state, (draft) => {
        draft.data.totalReview++;
      }),
    [UPDATE_REVIEWS]: (state, action) =>
      produce(state, (draft) => {
        draft.data.reviews = action.payload;
      }),
    [UPDATE_LIKE]: (state, action) =>
      produce(state, (draft) => {
        draft.data.reviews.forEach(review => {
          if(review.id == action.payload.id) {
            review.like = action.payload.like;
          }
        })
      }),

  },

  containerState
);

const updateStar = (starArr, starNum) => ({
  type: UPDATE_STAR,
  payload: { starArr, starNum },
});
const updateTotalReview = () => ({ type: UPDATE_TOTAL_REVIEW });
const updateReviews = (reviews) => ({ type: UPDATE_REVIEWS, payload: reviews });
const updateLike = (id, like) => ({ type: UPDATE_LIKE, payload: { id, like } });

const componentState = {
  form: false,
  last: null,
  pageArr: [],
  star: 0,
  currentPage: 1,
};

function componentReducer(state, action) {
  switch (action.type) {
    case "SHOW_FORM":
      return produce(state, (draft) => {
        draft.form = true;
      });
    case "CANCEL_FORM":
      return produce(state, (draft) => {
        draft.form = false;
      });
    case "LAST":
      const total = action.totalReview;
      const last = total % 5 === 0 ? total / 5 : Math.floor(total / 5) + 1;
      return produce(state, (draft) => {
        draft.last = last;
      });
    case "FORM_STAR":
      return produce(state, (draft) => {
        draft.star = action.star;
      });
    case "RESET_STAR":
      return produce(state, (draft) => {
        draft.star = 0;
      });
  }
}

export {
  getBook,
  updateStar,
  updateTotalReview,
  updateReviews,
  updateLike,
  componentState,
  componentReducer,
};
export default book;
