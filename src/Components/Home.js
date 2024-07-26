import React from 'react';
import styles from '../Css/Home.module.css';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Icons from '../Img/Icon';

const cx = classNames.bind(styles)

const Home = () => {
  return (
    <div className={cx('home')}>
      <div className={cx('sticky')}>
        <div className={cx('top')}>
          <div className={cx('top-left')}>
            <Link to="/" className={cx('left-title')}>Book Club</Link>
            <div className={cx('btns')}>
              <div className={cx('btn')}>LOG IN</div>
              <div className={cx('btn')}>SIGN UP</div>
            </div>
          </div>
          <div className={cx('top-right')}>
            <div className={cx('right-titles')}>
              <Link to="/books" className={cx('right-title')}>Books.</Link>
              <Link to="/books"  className={cx('right-title', 'italic')}>Books.</Link>
            </div>
            <div className={cx('top-right-bot')}>
              <Link to="/books" className={cx('arrow')}>
                <img className={cx('img')} src={Icons.arrow.rightBlack} alt="arrow"/>
              </Link>
              <div className={cx('number-text')}>
                <div className={cx('numbers')}>
                  <div>1</div>
                  <div>/</div>
                  <div>5</div>
                </div>
                <div className={cx('scroll')}>Scroll</div>
              </div>
            </div>
          </div>
        </div>
        <div className={cx('bot')}>
          <div className={cx('bot-left')}></div>
          <div className={cx('bot-right')}>
            <div className={cx('name')}>Seo Hanna</div>
            <div className={cx('name')}>Kim Jung Gyeong</div>
            <div className={cx('name')}>Kang Yelim</div>
            <div className={cx('name')}>Kim Hyuna</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;