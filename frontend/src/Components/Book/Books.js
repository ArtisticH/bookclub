import React, { useEffect } from "react";
import styles from "../../Css/Book/Books.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const Left = ({ length }) => {
  return (
    <div className={cx("left")}>
      <div className={cx("title-count")}>
        <div className={cx("title")}>Books</div>
        <div className={cx("count")}>Total {length} books.</div>
      </div>
      <Link to="/" className={cx("arrow")}>
        <img
          className="img"
          src="/img/icon/left-white-arrow.png"
          alt="arrow"
        />
      </Link>
    </div>
  );
};

const Right = ({ books }) => {
  return (
    <div className={cx("right")}>
      {/* 책에 대한 정보를 서버에서 가져온 다음 map으로 표기 */}
      {books.map((book) => (
        <Book key={book.id} book={book} />
      ))}
    </div>
  );
};

const Book = ({ book }) => {
  return (
    <Link to={`/books/${book.id}`} className={cx("book")}>
      <div className={cx("book-title")}>{book.title}</div>
      <div className={cx("author")}>{book.author}</div>
      <div className={cx("blank")}></div>
    </Link>
  );
};

const Books = ({ books, loading }) => {
  useEffect(() => {
    document.body.style.height = "100vh";
  }, []);
  return (
    <>
      {loading && <div className="loading">로딩중...</div>}
      {!loading && books && (
        <div className={cx("books")}>
          <Left length={books.length} />
          <Right books={books} />
        </div>
      )}
    </>
  );
};

export default Books;
