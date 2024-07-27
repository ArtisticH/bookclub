const express = require('express');
const router = express.Router();
const { Book } = require('../../models/models');

router.get('/', async (req, res) => {
  const books = await Book.findAll({
    attributes: ['id', 'title', 'author'],
  });
  res.json(books);
});


module.exports = router;