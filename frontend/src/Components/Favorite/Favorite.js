import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../Css/Favorite/Favorite.module.css";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Category = ({ category, showModal, whichCategory }) => {
  const Click = useCallback(() => {
    showModal();
    whichCategory(category.id);
  }, []);

  return (
    <div className={cx("category", category.modelName)} onClick={Click}>
      <div className={cx("category-img-box")}>
        <img className={cx("category-img")} src={category.img} alt="category" />
      </div>
      <div className={cx("info")}>
        <div className={cx("info-top")}>
          <div
            className={cx("info-title", { basic: category.types === "basic" })}
          >
            {category.title}
          </div>
          <div className={cx("info-exp")}>{category.explanation}</div>
        </div>
        <div className={cx("info-bottom")}>
          {category.types === "music" && (
            <div>
              <img
                className={cx("music-img")}
                src="/img/icon/music.png"
                alt="music"
              />
            </div>
          )}
          <div></div>
          <div className={cx("round")}>{category.round}</div>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ closeModal, categoryId }) => {
  const navigate = useNavigate();
  const rounds = ["32", "16", "8", "4"];
  const Form = useRef(this);

  const chooseRound = useCallback((e) => {
    e.preventDefault();
    const round = e.target.round.value;
    const radios = Form.current.querySelectorAll('[type="radio"]');
    let selected = false;
    for (let radio of radios) {
      if (radio.checked) {
        selected = true;
      }
    }
    if (!selected) {
      alert("라운드를 선택해주세요.");
      return;
    }
    closeModal();
    navigate(`/favorite/${categoryId}/${round}`);
  }, []);

  useEffect(() => {
    Form.current.addEventListener("submit", chooseRound);
  }, []);

  return (
    <div className={cx("modal")}>
      <div className={cx("nav")}>
        <div className={cx("modal-title")}>라운드 선택</div>
        <div className={cx("cancel")} onClick={closeModal}>
          <div className={cx("left")}></div>
          <div className={cx("right")}></div>
        </div>
      </div>
      <form className={cx("form")} ref={Form}>
        <div className={cx("flex")}>
          {rounds.map((round) => (
            <Round key={round} round={round} />
          ))}
        </div>
        <input className={cx("submit")} type="submit" value="시작" />
      </form>
    </div>
  );
};

const Round = ({ round }) => {
  return (
    <div className={cx("round-box")}>
      <input
        id={round}
        className={cx("input")}
        type="radio"
        name="round"
        value={round}
      />
      <label htmlFor={round}>{round}</label>
    </div>
  );
};

const Favorite = ({ categories, loading }) => {
  const [categoryId, setCategoryId] = useState(null);
  const [modal, setModal] = useState(false);

  const showModal = useCallback((e) => {
    setModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setModal(false);
  }, []);

  const whichCategory = useCallback((id) => {
    setCategoryId(id);
  }, []);

  useEffect(() => {
    document.body.style.height = "100vh";
  }, []);

  return (
    <>
      {loading && <div className={cx("loading")}>로딩중...</div>}
      {!loading && categories && (
        <>
          <div className={cx("favorite")}>
            <img
              className={cx("background")}
              src="/img/favorite/background.jpeg"
              alt="background"
            />
            <div className={cx("title")}>Favorite</div>
            <Link className={cx("home")} to="/">
              HOME
            </Link>
            <div className={cx("grid")}>
              {categories.map((category) => (
                <Category
                  key={category.id}
                  category={category}
                  showModal={showModal}
                  whichCategory={whichCategory}
                />
              ))}
            </div>
          </div>
          {modal && <Modal closeModal={closeModal} categoryId={categoryId} />}
        </>
      )}
    </>
  );
};

export default Favorite;
