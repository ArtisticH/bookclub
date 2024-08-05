import React, { useCallback, useReducer, useMemo, useEffect } from "react";
import styles from "../Css/Members.module.css";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import { componentState, componentReducer } from "../Modules/Members";

const cx = classNames.bind(styles);

const Nav = ({ data, state, dispatch }) => {
  const { members } = data;
  const Click = useCallback(() => {
    dispatch({ type: "CLOSE" });
  }, []);

  return (
    <div className={cx("nav")}>
      <div className={cx("title")} onClick={Click}>
        MEMBERS
      </div>
      {data &&
        members &&
        members.map((member) => (
          <Member
            key={member.id}
            state={state}
            member={member}
            dispatch={dispatch}
          />
        ))}
    </div>
  );
};

const Member = ({ state, member, dispatch }) => {
  const { who } = state;
  const Click = useCallback(() => {
    dispatch({ type: "OPEN", id: member.id });
  }, []);
  return (
    <div className={cx("name", { clicked: who == member.id })} onClick={Click}>
      {member.nick}
    </div>
  );
};

const Books = ({ data, state }) => {
  const { books } = data;
  const { who } = state;
  return (
    <div className={cx("books")}>
      {data &&
        books &&
        books.map((book) => (
          <Link
            key={book.id}
            className={cx("book", { clicked: book.MemberId == who })}
            to={`/books/${book.id}`}
          >
            {book.title}
          </Link>
        ))}
    </div>
  );
};

const Btns = ({ state }) => {
  const { show, who } = state;
  const navigate = useNavigate();
  const Wishlist = useCallback(() => {
    navigate(`/wishlist/${who}`);
  }, [who]);
  return (
    <div className={cx("btn-box")}>
      <Link to="/" className={cx("btn", "home")}>
        HOME
      </Link>
      <Link to="/open" className={cx("btn", "api")}>
        OPEN API
      </Link>
      <Link to="/deco" className={cx("btn", "quotes")}>
        Quotes
      </Link>
      <div
        className={cx("btn", "wishlist", { clicked: show })}
        onClick={show ? Wishlist : null}
      >
        WISHLIST
      </div>
      <Link to="/favorite" className={cx("btn", "favorite")}>
        Favorite
      </Link>
    </div>
  );
};

const Numbers = ({ data, state }) => {
  const { totalBooks, attend, books } = data;
  const { who } = state;

  const recNumbers = useMemo(() => {
    let count = 0;
    books.forEach((book) => {
      if (book.MemberId == who) {
        count++;
      }
    });
    return count;
  }, [who]);

  return (
    <>
      <div className={cx("attend")}>
        <div className={cx("num-title")}>미팅 참여 횟수 / 총 미팅 횟수</div>
        <div className={cx("num-box")}>
          <span>{attend[who]}</span>&nbsp;/&nbsp;
          <span>{totalBooks}</span>
        </div>
      </div>
      <div className={cx("rec")}>
        <div className={cx("num-title")}>책 추천 횟수 / 총 미팅 횟수</div>
        <div className={cx("num-box")}>
          <span>{recNumbers}</span>&nbsp;/&nbsp;
          <span>{totalBooks}</span>
        </div>
      </div>
    </>
  );
};
const Members = ({ data, loading, paramId }) => {
  const [state, dispatch] = useReducer(componentReducer, componentState);
  const { show } = state;

  useEffect(() => {
    if (paramId) {
      dispatch({ type: "OPEN", id: paramId });
    }
  }, [paramId]);

  return (
    <>
      {loading && <div className="loading">로딩중...</div>}
      {!loading && data && (
        <div className={cx("members")}>
          <Nav data={data} state={state} dispatch={dispatch} />
          <Books data={data} state={state} />
          <Btns state={state} />
          {show && <Numbers data={data} state={state} />}
        </div>
      )}
    </>
  );
};

export default Members;
