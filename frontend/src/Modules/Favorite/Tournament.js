import { handleActions } from "redux-actions";
import axios from "axios";
import { produce } from "immer";

const GET_CATEGORY = "Category/GET_CATEGORY";
const GET_CATEGORY_SUCCESS = "Category/GET_CATEGORY_SUCCESS";
const GET_CATEGORY_FAILURE = "Category/GET_CATEGORY_FAILURE";

const getCategory = (id, round) => async (dispatch) => {
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

const tournamentState = {
  index: 0,
  final: false,
  random: [],
  original: [],
  info: {},
  main: [],
  sub: [],
  tem: {
    main: [],
    sub: [],
    random: [],
  },
  current: 0,
  total: 0,
  play: {
    top: false,
    bottom: false,
  },
  choosen: null,
  finalClicked: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return produce(state, (draft) => {
        draft.original = JSON.parse(action.data.original);
        draft.info = {
          id: action.data.id,
          title: action.data.title,
          model: action.data.modelName,
          types: action.data.types,
          exp: action.data.explanation,
        };
        draft.random = makeRandom(action.round);
        draft.current = 1;
        draft.total = +action.round / 2;
      });
    case "SELECTED":
      return produce(state, (draft) => {
        draft.original.forEach((item) => {
          item.selected++;
        });
      });
    case "MAINSUB":
      return produce(state, (draft) => {
        draft.main = state.random.map((item) => {
          return state.original[item].main;
        });
        draft.sub = state.random.map((item) => {
          return state.original[item].sub;
        });
      });
    case "TOP_PLAY":
      return produce(state, (draft) => {
        draft.play.top = true;
        draft.play.bottom = false;
      });
    case "TOP_PAUSE":
      return produce(state, (draft) => {
        draft.play.top = false;
      });
    case "BOTTOM_PLAY":
      return produce(state, (draft) => {
        draft.play.top = false;
        draft.play.bottom = true;
      });
    case "BOTTOM_PAUSE":
      return produce(state, (draft) => {
        draft.play.bottom = false;
      });
    case "CLICKED":
      const choosen =
        action.position === "top"
          ? state.random[state.index]
          : state.random[state.index + 1];
      return produce(state, (draft) => {
        draft.choosen = choosen;
        draft.original[choosen].win++;
        draft.original[choosen].selected++;
        draft.tem.random[draft.tem.random.length] = choosen;
        draft.tem.main[draft.tem.main.length] = draft.original[choosen].main;
        draft.tem.sub[draft.tem.sub.length] = draft.original[choosen].sub;
        draft.index += 2;
        draft.play.top = false;
        draft.play.bottom = false;
        draft.current++;
      });
    case "NEXT_ROUND":
      return produce(state, (draft) => {
        draft.current = 1;
        draft.total /= 2;
        draft.index = 0;
        draft.main = draft.tem.main;
        draft.sub = draft.tem.sub;
        draft.random = draft.tem.random;
        draft.tem.main = [];
        draft.tem.sub = [];
        draft.tem.random = [];
      });
    case "GO_FINAL":
      return produce(state, (draft) => {
        draft.final = true;
        draft.index = 0;
        draft.main = draft.tem.main;
        draft.sub = draft.tem.sub;
        draft.random = draft.tem.random;
        draft.tem.main = [];
        draft.tem.sub = [];
        draft.tem.random = [];
      });
    case "FINAL_CLICKED":
      const finalNumber =
        action.position === "top"
          ? state.random[state.index]
          : state.random[state.index + 1];
      return produce(state, (draft) => {
        draft.choosen = finalNumber;
        draft.original[finalNumber].win++;
        draft.original[finalNumber].finalWin++;
        draft.play.top = false;
        draft.play.bottom = false;
        draft.finalClicked = true;
      });
  }
}

const makeRandom = (round) => {
  const arr = Array.from({ length: 32 }, (_, i) => i); // 0부터 31까지 숫자 배열 생성
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // 요소를 무작위로 섞음
  }
  return arr.slice(0, round); // 필요한 개수만큼 잘라서 반환
};


export { getCategory, tournamentState, reducer };
