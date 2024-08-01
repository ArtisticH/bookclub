import React from "react";
import styles from "../../Css/Open/Open.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const Open = () => {
  return (
    <div className={cx("open")}>
      <img src="/img/open/open-text.png" className={cx("text-img")} />
      <img src="/img/open/open-deco.png" className={cx("deco-img")} />
      <Link to="/" className={cx("home", "nav")}>
        BOOKCLUB
      </Link>
      <div className={cx("title", "nav")}>
        OPEN API를 통해 다양한 책을 접해보세요.
      </div>
      <div className={cx("main")}>
        <Link to="/open/nat" className={cx("box")}>
          <div className={cx("box-title")}>
            2023 ∙ 2024
            <br />
            국립중앙도서관 사서추천도서
          </div>
          <div className={cx("img-box")}>
            <img
              src="/img/open/national-list.png"
              alt="national-list"
              className="img"
            />
          </div>
        </Link>
        <Link to="/open/search" className={cx("box")}>
          <div className={cx("box-title")}>국립중앙도서관 소장자료조회</div>
          <div className={cx("img-box")}>
            <img
              src="/img/open/national-search.png"
              alt="national-search"
              className="img"
            />
          </div>
        </Link>
        <Link to="/open/faker" className={cx("box")}>
          <div className={cx("box-title")}>페이커 독서목록</div>
          <div className={cx("img-box")}>
            <img src="/img/open/faker.png" alt="faker" className="img" />
          </div>
        </Link>
        <Link to="/open/aladin" className={cx("box")}>
          <div className={cx("box-title")}>
            알라딘 베스트셀러 리스트
            <br />
            소설/시/희곡
          </div>
          <div className={cx("img-box")}>
            <img src="/img/open/aladin.png" alt="aladin" className="img" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Open;
