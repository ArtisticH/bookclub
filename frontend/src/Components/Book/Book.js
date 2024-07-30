import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import styles from "../../Css/Book/Book.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import axios from "axios";
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
              <img className="img" src="/img/icon/left-white-arrow.png" />
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
          <img className="img" src={book.img} alt="book-img" />
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

const Right = ({ data, state, dispatch, updateLike }) => {
  const { totalReview, reviews, user } = data;
  const { last, pageArr } = state;

  return (
    <div className={cx("right")}>
      <RightNav user={user} dispatch={dispatch} totalReview={totalReview} />
      {totalReview === 0 ? (
        <Empty />
      ) : (
        <>
          <Container reviews={reviews} user={user} updateLike={updateLike} />
          <Pagenation
            totalReview={totalReview}
            last={last}
            pageArr={pageArr}
            dispatch={dispatch}
          />
        </>
      )}
    </div>
  );
};

const RightNav = ({ user, dispatch, totalReview }) => {
  const Click = useCallback(() => {
    if (!user) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
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
    <div className={cx("empty-area")}>
      <div className={cx("empty-text")}>리뷰를 작성해주세요.</div>
    </div>
  );
};

const Container = ({ reviews, user, updateLike }) => {
  return (
    <div>
      {reviews.map((review) => (
        <Review
          key={review.id}
          review={review}
          user={user}
          updateLike={updateLike}
        />
      ))}
    </div>
  );
};

const Review = ({ review, user, updateLike }) => {
  const Original = useRef(null);
  const Slice = useRef(null);
  const Arrow = useRef(null);
  const Heart = useRef(null);
  const [back, setBack] = useState(false);
  // 더보기 누르면 실제 원문 보여주고, 화살표 방향 바뀌는거
  const ClickMore = useCallback(() => {
    Original.current.hidden = !Original.current.hidden;
    Slice.current.hidden = !Slice.current.hidden;
    if (Slice.current.hidden) {
      Arrow.current.style.transform = "rotate(180deg)";
    } else {
      Arrow.current.style.transform = "";
    }
  }, []);

  const ClickEdit = useCallback(() => {}, []);

  const ClickDelete = useCallback(() => {}, []);

  const ClickHeart = useCallback(async () => {
    if (!user) {
      alert("로그인 후 이용해주세요");
      return;
    }
    const res = await axios.post(`/books/like`, {
      ReviewId: review.id,
      MemberId: user.id,
    });
    // 서버에서 보내온 클릭해도 되는지 안되는지 여부
    const { clickable, like } = res.data;
    if (clickable) {
      // 클릭이 처음일때 하트 위로 올라가는 효과
      setBack(true);
    } else {
      setBack(false); // 클릭 취소 효과
    }
    updateLike(review.id, like);
  }, []);

  return (
    <div className={cx("review")}>
      <div className={cx("review-title")}>{review.title}</div>
      <div className={cx("review-info")}>
        <div className={cx("review-stars")}>
          {review.stars.map((star, index) => (
            <div key={index} className={cx("review-star", star)}></div>
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
        {/* 로그인한 사람과 작성자가 같다면 수정/삭제 노출 */}
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
        </>
      ) : (
        <>
          <div className={cx("review-text")} ref={Slice}>
            {review.text.slice}...
          </div>
          <div className={cx("review-text")} ref={Original} hidden>
            {review.text.original}
          </div>
        </>
      )}
      <div className={cx("review-btn")}>
        {review.overText && (
          <div className={cx("more")} onClick={ClickMore}>
            <div className={cx("more-text")}>더보기</div>
            <img
              ref={Arrow}
              className={cx("more-arrow")}
              src="/img/icon/down-arrow.png"
              alt="arrow"
            />
          </div>
        )}
        <div></div>
        <div className={cx("heart")} onClick={ClickHeart}>
          <div className={cx("heart-img-box")}>
            <img
              ref={Heart}
              className={cx("heart-img", { back })}
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

const Pagenation = ({ last }) => {
  const Input = useCallback((e) => {
    console.log('Input', e.target.value)
  }, []);

  const Change = useCallback((e) => {
    console.log('Change', e.target.value)
  }, []);

  return (
    <div className={cx("pagenation")}>
      <div className={cx("page-btn")}>&lt;&lt;</div>
      <div className={cx("page-btn")}>&lt;</div>
      <input
        onInput={Input}
        onChange={Change}
        type="text"
        name="page"
        className={cx("page-input")}
        defaultValue="1"
      />
      <div className={cx("page-last")}>/&nbsp;&nbsp;{last}</div>
      <div className={cx("page-move")}>이동</div>
      <div className={cx("page-btn")}>&gt;</div>
      <div className={cx("page-btn")}>&gt;&gt;</div>
    </div>
  );
};

const Form = ({
  data,
  state,
  dispatch,
  updateStar,
  updateTotalReview,
  updateReviews,
}) => {
  // 창 닫기
  const Cancel = useCallback(() => {
    dispatch({ type: "CANCEL_FORM" });
    dispatch({ type: "RESET_STAR" });
  }, []);
  const { book, user } = data;
  const BookId = book.id;
  const { star } = state;
  const Stars = useRef(null);
  const Length = useRef(null);
  // 클릭한 곳까지 별점 채우기
  const ClickStar = useCallback((e) => {
    const target = e.target;
    const number = target.dataset.star;
    if (!number) return;
    [...Stars.current.children].forEach((star, index) => {
      if (index <= +number) {
        star.style.opacity = "1";
      } else {
        star.style.opacity = "";
      }
    });
    // 현재 클릭한 별 갯수 상태에 저장
    dispatch({ type: "FORM_STAR", star: +number + 1 });
  }, []);
  // 입력할때 글자수 표기, 3000자 이내로 입력하게끔
  const Count = useCallback((e) => {
    if (e.target.value.length > 3000) {
      alert(`3000자 이내로 입력해주세요.`);
      e.target.value = e.target.value.slice(0, 3000);
    }
    Length.current.textContent = e.target.value.length;
  }, []);
  // 서버에 제출
  const Submit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!user) {
        alert("로그인 후 이용 가능합니다.");
        // 폼을 다 채우지 못했거나, 폼을 작성중 취소하면 항상
        // 별점을 0으로 리셋해야 작성시마다 체크가 가능하다.
        dispatch({ type: "RESET_STAR" });
        return;
      }
      const title = e.target.title.value;
      const text = e.target.text.value;
      const overText = text.length > 200 ? true : false;
      if (star === 0 || title.length === 0 || text.length === 0) {
        alert("빈칸을 모두 채워주세요.");
        return;
      }
      const res = await axios.post("/books", {
        title,
        text,
        overText,
        stars: star, // 상태에 저장한 별점
        BookId,
        MemberId: user.id,
      });
      const { starArr, starNum, reviews } = res.data;
      Cancel();
      updateStar(starArr, starNum); // 별 상태 업데이트
      updateTotalReview(); // 리뷰 하나 추가
      updateReviews(reviews); // 리뷰 최신거 포함 5개로 업데이트
    },
    [star, user]
  );

  return (
    <form className={cx("form")} onSubmit={Submit}>
      <div className={cx("form-nav")}>
        <div className={cx("form-title")}>Review</div>
        <div className={cx("cancel")} onClick={Cancel}>
          <div className={cx("cancel-left")}></div>
          <div className={cx("cancel-right")}></div>
        </div>
      </div>
      <div className={cx("form-book")}>
        <div>
          <img className={cx("img")} src={book.img} alt="book" />
        </div>
        <div className={cx("form-info")}>
          <div className={cx("form-book-title")}>{book.title}</div>
          <div className={cx("form-author")}>{book.author}</div>
          <div className={cx("form-stars")} onClick={ClickStar} ref={Stars}>
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
          <span className={cx("current-length")} ref={Length}>
            0
          </span>
          &nbsp;/&nbsp;
          <span>3000</span>
        </div>
        <textarea
          name="text"
          className={cx("textarea")}
          cols="30"
          rows="10"
          placeholder="내용을 3000자 이내로 입력해주세요*"
          onInput={Count}
        ></textarea>
        <input className={cx("form-submit")} type="submit" value="등록" />
      </div>
    </form>
  );
};

const Book = ({
  loading,
  data,
  updateStar,
  updateTotalReview,
  updateReviews,
  updateLike,
}) => {
  const [state, dispatch] = useReducer(componentReducer, componentState);
  const { form } = state;

  useEffect(() => {
    if (data) {
      const { totalReview } = data;
      dispatch({ type: "LAST", totalReview });
    }
  }, [data]);
  return (
    <>
      {loading && <div className="loading">로딩중...</div>}
      {!loading && data && (
        <>
          <div className={cx("book")}>
            <Left data={data} />
            <Right
              data={data}
              state={state}
              dispatch={dispatch}
              updateLike={updateLike}
            />
          </div>
          {form && (
            <Form
              data={data}
              state={state}
              dispatch={dispatch}
              updateStar={updateStar}
              updateTotalReview={updateTotalReview}
              updateReviews={updateReviews}
            />
          )}
        </>
      )}
    </>
  );
};

export default Book;
