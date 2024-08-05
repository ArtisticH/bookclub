import React, { useCallback, useEffect, useReducer, useRef } from "react";
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

const TopLeft = ({ login, index, dispatch }) => {
  // formLogin과 formSignup값이 true가 되고
  // <LogInForm>과 <SignUpForm>에서 클래스 조건부를 { visible: true }로 만들어 폼을 등장시킨다.
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
      {/* index에 따라 버튼 배경색이 바뀐다. */}
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

const LogInForm = ({ formLogin, dispatch, LogIn, members }) => {
  // formLogin = false;
  const CancelLogIn = useCallback(() => {
    dispatch({ type: "FORM_CANCEL_LOGIN" });
  }, []);
  const Kakao = useCallback(() => {
    window.location.href = 'http://localhost:3001/auth/kakao'; 
  }, [])
  const Naver = useCallback(() => {
    window.location.href = 'http://localhost:3001/auth/naver'; 
  }, [])

  // 로그인을 진행할때
  const Submit = useCallback(async (e) => {
    e.preventDefault();
    console.log("로그인");
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });
      CancelLogIn(); // 창을 없애고
      const success = res.data.success;
      if (success) {
        // 성공했다면 루트 리듀서에 저장한 상태 변경
        // 멤버들도 보내야함, 이제 user 상태에서 진짜 유저 데이터 정보를 쓸 수 있음.
        LogIn(res.data.user, members);
        alert("로그인 완료!");
      } else {
        // 실패했을경우 메세지 보여주기
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
        <form onSubmit={Submit}>
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
        <div onClick={Kakao} className={cx("kakao", "common")}>
        KAKAO
        </div>
        <div onClick={Naver} className={cx("naver", "common")}>
        NAVER
        </div>
      </div>
    </div>
  );
};

const SignUpForm = ({ formSignup, dispatch }) => {
  const CancelSignUp = useCallback(() => {
    dispatch({ type: "FORM_CANCEL_SIGNUP" });
  }, []);
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
        <form onSubmit={Submit}>
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

const TopRight = ({ index, dispatch }) => {
  const Right = useRef(null);
  const Scroll = useRef(null);
  useEffect(() => {
    // css값 설정
    const distance =
      Right.current.offsetHeight - Scroll.current.offsetHeight - 10;
    document.documentElement.style.setProperty("--distance", distance + "px");
  }, []);
  // wishlist타이틀이나 화살표 선택시 라우트 이동이 아니라 멤버 선택 창을 보여준다.
  // 그러면 <Home>에서 wishlist값의 변화로 <Wishlist>가 보여진다.
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
              className="img"
              src="/img/icon/right-black-arrow.png"
              alt="arrow"
            />
          </div>
        ) : (
          <Link to={`/${title[index].toLowerCase()}`} className={cx("arrow")}>
            <img
              className="img"
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

const Card = ({ user, LogOut, members }) => {
  let shiftX;
  let shiftY;
  const This = useRef(null);

  useEffect(() => {
    This.current.addEventListener("pointerdown", dragDrop);
  });

  const dragDrop = useCallback((e) => {
    shiftX = e.clientX - This.current.getBoundingClientRect().left;
    shiftY = e.clientY - This.current.getBoundingClientRect().top;
    This.current.style.zIndex = 1000;
    moveat(e.clientX, e.clientY);
    document.addEventListener("pointermove", pointermove);
    This.current.addEventListener("pointerup", pointerup);
    This.current.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });
  }, []);

  const moveat = useCallback((clientX, clientY) => {
    This.current.style.left = clientX - shiftX + "px";
    This.current.style.top = clientY - shiftY + "px";
  }, []);

  const pointermove = useCallback((e) => {
    moveat(e.clientX, e.clientY);
  }, []);

  const pointerup = useCallback(() => {
    document.removeEventListener("pointermove", pointermove);
    This.current.removeEventListener("pointerup", pointerup);
  }, []);

  const ClickLogOut = useCallback(async () => {
    const res = await axios.get("/auth/logout");
    const success = res.data.success;
    if (success) {
      LogOut(members);
      alert("로그아웃이 완료되었습니다.");
    }
  }, []);

  return (
    <>
      {user &&
        user.id && ( // 로그인을 해서 유저 값이 있는 경우에만
          <div className={cx("card")} ref={This}>
            <Link className={cx("nick")} to={`/members?member=${user.id}`}>
              {user.nick}
            </Link>
            <div className={cx("user-wishlist")}>
              <div className={cx("user-wishlist-exp")}>CHECK YOUR WISHLIST</div>
              <Link
                to={`/wishlist/${user.id}`}
                className={cx("user-wishlist-title")}
              >
                WISHLIST
              </Link>
            </div>
            <div className={cx("logout")}>
              <div onClick={ClickLogOut} className={cx("logout-link")}>
                LOGOUT
              </div>
            </div>
          </div>
        )}
    </>
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
  }, []);

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
          {members && members.map((member) => (
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
      <input
        id={member.nick}
        type="radio"
        className={cx("wish-input")}
        name="wishlist"
        value={member.id}
      />
      <label htmlFor={member.nick} className={cx("label")}>
        {member.nick}
      </label>
    </div>
  );
};

const Home = ({ user, loading, login, members, LogIn, LogOut }) => {
  // 컴포넌트 내에서 사용할 상태와 디스패치
  const [state, dispatch] = useReducer(componentReducer, componentState);
  const {
    range: { start, end },
    step,
    wishlist,
    index,
    form: { formLogin, formSignup },
  } = state;

  const scrollHandler = (e) => {
    // 현재 스크롤 위치에 따라 인덱스가 정해지고
    // 그 인덱스에 따라 배경이나 타이틀 등이 바뀐다.
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
    // 범위 즉 시작과 끝을 정한다.
    dispatch({ type: "SET_RANGE", offsetTop, offsetHeight, browserHeight });
  }, []);

  useEffect(() => {
    // 시작과 끝이 정해지면 구간을 정한다.
    if (start && end) {
      dispatch({ type: "SET_STEP" });
    }
  }, [start, end]);

  useEffect(() => {
    // 스텝이 정해지면 이벤트를 등록한다.
    if (step) {
      window.addEventListener("scroll", scrollHandler);
    }
  }, [step]);

  return (
    // 로딩중이면 로딩중이라고 표시
    // 로딩이 끝나면 화면 표시
    <>
      {loading && <div className="loading">로딩중...</div>}
      {!loading && (
        <>
          <div className={cx("home")}>
            <div className={cx("sticky")}>
              <div className={cx("top")}>
                <TopLeft login={login} index={index} dispatch={dispatch} />
                {/* 로그인 안한 경우에만 노출 */}
                {!login && (
                  <>
                    <LogInForm
                      formLogin={formLogin}
                      dispatch={dispatch}
                      LogIn={LogIn}
                      members={members}
                    />
                    <SignUpForm formSignup={formSignup} dispatch={dispatch} />
                  </>
                )}
                <TopRight index={index} dispatch={dispatch} />
              </div>
              <div className={cx("bot")}>
                <BotLeft index={index} />
                <BotRight />
              </div>
            </div>
          </div>
          {/* 로그인 한 경우에만 노출 */}
          {login && <Card user={user} LogOut={LogOut} members={members} />}
          {wishlist && <Wishlist members={members} dispatch={dispatch} />}
        </>
      )}
    </>
  );
};

export default Home;
