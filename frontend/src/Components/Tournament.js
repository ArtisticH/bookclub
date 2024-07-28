import React, { useCallback, useEffect, useReducer, useState } from "react";
import styles from "../Css/Tournament.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { produce } from "immer";

const cx = classNames.bind(styles);

const Final = ({ id }) => {
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
            <div className={cx("final-main")}></div>
            <div className={cx("final-sub")}></div>
          </div>
        </div>
        <div className={cx("final-main")}>
          <img className={cx("img")} src="" alt="final" />
        </div>
      </div>
      <div className={cx("options")}>
        <a className={cx("option")} href="" download="">
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
  const { current, total, info: { exp } } = state;
  return (
    <div className={cx("round")}>
      <div className={cx("round-number")}>
        <span className={cx("round-current")}>{current}</span>&nbsp;/&nbsp;
        <span className={cx("round-total")}>{total}</span>
      </div>
      <div className={cx("exp")}>{exp}</div>
    </div>
  );
};

const TopImg = ({ state }) => {
  const { main, index, info: { model } } = state;
  return (
    <div className={cx("top-img")}>
      <div className={cx("img-box", "top")}>
        <img className={cx("img")} src={`/img/${model}/${main[index]}.jpeg`} alt="img" />
      </div>
    </div>
  );
};

const TopInfo = ({ state }) => {
  const { info: { types, model }, main, sub, index } = state
  return (
    <div className={cx("top-info")}>
      {types === "music" && (
        <>
          <audio className={cx("audio")} src={`/audio/${model}/${main[index]}.mp3`}></audio>
          <div className={cx("play")}>
            <img className={cx("img")} src="/img/icon/play.png" alt="play" />
          </div>
          <div className={cx("pause")} hidden>
            <img
              className="tournament-img"
              src="/img/icon/pause.png"
              alt="pause"
            />
          </div>
        </>
      )}
      <div className={cx("main")}>{main[index]}</div>
      <div className={cx("sub")}>{sub[index]}</div>
    </div>
  );
};

const BotImg = ({ state }) => {
  const { main, index, info: { model } } = state;
  return (
    <div className={cx("bot-img")}>
      <div className={cx("img-box", "bot")}>
        <img className={cx("img")} src={`/img/${model}/${main[index + 1]}.jpeg`} alt="img" />
      </div>
    </div>
  );
};

const BotInfo = ({ state }) => {
  const { info: { types, model }, main, sub, index } = state
  return (
    <div className={cx("bot-info")}>
      {types === "music" && (
        <>
          <audio className={cx("audio")} src={`/audio/${model}/${main[index + 1]}.mp3`}></audio>
          <div className={cx("play")}>
            <img className={cx("img")} src="/img/icon/play.png" alt="play" />
          </div>
          <div className={cx("pause")} hidden>
            <img
              className="tournament-img"
              src="/img/icon/pause.png"
              alt="pause"
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
    num: [],
  },
  current: 0,
  total: 0,
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
        draft.main = action.main;
        draft.sub = action.sub;
      });
  }
}

const Battle = ({ state }) => {
  const ClickTop = () => {
    
  }
  return (
    <div className={cx("battle")}>
      <Icon types={state.info.types} />
      <Round state={state} />
      <TopImg state={state} />
      <TopInfo state={state} />
      <BotImg state={state} />
      <BotInfo state={state} />
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
  useEffect(() => {
    if (category && category.original) {
      dispatch({ type: "INIT", data: category, round });
      dispatch({ type: "SELECTED" });
      const main = state.random.map((item) => {
        return state.original[item].main;
      });
      const sub = state.random.map((item) => {
        return state.original[item].sub;
      });
      dispatch({ type: "MAINSUB", main, sub });
    }
  }, [category]);

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
            <Battle state={state} />
          </div>
          {state.final && <Final id={id} />}
        </>
      )}
    </>
  );
};

export default Tournament;
