import React, { useCallback, useEffect, useReducer, useRef } from "react";
import styles from "../../Css/Favorite/Tournament.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import axios from "axios";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { tournamentState, reducer } from "../../Modules/Favorite/Tournament";

const cx = classNames.bind(styles);

const Final = ({ id, state }) => {
  const {
    choosen,
    info: { model },
    original,
  } = state;
  const This = useRef(null);
  const Download = useCallback(async () => {
    const saveBlob = await domtoimage.toBlob(This.current);
    saveAs(saveBlob, `${original[choosen].main}.jpeg`);
  }, []);
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
            ref={This}
            onClick={Download}
            className={cx("img")}
            src={`/img/${model}/${original[choosen].main}.jpeg`}
            alt="final"
          />
        </div>
      </div>
      <div className={cx("options")}>
        <div onClick={Download} className={cx("option")}>
          Img Download
        </div>
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

const Battle = ({ state, dispatch }) => {
  useEffect(() => {
    if (state.current > state.total && state.total !== 2) {
      dispatch({ type: "NEXT_ROUND" });
    } else if (state.total === 2 && state.current > state.total) {
      dispatch({ type: "GO_FINAL" });
    }
  }, [state.current]);

  useEffect(() => {
    const postResult = async () => {
      await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/favorite/final`,
      {
        original: JSON.stringify(state.original),
        modelName: state.info.model,
      },
      {withCredentials: true});
    };
    if (state.finalClicked) {
      postResult();
    }
  }, [state.finalClicked]);

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
