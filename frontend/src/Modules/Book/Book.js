import { handleActions } from "redux-actions";
import axios from "axios";
import { produce } from "immer";

const GET_BOOK = "Book/GET_BOOK";
const GET_BOOK_SUCCESS = "Book/GET_BOOK_SUCCESS";
const GET_BOOK_FAILURE = "Book/GET_BOOK_FAILURE";
const UPDATE_STAR = "Book/UPDATE_STAR"; // 전체 평점 업데이트
const ADD_REVIEW = "Book/ADD_REVIEW"; // 리뷰 추가
const DELETE_REVIEW = "Book/DELETE_REVIEW"; // 리뷰 삭제
const UPDATE_REVIEWS = "Book/UPDATE_REVIEWS"; // 리뷰 5개 업데이트
const UPDATE_LIKE = "Book/UPDATE_LIKE"; // 좋아요 변경
const EDIT_REVIEW = "Book/EDIT_REVIEW"; // 리뷰 수정

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
    [ADD_REVIEW]: (state, action) =>
      produce(state, (draft) => {
        draft.data.totalReview++;
      }),
    [DELETE_REVIEW]: (state, action) =>
      produce(state, (draft) => {
        draft.data.totalReview--;
      }),
    [UPDATE_REVIEWS]: (state, action) =>
      produce(state, (draft) => {
        draft.data.reviews = action.payload;
      }),
    [UPDATE_LIKE]: (state, action) =>
      produce(state, (draft) => {
        draft.data.reviews.forEach((review) => {
          if (review.id == action.payload.id) {
            review.like = action.payload.like;
          }
        });
      }),
    [EDIT_REVIEW]: (state, action) =>
      produce(state, (draft) => {
        const index = draft.data.reviews.findIndex(
          (review) => review.id === action.payload.id
        );
        draft.data.reviews[index] = action.payload;
      }),
  },
  containerState
);

const updateStar = (starArr, starNum) => ({
  type: UPDATE_STAR,
  payload: { starArr, starNum },
});
const addReview = () => ({ type: ADD_REVIEW });
const deleteReview = () => ({ type: DELETE_REVIEW });
const updateReviews = (reviews) => ({ type: UPDATE_REVIEWS, payload: reviews });
const updateLike = (id, like) => ({ type: UPDATE_LIKE, payload: { id, like } });
const editReviewDispatch = (review) => ({ type: EDIT_REVIEW, payload: review });

const componentState = {
  form: false,
  last: null,
  star: 0,
  eidtClicked: false,
  editReview: [],
  page: 1,
};

function componentReducer(state, action) {
  switch (action.type) {
    case "SHOW_FORM":
      return produce(state, (draft) => {
        draft.form = true;
        draft.eidtClicked = false;
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
    case "STAR": // 현재 폼 작성에서 선택한 별 갯수
      return produce(state, (draft) => {
        draft.star = action.star;
      });
    case "RESET_STAR":
      return produce(state, (draft) => {
        draft.star = 0;
      });
    case "CLICK_EDIT": // 수정을 클릭했을때
      return produce(state, (draft) => {
        draft.form = true; // 폼 열고
        draft.eidtClicked = true; // 이 값을 조건부로 폼 컴포넌트에서 하는 코드가 달라짐
        draft.editReview = action.review; // 이 값으로 폼을 채운다.
      });
    case "CANCEL_EDIT":
      return produce(state, (draft) => {
        draft.form = false;
        draft.eidtClicked = false;
        draft.editReview = [];
      });
    case 'PAGE': // 현재 페이지
      return produce(state, (draft) => {
        draft.page = action.payload;
      });
  }
}

export {
  getBook,
  updateStar,
  addReview,
  deleteReview,
  updateReviews,
  updateLike,
  editReviewDispatch,
  componentState,
  componentReducer,
};
export default book;
