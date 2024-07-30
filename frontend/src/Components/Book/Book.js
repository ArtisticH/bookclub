import React, { useCallback, useReducer } from "react";
import styles from "../../Css/Book/Book.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { componentState, componentReducer } from "../../Modules/Book/Book";

const cx = classNames.bind(styles);

const Left = ({ data }) => {
  const { book, totalBook, starArr, starNum, member } = data;
  return (
    <div className={cx("left")}>
      <LeftNav book={book} totalBook={totalBook} />
      <LeftBook
        book={book}
        starArr={starArr}
        starNum={starNum}
        member={member}
      />
    </div>
  );
};

const LeftNav = ({ book, totalBook }) => {
  return (
    <>
      {book && (
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
              <span>{book.id}</span>&nbsp;/&nbsp;<span>{totalBook}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const LeftBook = ({ book, starArr, starNum, member }) => {
  return (
    <div className={cx("left-main")}>
      <div className={cx("left-grid")}>
        <div className={cx("book-img")}>
          <img className={cx("img")} src={book.img} alt="book-img" />
        </div>
        <div className={cx("book-info")}>
          <div className={cx("book-title")}>{book.title}</div>
          <div>
            <div className={cx("author")}>{book.author}</div>
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
              <span className={cx("date")}>{book.meetingDate}</span>
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

const Right = ({ data, dispatch }) => {
  const { totalReview, reviews, user } = data;

  return (
    <div className={cx("right")}>
      <RightNav dispatch={dispatch} totalReview={totalReview} />
      <Empty />
      <Container reviews={reviews} user={user} />
      <Pagenation />
    </div>
  );
};

const RightNav = ({ dispatch, totalReview }) => {
  const Click = useCallback(() => {
    dispatch({ type: "SHOW_FORM" });
  }, []);
  return (
    <div className={cx("right-nav")}>
      <div className={cx("review-nav-title")}>
        <span>Review&nbsp;</span>(<span>{totalReview}</span>)
      </div>
      <div className={cx("write-btn")} onClick={Click}>
        리뷰 작성
      </div>
    </div>
  );
};

const Empty = () => {
  return (
    <div className={cx("empty")}>
      <div className={cx("empty-text")}>리뷰를 작성해주세요.</div>
    </div>
  );
};

const Container = ({ reviews, user }) => {
  return (
    <div>
      {reviews.map((review) => (
        <Review key={review.id} review={review} user={user} />
      ))}
    </div>
  );
};

const Review = ({ review, user }) => {
  return (
    <div className={cx("review")}>
      <div className={cx("review-title")}>{review.title}</div>
      <div className={cx("review-info")}>
        <div className={cx("review-stars")}>
          {review.stars.map((star, index) => (
            <div key={index} className={cx("review-stars", star)}></div>
          ))}
        </div>
        <div className={cx("line")}></div>
        <div className={cx("review-type")}>{review.type}</div>
        <div className={cx("line")}></div>
        <Link
          to={`/members?member=${review.MemberId}`}
          className={cx("review-nick", "review-common")}
        >
          {review.nick}
        </Link>
        <div className={cx("line")}></div>
        <div className={cx("review-common")}>{review.createdAt}</div>
        <div className={cx("line")}></div>
        <div className={cx("review-common")}>{review.updatedAt}</div>
        {user && user.id == review.MemberId && (
          <div className={cx("review-user")}>
            <div className={cx("line")}></div>
            <div className={cx("review-edit", "review-common")}>수정</div>
            <div className={cx("line")}></div>
            <div className={cx("review-delete", "review-common")}>삭제</div>
          </div>
        )}
      </div>
      {!review.text.slice ? (
        <>
          <div className={cx("review-text")}>{review.text.original}</div>
          <div className={cx("review-text")} hidden></div>
        </>
      ) : (
        <>
          <div className={cx("review-text")}>{review.text.slice}...</div>
          <div className={cx("review-text")} hidden>
            {review.text.original}
          </div>
        </>
      )}
      <div className={cx("review-btn")}>
        {review.overText && (
          <div className={cx("more")}>
            <div className={cx("more-text")}>더보기</div>
            <img
              className={cx("more-arrow")}
              src="/img/icon/down-arrow.png"
              alt="arrow"
            />
          </div>
        )}
        <div></div>
        <div className={cx("heart")}>
          <div className={cx("heart-img-box")}>
            <img
              className={cx("heart-img")}
              src="/img/icon/heart.png"
              alt="heart"
            />
            <img
              className={cx("heart-img")}
              src="/img/icon/heart.png"
              alt="heart"
            />
          </div>
          <div className={cx("heart-total")}>{review.like}</div>
        </div>
      </div>
    </div>
  );
};

const Pagenation = () => {
  return (
    <div className={cx("pagenation")}>
      <div className={cx("page-btn")}>
        &lt;&lt;
      </div>
      <div className={cx("page-btn")}>
        &lt;
      </div>
      <div className={cx("page-numbers")}>
        <div className={cx("page-number")}></div>
        <div className={cx("page-number")}></div>
        <div className={cx("page-number")}></div>
        <div className={cx("page-number")}></div>
        <div className={cx("page-number")}></div>
      </div>
      <div className={cx("page-btn")}>
        &gt;
      </div>
      <div className={cx("page-btn")}>
        &gt;&gt;
      </div>
    </div>
  );
};

const Form = ({ book, dispatch }) => {
  const Cancel = useCallback(() => {
    dispatch({ type: "CANCEL_FORM" });
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

const Book = ({ loading, data }) => {
  const [state, dispatch] = useReducer(componentReducer, componentState);
  const { form } = state;
  return (
    <>
      {loading && <div className={cx("loading")}>로딩중...</div>}
      {!loading && data && (
        <>
          <div className={cx("book")}>
            <Left data={data} />
            <Right data={data} dispatch={dispatch} />
          </div>
          {form && <Form data={data} dispatch={dispatch} />}
        </>
      )}
    </>
  );
};

export default Book;
