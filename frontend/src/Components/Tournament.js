import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import styles from "../Css/Tournament.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { produce } from "immer";

const cx = classNames.bind(styles);

const Final = ({ id, state }) => {
  const { choosen, info: { model }, original } = state;
  return (
    <div className={cx("modal")}>
      <div className={cx("nav")}>
        <Link to="/favorite" className={cx("modal-other")}>
          Other Category...
        </Link>
        <Link to="/" className={cx("modal-home")}>
          HOME
        </Link>
      </div>
      <div className={cx("final")}>
        <div className={cx("final-info")}>
          <div className={cx("final-title")}>Your Favorite Is...</div>
          <div>
            <div className={cx("final-main")}>{original[choosen].main}</div>
            <div className={cx("final-sub")}>{original[choosen].sub}</div>
          </div>
        </div>
        <div className={cx("final-main")}>
          <img
            className={cx("img")}
            src={`/img/${model}/${original[choosen].main}.jpeg`}
            alt="final"
          />
        </div>
      </div>
      <div className={cx("options")}>
        <a
          className={cx("option")}
          href={`/img/${model}/${original[choosen].main}.jpeg`}
          download={`${original[choosen].main}.jpeg`}
        >
          Img Download
        </a>
        <Link to={`/favorite/ranking/${id}`} className={cx("option")}>
          See Ranking
        </Link>
      </div>
    </div>
  );
};

const Icon = ({ types }) => {
  return (
    <div className={cx("icon")}>
      {types === "music" ? (
        <>
          <div className={cx("icon-img-box")}>
            <img className={cx("img")} src="/img/icon/music.png" alt="music" />
          </div>
          <div className={cx("icon-text")}>
            Click Play & Pause Icon!
            <br />
            And Enjoy Music!🤟
          </div>
        </>
      ) : (
        <div className={cx("icon-text")}>
          Click Img to Choose Your Favorite! 💖
        </div>
      )}
    </div>
  );
};

const Round = ({ state }) => {
  const {
    current,
    total,
    final,
    info: { exp },
  } = state;

  return (
    <div className={cx("round")}>
      <div className={cx("round-number")}>
        {final ? (
          <>Final</>
        ) : (
          <>
            <span className={cx("round-current")}>{current}</span>&nbsp;/&nbsp;
            <span className={cx("round-total")}>{total}</span>
          </>
        )}
      </div>
      <div className={cx("exp")}>{exp}</div>
    </div>
  );
};

const TopImg = ({ state, dispatch }) => {
  const {
    main,
    index,
    final,
    info: { model },
  } = state;

  const Click = useCallback(() => {
    if (!!main.length) {
      dispatch({ type: "CLICKED", position: "top" });
    }
  }, [main]);

  const FinalClick = useCallback(() => {
    dispatch({ type: "FINAL_CLICKED", position: "top" });
  }, []);

  useEffect(() => {
    console.log(state);
  }, [index]);

  return (
    <div className={cx("top-img")}>
      <div
        className={cx("img-box", "top")}
        onClick={final ? FinalClick : Click}
      >
        <img
          className={cx("img")}
          src={`/img/${model}/${main[index]}.jpeg`}
          alt="img"
        />
      </div>
    </div>
  );
};

const TopInfo = ({ state, dispatch }) => {
  const {
    info: { types, model },
    main,
    sub,
    index,
    play: { top, bottom },
  } = state;
  const Audio = useRef(null);
  const Play = useCallback(() => {
    Audio.current.play();
    dispatch({ type: "TOP_PLAY" });
  }, []);

  const Pause = useCallback(() => {
    Audio.current.pause();
    dispatch({ type: "TOP_PAUSE" });
  }, []);

  const ended = useCallback(() => {
    Audio.current.pause();
    dispatch({ type: "TOP_PAUSE" });
  }, []);

  useEffect(() => {
    // bottom이 재생되고 있으면 오디오 멈추기
    if (bottom) {
      Audio.current.pause();
      Audio.current.currentTime = 0;
    }
  }, [bottom]);

  return (
    <div className={cx("top-info")}>
      {types === "music" && (
        <>
          <audio
            className={cx("audio")}
            src={`/audio/${model}/${main[index]}.mp3`}
            ref={Audio}
            onEnded={ended}
          ></audio>
          <div className={cx("play")} onClick={top ? Pause : Play}>
            <img
              className={cx("img")}
              src={top ? "/img/icon/pause.png" : "/img/icon/play.png"}
              alt="play"
            />
          </div>
        </>
      )}
      <div className={cx("main")}>{main[index]}</div>
      <div className={cx("sub")}>{sub[index]}</div>
    </div>
  );
};

const BotImg = ({ state, dispatch }) => {
  const {
    main,
    index,
    final,
    info: { model },
  } = state;

  const Click = useCallback(() => {
    if (!!main.length) {
      dispatch({ type: "CLICKED", position: "bottom" });
    }
  }, [main]);

  const FinalClick = useCallback(() => {
    dispatch({ type: "FINAL_CLICKED", position: "bottom" });
  }, []);

  useEffect(() => {
    console.log(state);
  }, [index]);

  return (
    <div className={cx("bot-img")}>
      <div
        className={cx("img-box", "bot")}
        onClick={final ? FinalClick : Click}
      >
        <img
          className={cx("img")}
          src={`/img/${model}/${main[index + 1]}.jpeg`}
          alt="img"
        />
      </div>
    </div>
  );
};

const BotInfo = ({ state, dispatch }) => {
  const {
    info: { types, model },
    main,
    sub,
    index,
    play: { top, bottom },
  } = state;
  const Audio = useRef(null);
  const Play = useCallback(() => {
    Audio.current.play();
    dispatch({ type: "BOTTOM_PLAY" });
  }, []);

  const Pause = useCallback(() => {
    Audio.current.pause();
    dispatch({ type: "BOTTOM_PAUSE" });
  }, []);

  const ended = useCallback(() => {
    Audio.current.pause();
    dispatch({ type: "BOTTOM_PAUSE" });
  }, []);

  useEffect(() => {
    // top이 재생되고 있으면 오디오 멈추기
    if (top) {
      Audio.current.pause();
      Audio.current.currentTime = 0;
    }
  }, [top]);

  return (
    <div className={cx("bot-info")}>
      {types === "music" && (
        <>
          <audio
            className={cx("audio")}
            src={`/audio/${model}/${main[index + 1]}.mp3`}
            ref={Audio}
            onEnded={ended}
          ></audio>
          <div className={cx("play")} onClick={bottom ? Pause : Play}>
            <img
              className={cx("img")}
              src={bottom ? "/img/icon/pause.png" : "/img/icon/play.png"}
              alt="play"
            />
          </div>
        </>
      )}
      <div className={cx("main")}>{main[index + 1]}</div>
      <div className={cx("sub")}>{sub[index + 1]}</div>
    </div>
  );
};

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

const Battle = ({ state, dispatch }) => {
  useEffect(() => {
    if (state.current > state.total && state.total !== 2) {
      dispatch({ type: "NEXT_ROUND" });
    } else if (state.total === 2 && state.current > state.total) {
      dispatch({ type: "GO_FINAL" });
    }
  }, [state.current]);

  return (
    <div className={cx("battle")}>
      <Icon types={state.info.types} />
      <Round state={state} />
      <TopImg state={state} dispatch={dispatch} />
      <TopInfo state={state} dispatch={dispatch} />
      <BotImg state={state} dispatch={dispatch} />
      <BotInfo state={state} dispatch={dispatch} />
    </div>
  );
};

const makeRandom = (round) => {
  const arr = Array.from({ length: 32 }, (_, i) => i); // 0부터 31까지 숫자 배열 생성
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // 요소를 무작위로 섞음
  }
  return arr.slice(0, round); // 필요한 개수만큼 잘라서 반환
};

const Tournament = ({ category, loading, id, round }) => {
  const [state, dispatch] = useReducer(reducer, tournamentState);
  let first = false;
  useEffect(() => {
    if (category && category.original && !first) {
      first = true;
      dispatch({ type: "INIT", data: category, round });
      dispatch({ type: "SELECTED" });
      dispatch({ type: "MAINSUB" });
    }
  }, [category]);

  useEffect(() => {
    if(state.finalClicked) {
      console.log('지금')
    }

  }, [state.finalClicked])

  return (
    <>
      {loading && <div className={cx("loading")}>로딩중...</div>}
      {!loading && category && category.original && (
        <>
          <div className={cx("tournament")}>
            <img
              className={cx("background")}
              src="/img/favorite/background.jpeg"
              alt="background"
            />
            <div className={cx("title")}>{state.info.title}</div>
            <Link to="/" className={cx("home")}>
              HOME
            </Link>
            <Battle state={state} dispatch={dispatch} />
          </div>
          {state.finalClicked && <Final id={id} state={state} />}
        </>
      )}
    </>
  );
};

export default Tournament;
