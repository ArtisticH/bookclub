const express = require('express');
const { DoneFolder, DoneList, Member } = require('../../models/models');
const { Op } = require('sequelize');
const { upload, none } = require('../tools/multer');
const { listOffset } = require('../tools/tools');

const router = express.Router();


router.get('/:memberid/', async (req, res) => {
  try {
    const MemberId = req.params.memberid;
    let results = await DoneFolder.findOne({
      where: { MemberId },
      attributes: ['count'],
    });
    const count = results.count;
    results = await DoneList.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }],
      limit: 15,
      attributes: ['id', 'title', 'author', 'img'],
    });
    const donelists = results.map(item => {
      return {
        id: item.id,
        title: item.title,
        author: item.author,
        img: item.img,
      }
    });
    // 닉네임
    const member = await Member.findOne({
      where: { id: MemberId },
      attributes: ['id', 'nick'],
    });
    res.json({
      donelists,
      count,
      member,
      // title: '읽은 것들',
      // img: 'donelist',
    });  

  } catch(err) {
    console.error(err);
  }
});


module.exports = router;