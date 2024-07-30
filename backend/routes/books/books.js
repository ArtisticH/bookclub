const express = require('express');
const router = express.Router();
const { Book, Member, Review } = require('../../models/models');
const { makeDate, makeStar, makeSum, makeText } = require('../tools/tools');

router.use((req, res, next) => {
  res.user = req.user;
  next();
});

router.get('/', async (req, res) => {
  const books = await Book.findAll({
    attributes: ['id', 'title', 'author'],
  });
  res.json(books);
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findOne({ where: { id }});
    const totalBook = await Book.count();
    const member = await Member.findOne({ 
      where: { id: book.MemberId },
      attributes: ['id', 'nick'],
    });
    // 해당 책 평점 다 긁어오기
    const stars = await Review.findAll({
      include: [{
        model: Book,
        where: { id },
      }],
      attributes: ['stars'],
    });
    // 이 책에 대한 총 리뷰 갯수
    const totalReview = stars.length;
    // 평균 값을 구하고 소숫점 한 자리수로 나타내기
    const sum = makeSum(stars);
    // 위의 소수점숫자를 0, 0.5단위로 내리고, 그걸 배열로 만들기
    // 만약 3.8이면 3.5로 만들고 [full, full, full, half, empty]처럼
    const { starArr, starNum } = makeStar(sum);
    // 그리고 최신 리뷰 5개를 보내
    const results = await Review.findAll({
      include: [{
        model: Book,
        where: { id },
      }, {
        model: Member,
        attributes: ['id', 'type', 'nick'],
      }],
      order: [['id', 'DESC']], 
      limit: 5,
    });
    const reviews = results.map(review => {
      return {
        id: review.id,
        title: review.title,
        text: makeText(review.overText, review.text),
        like: review.like,
        overText: review.overText,
        stars: makeStar(review.stars).starArr,
        createdAt: makeDate(review.createdAt),
        updatedAt: makeDate(review.updatedAt),
        MemberId: review.Member.id,
        type: review.Member.type,
        nick: review.Member.nick,
      }
    });
    res.json({
      book, // 이 책
      totalBook, // 지금까지 책 갯수
      member, // 이 책 추천한 사람
      starNum, // 이 책에 대한 총 평점 숫자
      starArr, // 이 책에 대한 총 평점 배열
      reviews, // 리뷰5개
      totalReview, // 총 리뷰갯수
      user: res.user,
    });  
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;

