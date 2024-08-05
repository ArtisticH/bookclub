import { handleActions } from "redux-actions";
import axios from "axios";
import { produce } from "immer";

const GET_HOME = "Home/GET_HOME";
const LOGIN = "Home/LOGIN";
const NOT_LOGIN = "Home/NOT_LOGIN";
const GET_HOME_FAILURE = "Home/GET_HOME_FAILURE";

const getHome = (auth, AuthUser, AuthMembers) => async (dispatch) => {
  dispatch({ type: GET_HOME });
  if(auth) {
    dispatch({
      type: LOGIN,
      payload: {
        user: AuthUser,
        members: AuthMembers
      }, 
    });  
  } else {
    try {
      const res = await axios.get(`/home`);
      const user = res.data.user;
      const members = res.data.members;
      if(user) { // 로그인 상태
        dispatch({
          type: LOGIN,
          payload: {
            user,
            members
          }, 
        });  
      } else { // 로그인이 안되어있는 상태
        dispatch({
          type: NOT_LOGIN,
          payload: {
            user,
            members
          },
        });  
      }
    } catch (e) {
      dispatch({
        type: GET_HOME_FAILURE,
      });
      throw e;
    }  
  }
};
// 하위 컴포넌트에서 상태를 바꿀 수 있는 방법
const LogIn = (user, members) => ({ type: LOGIN, payload: { user, members } });
const LogOut = (members) => ({ type: NOT_LOGIN, payload: { members } });

const containerState = {
  loading: false,
  user: null,
  login: false,
  members: [],
};

const home = handleActions( // 루트 리듀서
  {
    [GET_HOME]: (state) => ({
      ...state,
      loading: true,
    }),
    [LOGIN]: (state, action) => ({
      loading: false,
      user: action.payload.user,
      login: true,
      members: action.payload.members,
    }),
    [NOT_LOGIN]: (state, action) => ({
      user: null,
      login: false,
      loading: false,
      members: action.payload.members,
    }),
    [GET_HOME_FAILURE]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  containerState
);

const componentState = {
  range: {
    start: null,
    end: null,
  },
  step: null,
  index: 0,
  form: {
    formLogin: false,
    formSignup: false,
  },
  wishlist: false,
};

function componentReducer(state, action) {
  switch(action.type) {
    case 'SET_RANGE':
      return produce(state, draft => {
        draft.range.start = action.offsetTop + 400;
        draft.range.end = action.offsetHeight - action.browserHeight; 
      })
    case 'SET_STEP':
      return produce(state, draft => {
        draft.step = (draft.range.end - draft.range.start) / 4;
      })
    case 'INDEX':
      return produce(state, draft => {
        draft.index = action.index;
      })
    case 'FORM_LOGIN':
      return produce(state, draft => {
        draft.form.formLogin = true;
      })
    case 'FORM_SIGNUP':
      return produce(state, draft => {
        draft.form.formSignup = true;
      })  
    case 'FORM_CANCEL_LOGIN':
      return produce(state, draft => {
        draft.form.formLogin = false;
      })
    case 'FORM_CANCEL_SIGNUP':
      return produce(state, draft => {
        draft.form.formSignup = false;
      })
    case 'SHOW_WISHLIST':
      return produce(state, draft => {
        draft.wishlist = true;
      })
    case 'CANCEL_WISHLIST':
      return produce(state, draft => {
        draft.wishlist = false;
      }) 
  }
}

export { getHome, LogIn, LogOut, componentState, componentReducer };
export default home;
