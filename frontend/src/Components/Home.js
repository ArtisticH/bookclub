import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../Css/Home.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const gradient = [
  "linear-gradient(to top, #fff1eb 0%, #3fa7f3 100%)",
  "linear-gradient(to top, #fff1eb 0%, #edd649 100%)",
  "linear-gradient(to top, #fff1eb 0%, #99d1a2 100%)",
  "linear-gradient(to top, #fff1eb 0%, #dd504b 100%)",
];
const background = ["#0c3aa5", "#f1ca0b", "#039754", "#ab181b"];
const title = ["Books", "Members", "WISHLIST", "Fun"];

const TopLeft = ({ index, ClickLogIn, ClickSignUp }) => {
  return (
    <div className={cx("top-left")}>
      <Link to="/" className={cx("left-title")}>
        Book Club
      </Link>
      <div className={cx("btns")}>
        <div
          className={cx("btn")}
          style={{ backgroundColor: background[index] }}
          onClick={ClickLogIn}
        >
          LOG IN
        </div>
        <div
          className={cx("btn")}
          style={{ backgroundColor: background[index] }}
          onClick={ClickSignUp}
        >
          SIGN UP
        </div>
      </div>
    </div>
  );
};

const LogIn = ({ logIn, CancelLogIn }) => {
  return (
    <div className={cx("form", { visible: logIn })}>
      <div className={cx("nav")}>
        <div className={cx("cancel")} onClick={CancelLogIn}>
          <div className={cx("left")}></div>
          <div className={cx("right")}></div>
        </div>
      </div>
      <div className={cx("center")}>
        <div className={cx("form-title")}>LOG IN</div>
        <form method="post" action="/auth/login">
          <input
            className={cx("input", "common")}
            name="email"
            type="email"
            placeholder="e-mail*"
          />
          <input
            className={cx("input", "common")}
            name="password"
            type="password"
            placeholder="password*"
          />
          <input
            className={cx("input", "common", "button")}
            type="submit"
            value="LOG IN"
          />
        </form>
        <Link to="/auth/kakao" className={cx("kakao", "common")}>
          KAKAO
        </Link>
        <Link to="/auth/naver" className={cx("naver", "common")}>
          NAVER
        </Link>
      </div>
    </div>
  );
};

const SignUp = ({ signUp, CancelSignUp }) => {
  return (
    <div className={cx("form", { visible: signUp })}>
      <div className={cx("nav")}>
        <div className={cx("cancel")} onClick={CancelSignUp}>
          <div className={cx("left")}></div>
          <div className={cx("right")}></div>
        </div>
      </div>
      <div className={cx("center")}>
        <div className={cx("form-title")}>SIGN UP</div>
        <form method="post" action="/auth/signup">
          <input
            className={cx("input", "common")}
            type="email"
            name="email"
            placeholder="e-mail*"
          />
          <input
            className={cx("input", "common")}
            type="text"
            name="nick"
            placeholder="nickname*"
          />
          <input
            className={cx("input", "common")}
            type="password"
            name="password"
            placeholder="password*"
          />
          <input
            className={cx("input", "common", "button")}
            type="submit"
            value="SIGN UP"
          />
        </form>
      </div>
    </div>
  );
};

const BotLeft = ({ index }) => {
  return (
    <div
      className={cx("bot-left")}
      style={{ backgroundColor: background[index] }}
    ></div>
  );
};

const TopRight = ({ index }) => {
  const Right = useRef(null);
  const Scroll = useRef(null);
  useEffect(() => {
    const distance =
      Right.current.offsetHeight - Scroll.current.offsetHeight - 10;
    document.documentElement.style.setProperty("--distance", distance + "px");
  }, []);
  return (
    <div
      className={cx("top-right")}
      style={{ backgroundImage: gradient[index] }}
      ref={Right}
    >
      <div className={cx("right-titles")}>
        <Link
          to={`/${title[index].toLowerCase()}`}
          className={cx("right-title")}
        >
          {title[index]}
        </Link>
        <Link
          to={`/${title[index].toLowerCase()}`}
          className={cx("right-title", "italic")}
        >
          {title[index]}
        </Link>
      </div>
      <div className={cx("top-right-bot")}>
        <Link to={`/${title[index].toLowerCase()}`} className={cx("arrow")}>
          <img className={cx("img")} src="/img/icon/right-black-arrow.png" alt="arrow" />
        </Link>
        <div className={cx("number-text")}>
          <div className={cx("numbers")}>
            <div>{index + 1}</div>
            <div>/</div>
            <div>4</div>
          </div>
          <div className={cx("scroll")} ref={Scroll}>
            Scroll
          </div>
        </div>
      </div>
    </div>
  );
};

const BotRight = () => {
  return (
    <div className={cx("bot-right")}>
      <div className={cx("name")}>Seo Hanna</div>
      <div className={cx("name")}>Kim Jung Gyeong</div>
      <div className={cx("name")}>Kang Yelim</div>
      <div className={cx("name")}>Kim Hyuna</div>
    </div>
  );
};

const Home = () => {
  const [range, setRange] = useState({
    start: null,
    end: null,
  });
  const [step, setStep] = useState(null);
  const [index, setIndex] = useState(0);
  const [logIn, setLogin] = useState(false);
  const [signUp, setSignUp] = useState(false);

  const ClickLogIn = useCallback(() => {
    setLogin(true);
  }, []);

  const ClickSignUp = useCallback(() => {
    setSignUp(true);
  }, []);

  const CancelLogIn = useCallback(() => {
    setLogin(false);
  }, []);

  const CancelSignUp = useCallback(() => {
    setSignUp(false);
  }, []);

  const scrollHandler = (e) => {
    if (window.pageYOffset >= range.start && window.pageYOffset < range.end) {
      setIndex((index) =>
        Math.floor((window.pageYOffset - range.start) / step)
      );
    }
  };
  // range -> step 순으로 상태 업데이트, 그리고
  // step까지 값이 채워져야 스크롤 함수가 오류 없이 작동
  useEffect(() => {
    document.body.style.height = '1000vh';
    setRange((obj) => ({
      start: document.body.offsetTop + 400,
      end: document.body.offsetHeight - document.documentElement.clientHeight,
    }));
  }, []);

  useEffect(() => {
    setStep((range.end - range.start) / 4);
  }, [range]);

  useEffect(() => {
    if (step) {
      window.addEventListener("scroll", scrollHandler);
    }
  }, [step]);

  return (
    <div className={cx("home")}>
      <div className={cx("sticky")}>
        <div className={cx("top")}>
          <TopLeft
            index={index}
            ClickLogIn={ClickLogIn}
            ClickSignUp={ClickSignUp}
          />
          <LogIn logIn={logIn} CancelLogIn={CancelLogIn} />
          <SignUp signUp={signUp} CancelSignUp={CancelSignUp} />
          <TopRight index={index} />
        </div>
        <div className={cx("bot")}>
          <BotLeft index={index} />
          <BotRight />
        </div>
      </div>
    </div>
  );
};

export default Home;
