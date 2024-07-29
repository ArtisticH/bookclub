import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import styles from "../Css/Home.module.css";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { componentState, componentReducer } from "../Modules/Home";

const cx = classNames.bind(styles);

const gradient = [
  "linear-gradient(to top, #fff1eb 0%, #3fa7f3 100%)",
  "linear-gradient(to top, #fff1eb 0%, #edd649 100%)",
  "linear-gradient(to top, #fff1eb 0%, #99d1a2 100%)",
  "linear-gradient(to top, #fff1eb 0%, #dd504b 100%)",
];
const background = ["#0c3aa5", "#f1ca0b", "#039754", "#ab181b"];
const title = ["Books", "Members", "WISHLIST", "Fun"];

const TopLeft = ({ login, state, dispatch }) => {
  const { index } = state;
  const ClickLogIn = useCallback(() => {
    dispatch({ type: "FORM_LOGIN" });
  }, []);

  const ClickSignUp = useCallback(() => {
    dispatch({ type: "FORM_SIGNUP" });
  }, []);

  return (
    <div className={cx("top-left")}>
      <Link to="/" className={cx("left-title")}>
        Book Club
      </Link>
      {/* 로그인 안 했을때만 보인다. */}
      {!login && (
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
      )}
    </div>
  );
};

const LogInForm = ({ state, dispatch, LogIn }) => {
  const {
    form: { formLogin },
  } = state;
  const This = useRef(null);
  const CancelLogIn = useCallback(() => {
    dispatch({ type: "FORM_CANCEL_LOGIN" });
  }, []);

  const Submit = useCallback(async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });
      CancelLogIn();
      const success = res.data.success;
      if (success) {
        LogIn(res.data.user);
        alert("로그인 완료!");
      } else {
        const message = res.data.message;
        alert(message);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className={cx("form", { visible: formLogin })}>
      <div className={cx("nav")}>
        <div className={cx("cancel")} onClick={CancelLogIn}>
          <div className={cx("left")}></div>
          <div className={cx("right")}></div>
        </div>
      </div>
      <div className={cx("center")}>
        <div className={cx("form-title")}>LOG IN</div>
        <form ref={This} onSubmit={Submit}>
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

const SignUpForm = ({ state, dispatch }) => {
  const {
    form: { formSignup },
  } = state;
  const CancelSignUp = useCallback(() => {
    dispatch({ type: "FORM_CANCEL_SIGNUP" });
  }, []);

  const This = useRef(null);

  const Submit = useCallback(async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const nick = e.target.nick.value;
    const password = e.target.password.value;
    try {
      const res = await axios.post("/auth/signup", {
        email,
        nick,
        password,
      });
      CancelSignUp();
      const success = res.data.success;
      if (success) {
        alert("회원가입 완료! 로그인을 진행해주세요.");
      } else {
        const message = res.data.message;
        alert(message);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className={cx("form", { visible: formSignup })}>
      <div className={cx("nav")}>
        <div className={cx("cancel")} onClick={CancelSignUp}>
          <div className={cx("left")}></div>
          <div className={cx("right")}></div>
        </div>
      </div>
      <div className={cx("center")}>
        <div className={cx("form-title")}>SIGN UP</div>
        <form ref={This} onSubmit={Submit}>
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

const BotLeft = ({ state }) => {
  const { index } = state;
  return (
    <div
      className={cx("bot-left")}
      style={{ backgroundColor: background[index] }}
    ></div>
  );
};

const TopRight = ({ state, dispatch }) => {
  const { index } = state;
  const Right = useRef(null);
  const Scroll = useRef(null);
  useEffect(() => {
    const distance =
      Right.current.offsetHeight - Scroll.current.offsetHeight - 10;
    document.documentElement.style.setProperty("--distance", distance + "px");
  }, []);

  const ClickWishlist = useCallback(() => {
    dispatch({ type: "SHOW_WISHLIST" });
  }, []);

  return (
    <div
      className={cx("top-right")}
      style={{ backgroundImage: gradient[index] }}
      ref={Right}
    >
      {index === 2 ? ( // 위시리스트 선택창 보여주기
        <div className={cx("right-titles")}>
          <div className={cx("right-title")} onClick={ClickWishlist}>
            {title[index]}
          </div>
          <div className={cx("right-title", "italic")} onClick={ClickWishlist}>
            {title[index]}
          </div>
        </div>
      ) : (
        // 다른 페이지로 이동
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
      )}
      <div className={cx("top-right-bot")}>
        {index === 2 ? (
          <div className={cx("arrow")} onClick={ClickWishlist}>
            <img
              className={cx("img")}
              src="/img/icon/right-black-arrow.png"
              alt="arrow"
            />
          </div>
        ) : (
          <Link to={`/${title[index].toLowerCase()}`} className={cx("arrow")}>
            <img
              className={cx("img")}
              src="/img/icon/right-black-arrow.png"
              alt="arrow"
            />
          </Link>
        )}
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

const Card = ({ user, LogOut }) => {
  const ClickLogOut = useCallback(async () => {
    const res = await axios.get("/auth/logout");
    const success = res.data.success;
    if (success) {
      LogOut();
      alert("로그아웃이 완료되었습니다.");
    }
  }, []);
  return (
    <div className={cx("card")}>
      <Link className={cx("nick")} to={`/members?member=${user.id}`}>
        {user.nick}
      </Link>
      <div className={cx("user-wishlist")}>
        <div className={cx("user-wishlist-exp")}>CHECK YOUR WISHLIST</div>
        <Link to={`/wishlist/${user.id}`} className={cx("user-wishlist-title")}>
          WISHLIST
        </Link>
      </div>
      <div className={cx("logout")}>
        <div onClick={ClickLogOut} className={cx("logout-link")}>
          LOGOUT
        </div>
      </div>
    </div>
  );
};

const Wishlist = ({ members, dispatch }) => {
  const navigate = useNavigate();
  const ClickWishlist = useCallback(() => {
    dispatch({ type: "CANCEL_WISHLIST" });
  }, []);

  const Submit = useCallback((e) => {
    e.preventDefault();
    const id = e.target.wishlist.value;
    ClickWishlist();
    navigate(`/wishlist/${id}`);
  }, [])

  return (
    <div className={cx("wish")}>
      <div className={cx("wish-nav")}>
        <div className={cx("wish-title")}>WISHLIST</div>
        <div className={cx("wish-cancel")} onClick={ClickWishlist}>
          <div className={cx("wish-cancel-left")}></div>
          <div className={cx("wish-cancel-right")}></div>
        </div>
      </div>
      <form className={cx("wish-form")} onSubmit={Submit}>
        <div className={cx("wish-grid")}>
          {members.map((member) => (
            <Member key={member.id} member={member} />
          ))}
        </div>
        <input type="submit" value="선택" className={cx("wish-submit")} />
      </form>
    </div>
  );
};

const Member = ({ member }) => {
  return (
    <div>
      <input id={member.nick} type="radio" className={cx("wish-input")} name="wishlist" value={member.id} />
      <label htmlFor={member.nick} className={cx("label")}>
        {member.nick}
      </label>
    </div>
  );
};

const Home = ({ user, loading, login, members, LogIn, LogOut }) => {
  const [state, dispatch] = useReducer(componentReducer, componentState);
  const {
    range: { start, end },
    step,
    wishlist,
  } = state;

  const scrollHandler = (e) => {
    if (window.pageYOffset >= start && window.pageYOffset < end) {
      dispatch({
        type: "INDEX",
        index: Math.floor((window.pageYOffset - start) / step),
      });
    }
  };

  useEffect(() => {
    document.body.style.height = "1000vh";
    const offsetTop = document.body.offsetTop;
    const offsetHeight = document.body.offsetHeight;
    const browserHeight = document.documentElement.clientHeight;
    dispatch({ type: "SET_RANGE", offsetTop, offsetHeight, browserHeight });
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_STEP" });
  }, [start, end]);

  useEffect(() => {
    if (step) {
      window.addEventListener("scroll", scrollHandler);
    }
  }, [step]);

  return (
    <>
      {loading && <div className={cx("loading")}>로딩중...</div>}
      {!loading && (
        <>
          <div className={cx("home")}>
            <div className={cx("sticky")}>
              <div className={cx("top")}>
                <TopLeft login={login} state={state} dispatch={dispatch} />
                {/* 로그인 안한 경우에만 노출 */}
                {!login && (
                  <>
                    <LogInForm
                      state={state}
                      dispatch={dispatch}
                      LogIn={LogIn}
                    />
                    <SignUpForm state={state} dispatch={dispatch} />
                  </>
                )}
                <TopRight state={state} dispatch={dispatch} />
              </div>
              <div className={cx("bot")}>
                <BotLeft state={state} />
                <BotRight />
              </div>
            </div>
          </div>
          {login && <Card user={user} LogOut={LogOut} />}
          {wishlist && <Wishlist members={members} dispatch={dispatch} />}
        </>
      )}
    </>
  );
};

export default Home;
