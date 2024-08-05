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
  return (
    <>
      {data && (
        <div className={cx("left")}>
          <LeftNav data={data} />
          <LeftBook data={data} />
        </div>
      )}
    </>
  );
};

const LeftNav = ({ data }) => {
  const { book, totalBook } = data;
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

const LeftBook = ({ data }) => {
  const { book, starArr, starNum, member } = data;
  return (
    <>
      {book && (
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
                    to={`/members?member=${member && member.id}`}
                    className={cx("recommender")}
                  >
                    {member && member.nick}
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
                      <div className={cx("star-shape", `form-${star}`)}></div>
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
      )}
    </>
  );
};

const Right = ({ data, state, dispatch, ContainerDispatch }) => {
  const { totalReview } = data;
  return (
    <div className={cx("right")}>
      <RightNav data={data} dispatch={dispatch} />
      {totalReview === 0 ? (
        <Empty />
      ) : (
        <>
          <Container
            data={data}
            state={state}
            ContainerDispatch={ContainerDispatch}
            dispatch={dispatch}
          />
          <Pagenation
            data={data}
            state={state}
            ContainerDispatch={ContainerDispatch}
            dispatch={dispatch}
          />
        </>
      )}
    </div>
  );
};

const RightNav = ({ data, dispatch }) => {
  const { totalReview, user } = data;
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

const Container = ({
  data,
  state,
  ContainerDispatch,
  dispatch,
}) => {
  const { reviews } = data;
  return (
    <div>
      {reviews.map((review) => (
        <Review
          key={review.id}
          data={data}
          state={state}
          dispatch={dispatch}
          ContainerDispatch={ContainerDispatch}
          review={review}
        />
      ))}
    </div>
  );
};

const Review = ({
  data, 
  state, 
  dispatch, 
  ContainerDispatch,
  review,
}) => {
  const { page, last } = state;
  const { reviews, totalReview, user, book } = data;
  const BookId = book.id;
  const {
    updateLike,
    updateReviews,
    updateStar,
    deleteReview
  } = ContainerDispatch;
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

  const ClickEdit = useCallback(() => {
    dispatch({ type: "CLICK_EDIT", review });
  }, []);

  const ClickDelete = useCallback(async () => {
    let res;
    if (page == last && reviews.length === 1 && totalReview !== 1) {
      // 마지막 페이지에서 남은 하나 삭제했을때
      res = await axios.delete(`${process.env.REACT_APP_WAITLIST_API_URL}/books/${review.id}/${BookId}/${page - 1}`,
      {withCredentials: true});
      dispatch({ type: "PAGE", payload: page - 1 });
    } else {
      res = await axios.delete(`${process.env.REACT_APP_WAITLIST_API_URL}/books/${review.id}/${BookId}/${page}`,
      {withCredentials: true});
    }
    const { starArr, starNum, newReviews } = res.data;
    updateStar(starArr, starNum);
    updateReviews(newReviews);
    deleteReview();
  }, [page, last, reviews]);
  // 좋아요 클릭
  const ClickHeart = useCallback(async () => {
    if (!user) {
      alert("로그인 후 이용해주세요");
      return;
    }
    const res = await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/books/like`, {
      ReviewId: review.id,
      MemberId: user.id,
    },
    {withCredentials: true});
    // 서버에서 보내온 클릭해도 되는지 안되는지 여부
    const { clickable, like } = res.data;
    if (clickable) {
      // 클릭이 처음일때 하트 위로 올라가는 효과
      setBack(true);
    } else {
      setBack(false); // 클릭 취소 효과
    }
    // 서버에서 내려온 reviews에서 현재 글을 찾아 like만 수정
    updateLike(review.id, like);
  }, []);

  return (
    <div className={cx("review")}>
      <div className={cx("review-title")}>{review.title}</div>
      <div className={cx("review-info")}>
        <div className={cx("review-stars")}>
          {review.stars.map((star, index) => (
            <div
              key={index}
              className={cx("review-star", `review-${star}`)}
            ></div>
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
            <div
              className={cx("review-edit", "review-common")}
              onClick={ClickEdit}
            >
              수정
            </div>
            <div className={cx("line")}></div>
            <div
              className={cx("review-delete", "review-common")}
              onClick={ClickDelete}
            >
              삭제
            </div>
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

const Pagenation = ({ data, state, ContainerDispatch, dispatch }) => {
  const { last, page } = state;
  const { updateReviews } = ContainerDispatch;
  const { book } = data;
  const BookId = book.id;

  const Change = useCallback((e) => {
    dispatch({ type: "PAGE", payload: e.target.value });
  }, []);

  const Move = useCallback(async () => {
    if(page > last) {
      alert('존재하지 않는 페이지입니다.');
      return;
    }
    const res = await axios.get(`${process.env.REACT_APP_WAITLIST_API_URL}/books/page/${BookId}/${page}`,
    {withCredentials: true});
    const reviews = res.data.reviews;
    updateReviews(reviews);
  }, [page, last]);

  const Last = useCallback(async () => {
    if(page == last) {
      alert('마지막 페이지입니다.');
      return;
    }
    const res = await axios.get(`${process.env.REACT_APP_WAITLIST_API_URL}/books/page/${BookId}/${last}`,
    {withCredentials: true});
    const reviews = res.data.reviews;
    updateReviews(reviews);
    dispatch({ type: "PAGE", payload: last });
  }, [last, page]);

  const First = useCallback(async () => {
    if(page == 1) {
      alert('첫 페이지입니다.');
      return;
    }
    const res = await axios.get(`${process.env.REACT_APP_WAITLIST_API_URL}/books/page/${BookId}/${1}`,
    {withCredentials: true});
    const reviews = res.data.reviews;
    updateReviews(reviews);
    dispatch({ type: "PAGE", payload: 1 });
  }, [page]);

  const Next = useCallback(async () => {
    if(page == last) {
      alert('마지막 페이지입니다.');
      return;
    }
    const target = page != last ? page + 1 : last;
    const res = await axios.get(`${process.env.REACT_APP_WAITLIST_API_URL}/books/page/${BookId}/${target}`,
    {withCredentials: true});
    const reviews = res.data.reviews;
    updateReviews(reviews);
    dispatch({ type: "PAGE", payload: target });
  }, [page, last]);

  const Before = useCallback(async () => {
    if(page == 1) {
      alert('첫 페이지입니다.');
      return;
    }
    const target = page != 1 ? page - 1 : 1;
    const res = await axios.get(`${process.env.REACT_APP_WAITLIST_API_URL}/books/page/${BookId}/${target}`,
    {withCredentials: true});
    const reviews = res.data.reviews;
    updateReviews(reviews);
    dispatch({ type: "PAGE", payload: target });
  }, [page]);

  return (
    <div className={cx("pagenation")}>
      <div className={cx("page-btn")} onClick={First}>
        &lt;&lt;
      </div>
      <div className={cx("page-btn")} onClick={Before}>
        &lt;
      </div>
      <input
        onChange={Change}
        type="text"
        name="page"
        className={cx("page-input")}
        value={page}
      />
      <div className={cx("page-last")}>/&nbsp;&nbsp;{last}</div>
      <div className={cx("page-move")} onClick={Move}>
        이동
      </div>
      <div className={cx("page-btn")} onClick={Next}>
        &gt;
      </div>
      <div className={cx("page-btn")} onClick={Last}>
        &gt;&gt;
      </div>
    </div>
  );
};

const Form = ({
  data,
  state,
  dispatch,
  ContainerDispatch,
}) => {
  const { book, user } = data;
  const { star, eidtClicked, editReview } = state;
  const { updateStar, addReview, updateReviews, editReviewDispatch } = ContainerDispatch;
  const BookId = book.id;
  const Stars = useRef(null);
  const Length = useRef(null);
  const Textarea = useRef(null);
  const Title = useRef(null);
  useEffect(() => {
    if (eidtClicked) {
      // 수정을 클릭해 폼을 연거라면 안의 내용을 채워라.
      Title.current.value = editReview.title;
      Textarea.current.value = editReview.text.original;
      Length.textContent = editReview.text.original.value;
      const stars = editReview.stars;
      let STAR = 0;
      [...Stars.current.children].forEach((star, index) => {
        if (stars[index] === "full") {
          star.style.opacity = "1";
          STAR++;
        } else {
          star.style.opacity = "";
        }
      });
      // 현재 설정된 갯수를 폼 제출시 갯수로 미리 설정하기
      dispatch({ type: "STAR", star: STAR });
    }
  }, [eidtClicked]);
  // 창 닫기
  const Cancel = useCallback(() => {
    if (eidtClicked) {
      dispatch({ type: "CANCEL_FORM" });
    } else {
      dispatch({ type: "CANCEL_EDIT" });
    }
    dispatch({ type: "RESET_STAR" }); // 0으로 리셋
  }, [eidtClicked]);
  // 클릭한 곳까지 별점 채우기
  const FillStar = useCallback((number) => {
    [...Stars.current.children].forEach((star, index) => {
      if (index <= +number) {
        star.style.opacity = "1";
      } else {
        star.style.opacity = "";
      }
    });
  });
  const ClickStar = useCallback((e) => {
    const target = e.target;
    const number = target.dataset.star;
    if (!number) return;
    // 별점 색상 채우기
    FillStar(number);
    // 현재 클릭한 별 갯수 컴포넌트 상태에 저장
    dispatch({ type: "STAR", star: +number + 1 });
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
      const res = await axios.post(`${process.env.REACT_APP_WAITLIST_API_URL}/books`,
      {
        title,
        text,
        overText,
        stars: star, // 상태에 저장한 별점
        BookId,
        MemberId: user.id,
      },
      {withCredentials: true});
      const { starArr, starNum, reviews } = res.data;
      Cancel();
      // 아래 내용은 서버에서 온 데이터를 다루는거라 따로 컨테이너에서 받아야 한다.
      updateStar(starArr, starNum); // 별 상태 업데이트
      addReview(); // 리뷰 하나 추가
      // 어차피 등록은 다 1페이지로 와
      updateReviews(reviews); // 리뷰 최신거 포함 5개로 업데이트
    },
    [star, user]
  );

  const EditSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const title = e.target.title.value;
      const text = e.target.text.value;
      const overText = text.length > 200 ? true : false;
      const res = await axios.patch(`${process.env.REACT_APP_WAITLIST_API_URL}/books`,
      {
        id: editReview.id, // 리뷰아이디
        title,
        text,
        overText,
        stars: star,
        BookId,
      },
      {withCredentials: true});
      const { review, starArr, starNum } = res.data;
      updateStar(starArr, starNum);
      // 현재 리뷰 5개에서 수정한 리뷰만 바꿔치기
      editReviewDispatch(review);
      Cancel();
    },
    [star]
  );

  return (
    <form className={cx("form")} onSubmit={eidtClicked ? EditSubmit : Submit}>
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
          ref={Title}
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
          ref={Textarea}
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

const Book = ({ loading, data, ContainerDispatch }) => {
  const [state, dispatch] = useReducer(componentReducer, componentState);
  const { form } = state;

  useEffect(() => {
    if (data) {
      const { totalReview } = data;
      // 총리뷰개수를 바탕으로 마지막 페이지를 계산
      // last 상태 변화
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
              ContainerDispatch={ContainerDispatch}
            />
          </div>
          {form && (
            <Form
              data={data}
              state={state}
              dispatch={dispatch}
              ContainerDispatch={ContainerDispatch}
            />
          )}
        </>
      )}
    </>
  );
};

export default Book;
