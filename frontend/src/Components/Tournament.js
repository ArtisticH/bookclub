import React, { useEffect, useState } from "react";
import styles from "../Css/Tournament.module.css";
import classNames from "classnames/bind";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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

const Round = ({ exp }) => {
  return (
    <div className={cx("round")}>
      <div className={cx("round-number")}>
        <span className={cx("round-current")}></span>&nbsp;/&nbsp;
        <span className={cx("round-total")}></span>
      </div>
      <div className={cx("exp")}>{exp}</div>
    </div>
  );
};

const TopImg = () => {
  return (
    <div className={cx("top-img")}>
      <div className={cx("img-box", "top")}>
        <img className={cx("img")} src="" alt="img" />
      </div>
    </div>
  );
};

const TopInfo = ({ types }) => {
  return (
    <div className={cx("top-info")}>
      {types === 'music' &&
      <>
      <audio className={cx("audio")} src=""></audio>
      <div className={cx("play")}>
        <img className={cx("img")} src="/img/icon/play.png" alt="play" />
      </div>
      <div className={cx("pause")} hidden>
        <img className="tournament-img" src="/img/icon/pause.png" alt="pause" />
      </div>
      </>
      }
      <div className={cx("main")}></div>
      <div className={cx("sub")}></div>
    </div>
  );
};

const BotImg = () => {
  return (
    <div className={cx("bot-img")}>
      <div className={cx("img-box", "bot")}>
        <img className={cx("img")} src="" alt="img" />
      </div>
    </div>
  );
};

const BotInfo = ({ types }) => {
  return (
    <div className={cx("bot-info")}>
      {types === 'music' &&
      <>
      <audio className={cx("audio")} src=""></audio>
      <div className={cx("play")}>
        <img className={cx("img")} src="/img/icon/play.png" alt="play" />
      </div>
      <div className={cx("pause")} hidden>
        <img className="tournament-img" src="/img/icon/pause.png" alt="pause" />
      </div>
      </>
      }
      <div className={cx("main")}></div>
      <div className={cx("sub")}></div>
    </div>
  );
};

const Battle = ({ original, info }) => {
  return (
    <div className={cx("battle")}>
      <Icon types={info.types} />
      <Round exp={info.exp}/>
      <TopImg />
      <TopInfo types={info.types}/>
      <BotImg />
      <BotInfo types={info.types}/>
    </div>
  );
};

const Tournament = () => {
  const params = useParams();
  const id = params.id;
  const round = params.round;
  const [original, setOriginal] = useState([]);
  const [info, setInfo] = useState({
    id: null,
    modelName: null,
    title: null,
    types: null,
    exp: null,
  });

  useEffect(() => {
    const startTournament = async () => {
      try {
        const res = await axios.get(`/favorite/${id}/${round}`);
        setOriginal(JSON.parse(res.data.original));
        setInfo((obj) => ({
          id: res.data.id,
          modelName: res.data.modelName,
          title: res.data.title,
          types: res.data.types,
          exp: res.data.explanation,
        }));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    startTournament();
  }, []);

  return (
    <>
      <div className={cx("tournament")}>
        <img
          className={cx("background")}
          src="/img/favorite/background.jpeg"
          alt="background"
        />
        <div className={cx("title")}>{info.title}</div>
        <Link to="/" className={cx("home")}>
          HOME
        </Link>
        <Battle original={original} info={info} />
      </div>
      {/* <Final id={id}/> */}
    </>
  );
};

export default Tournament;
