import React, { useCallback, useReducer } from "react";
import styles from "../../Css/Book/Book.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { componentState, componentReducer } from "../../Modules/Book/Book";

const cx = classNames.bind(styles);

const Left = ({ book }) => {
  const { book: thatBook, totalBook, starArr, starNum, member } = book;
  return (
    <div className={cx("left")}>
      <LeftNav thatBook={thatBook} totalBook={totalBook} />
      <LeftBook
        thatBook={thatBook}
        starArr={starArr}
        starNum={starNum}
        member={member}
      />
    </div>
  );
};

const LeftNav = ({ thatBook, totalBook }) => {
  return (
    <>
      {thatBook && (
        <>
          <div className={cx("links")}>
            <Link to="/books" style={{ width: "70px" }}>
              <img className={cx("img")} src="/img/icon/left-white-arrow.png" />
            </Link>
            <Link to="/" className={cx("home")}>
              HOME
            </Link>
          </div>
          <div className={cx("nav")}>
            <div className={cx("nav-text")}>Book</div>
            <div style={{ fontSize: "1.2rem" }}>
              <span>{thatBook.id}</span>&nbsp;/&nbsp;<span>{totalBook}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const LeftBook = ({ thatBook, starArr, starNum, member }) => {
  return (
    <div className={cx("left-main")}>
      <div className={cx("left-grid")}>
        <div className={cx("book-img")}>
          <img className={cx("img")} src={thatBook.img} alt="book-img" />
        </div>
        <div className={cx("book-info")}>
          <div className={cx("book-title")}>{thatBook.title}</div>
          <div>
            <div className={cx("author")}>{thatBook.author}</div>
            <div className={cx("recommender-box")}>
              <span>추천이:&nbsp;</span>
              <Link
                to={`/members?member=${member.id}`}
                className={cx("recommender")}
              >
                {member.nick}
              </Link>
            </div>
            <div className={cx("date-box")}>
              <span>모임 날짜:&nbsp;</span>
              <span className={cx("date")}>{thatBook.meetingDate}</span>
            </div>
          </div>
          <div className={cx("rate-box")}>
            <div className={cx("stars-shape")}>
              {starArr.map((star, index) => (
                <div key={index} className={cx("star-relative")}>
                  <div className={cx("star-shape", star)}></div>
                </div>
              ))}
            </div>
            <div className={cx("stars-number")}>
              <div className={cx("star-current")}>{starNum}</div>
              <div className={cx("star-total")}>&nbsp;/&nbsp;5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Right = ({ book, dispatch }) => {
  const { totalReview } = book;

  return (
    <div className={cx("right")}>
      <RightNav dispatch={dispatch} totalReview={totalReview}/>
    </div>
  );
};

const RightNav = ({ dispatch, totalReview }) => {
  const Click = useCallback(() => {
    dispatch({ type: 'SHOW_FORM' })
  }, []);
  return (
    <div className={cx("right-nav")}>
      <div className={cx("review-title")}>
        <span>Review&nbsp;</span>
        (<span>{totalReview}</span>)
      </div>
      <div className={cx("write-btn")} onClick={Click}>리뷰 작성</div>
    </div>
  );
};

const Form = ({ book, dispatch }) => {
  const Cancel = useCallback(() => {
    dispatch({ type: 'CANCEL_FORM' })
  }, []);
  const { book: thatBook } = book;
  return (
    <form className={cx("form")}>
      <div className={cx("form-nav")}>
        <div className={cx("form-title")}>Review</div>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <div className={cx("form-book")}>
        <div>
          <img className={cx("img")} src={thatBook.img} alt="book" />
        </div>
        <div className={cx("form-info")}>
          <div className={cx("form-book-title")}>{thatBook.title}</div>
          <div className={cx("form-author")}>{thatBook.author}</div>
          <div className={cx("form-stars")}>
            <div className={cx("form-star")} data-star="0"></div>
            <div className={cx("form-star")} data-star="1"></div>
            <div className={cx("form-star")} data-star="2"></div>
            <div className={cx("form-star")} data-star="3"></div>
            <div className={cx("form-star")} data-star="4"></div>
          </div>
        </div>
      </div>
      <div>
        <input
          type="text"
          name="title"
          className={cx("input-title")}
          placeholder="제목을 입력해주세요*"
          maxLength="30"
        />
        <div className={cx("textarea-length")}>
          <span className={cx("current-length")}>0</span>&nbsp;/&nbsp;
          <span>3000</span>
        </div>
        <textarea
          name="text"
          className={cx("textarea")}
          cols="30"
          rows="10"
          placeholder="내용을 3000자 이내로 입력해주세요*"
        ></textarea>
        <input className={cx("form-submit")} type="submit" value="등록" />
      </div>
    </form>
  );
};

const Book = ({ loading, book }) => {
  const [state, dispatch] = useReducer(componentReducer, componentState);
  const { form } = state;
  return (
    <>
      {loading && <div className={cx("loading")}>로딩중...</div>}
      {!loading && book && (
        <>
          <div className={cx("book")}>
            <Left book={book} />
            <Right book={book} dispatch={dispatch}/>
          </div>
          {form && <Form book={book} dispatch={dispatch}/>}
        </>
      )}
    </>
  );
};

export default Book;
