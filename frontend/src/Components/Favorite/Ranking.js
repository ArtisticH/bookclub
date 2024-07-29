import React from "react";
import styles from "../../Css/Favorite/Ranking.module.css"
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const List = ({ list, index }) => {
  return (
    <div className={cx("list")}>
      <div className={cx("img-box")}>
        <img
          className={cx("img")}
          src={`/img/${list.modelName}/${list.main}.jpeg`}
          alt="img"
        />
      </div>
      <div className={cx("info")}>
        <div className={cx("info-top")}>
          <div className={cx("rank")}>{index + 1}</div>
          <div>
            <div className={cx("main")}>{list.main}</div>
            <div className={cx("sub")}>{list.sub}</div>
          </div>
        </div>
        <div className={cx("info-bottom")}>
          <div className={cx("count-box")}>
            <div className={cx("victory")}>승률</div>
            <div className={cx("victory-num")}>{list.victoryRate}%</div>
          </div>
          <div className={cx("count-box")}>
            <div className={cx("winning")}>우승비율</div>
            <div className={cx("winning-num")}>{list.winningRate}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Term = () => {
  return (
    <div className={cx("terms")}>
      <div className={cx("term-box")}>
        <div className={cx("term-text")}>승률:</div>
        <div className={cx("term-exp")}>승리 횟수 / 전체 1 : 1 대결수</div>
      </div>
      <div className={cx("term-box")}>
        <div className={cx("term-text")}>우승비율:</div>
        <div className={cx("term-exp")}>최종 우승 횟수 / 전체 게임 수</div>
      </div>
    </div>
  );
};
const Ranking = ({ loading, result }) => {
  return (
    <>
      {loading && <div className={cx("loading")}>로딩중...</div>}
      {!loading && result && (
        <>
          <div className={cx("ranking")}>
            <img
              className={cx("background")}
              src="/img/favorite/background.jpeg"
              alt="background"
            />
            <div className={cx("nav")}>
              <div>
                <div className={cx("title")}>Ranking</div>
                <div className={cx("detail")}>{result.title}</div>
              </div>
              <div className={cx("links")}>
                <Link to="/favorite" className={cx("link")}>
                  BACK
                </Link>
                <Link to="/" className={cx("link")}>
                  HOME
                </Link>
              </div>
            </div>
            <div className={cx("grid")}>
              {result.lists.map((list, index) => (
                <List key={list.main} list={list} index={index}></List>
              ))}
            </div>
            <Term />
          </div>
        </>
      )}
    </>
  );
};

export default Ranking;
