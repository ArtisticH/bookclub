import React, { useEffect } from "react";
import styles from "../Css/Fun.module.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const Left = () => {
  return (
    <div>
      <div className={cx("head")}></div>
      <div className={cx("middle")}>
        <div className={cx("left")}></div>
        <div className={cx("right")}>
          <Link to="/" className={cx("home")}>
            HOME
          </Link>
          <div className={cx("title")}>
            Enjoy
            <br />
            Fun
            <br />
            Projects
          </div>
        </div>
      </div>
      <div className={cx("bottom")}></div>
    </div>
  );
};

const Right = () => {
  return (
    <div>
      <div className={cx("head")}></div>
      <div className={cx("projects")}>
        <Link to="/favorite" className={cx("project")}>
          <div className={cx("project-title")}>
            01
            <br />
            Favorite
          </div>
          <div className={cx("project-exp")}>
            다양한 카테고리의
            <br />
            이상형 월드컵 즐기기
          </div>
        </Link>
        <Link to="/deco" className={cx("project")}>
          <div className={cx("project-title")}>
            02
            <br />
            Decorate Img
          </div>
          <div className={cx("project-exp")}>
            맘에 드는 구절을
            <br />
            나만의 이미지로 꾸미기
          </div>
        </Link>
        <Link to="/open" className={cx("project")}>
          <div className={cx("project-title")}>
            03
            <br />
            OPEN API
          </div>
          <div className={cx("project-exp")}>
            OPEN API를 통해 다양한 도서를 접하고
            <br />
            나의 WISHLIST에 저장하기
          </div>
        </Link>
      </div>
    </div>
  );
};

const Fun = () => {
  useEffect(() => {
    document.body.style.height = '100vh';
  }, []);
  return (
    <div className={cx("fun")}>
      <Left />
      <Right />
    </div>
  );
};

export default Fun;
