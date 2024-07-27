import React, { useEffect, useState } from "react";
import styles from "../Css/Books.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import axios from 'axios';

const cx = classNames.bind(styles);

const Left = ({ length }) => {
  return (
    <div className={cx("left")}>
      <div className={cx("title-count")}>
        <div className={cx("title")}>Books</div>
        <div className={cx("count")}>Total {length} books.</div>
      </div>
      <Link to="/" className={cx("arrow")}>
        <img className={cx("img")} src="/img/icon/right-black-arrow.png" alt="arrow" />
      </Link>
    </div>
  );
};

const Right = ({ books }) => {
  return (
    <div className={cx("right")}>
      {/* 책에 대한 정보를 서버에서 가져온 다음 map으로 표기 */}
      {books.map(book => 
        <Book book={book} />
      )}
    </div>
  );
};

const Book = ({ book }) => {
  return (
    <Link to={`books/${book.id}`} className={cx("book")}>
      <div className={cx("book-title")}>{book.title}</div>
      <div className={cx("author")}>{book.author}</div>
      <div className={cx("blank")}></div>
    </Link>
  );
};

const Books = () => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    document.body.style.height = '100vh';
    const getBooks = async() => {
      try {
        const res = await axios.get('/books');
        setBooks(res.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    getBooks()
  }, []);
  return (
    <div className={cx("books")}>
      <Left length={books.length}/>
      <Right books={books}/>
    </div>
  );
};

export default Books;
