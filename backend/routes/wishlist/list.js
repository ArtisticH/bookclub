const express = require('express');
const { Folder, List, DoneFolder, DoneList, Member } = require('../../models/models');
const { Op } = require('sequelize');
const { upload, none } = require('../tools/multer');
const { listOffset } = require('../tools/tools');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
// 처음에 내려보낼때 그냥 폴더인지 아니면 읽은 것들인지
router.get('/:done/:folderid/:memberid', async (req, res) => {
  try {
    const done = req.params.done;
    const MemberId = req.params.memberid;
    if(done === 'true') {
      // 카운트, 닉네임, 리스트, 페이지넘버
      let results = await DoneFolder.findOne({
        where: { MemberId },
        attributes: ['count'],
      });
      // 카운트
      const count = results.count;
      // 처음에 15개 보내, 리스트
      results = await DoneList.findAll({
        include: [{
          model: Member,
          where: { id: MemberId },
        }],
        limit: 15,
        attributes: ['id', 'title', 'author', 'img'],
      });
      const lists = results.map(item => {
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
      res.render('wishlist/list', {
        lists,
        count,
        member,
        isDone: true,
        title: '읽은 것들',
        img: 'donelist',
      });  
    } else if(done === 'false') {
      const FolderId = req.params.folderid;
      // 카운트, 타이틀, 닉네임, 리스트, 페이지넘버, 다른 폴더들
      // 카운트, 타이틀
      let results = await Folder.findOne({
        include: [{
          model: Member,
          where: { id: MemberId },
          attributes: ['id', 'nick']
        }],
        where: { id: FolderId },
        attributes: ['count', 'title'],
      });
      const member = results.Member;
      // 카운트
      const count = results.count;
      const title = results.title;
      // 해당 유저의 다른 폴더들, 근데 현재 폴더는 제외해야 함.
      // 폴더 이동 폼 클릭 시 보여지는 화면
      results = await Folder.findAll({
        include: [{
          model: Member,
          where: { id: MemberId },
        }],
        where: { id: { [Op.not]: FolderId }},
        attributes: ['id', 'title', 'count'],
      });
      const others = results.map(item => {
        return {
          id: item.id,
          title: item.title,
          count: item.count,
        }
      });
      // 15개만
      results = await List.findAll({
        include: [{
          model: Member,
          where: { id: MemberId },
        }, {
          model: Folder,
          where: { id: FolderId },
        }],
        limit: 15,
        attributes: ['id', 'title', 'author', 'img'],
      });
      const lists = results.map(item => {
        return {
          id: item.id,
          title: item.title,
          author: item.author,
          img: item.img,
        }
      });
      res.render('wishlist/list', {
        member,
        lists,
        title,
        others,
        count,
        isDone: false,
        img: 'list',
      });  
    }  
  } catch(err) {
    console.error(err);
  }
});
// 이미지 파일 올리면
// 그걸 미리보기로 바로 보여줘야 한다. 
// 그래서 upload파일에 올려야 한다.
router.post('/preview', upload.single('image'), (req, res) => {
  try {
    const url = `/img/${req.file.filename}`;
    res.json({ url });  
  } catch(err) {
    console.error(err);
  }
});
// 리스트 추가할때
router.post('/', none.none(), async(req, res) => {
  try {
    const img = req.body.img;
    const title = req.body.title;
    const author = req.body.author;
    const MemberId = req.body.MemberId;
    const FolderId = req.body.FolderId;
    // 리스트 새롭게 저장
    const list = await List.create({
      img,
      title,
      author,
      MemberId,
      FolderId,
    });
    // 폴더에서 count추가
    await Folder.increment('count', {
      include: [{
        model: Member,
        where: { id: MemberId },
      }],
      by: 1,
      where: { id: FolderId },
    });
    res.json({ list });  
  } catch(err) {
    console.error(err);
  }
});
// 리스트 삭제할때
router.delete('/', async(req, res) => {
  try {
    const FolderId = req.body.FolderId;
    const MemberId = req.body.MemberId;
    const page = req.body.page; // 어느 페이지에서 삭제했는지
    const count = +req.body.count; // 카운트: 몇 개 내려보내야 하는지(= 몇 개 삭제했는지)
    const last = req.body.last;
    // 삭제할 친구들 아이디
    const ids = JSON.parse(req.body.id);
    // 삭제하고
    await List.destroy({
      where: { id: ids },
    });
    // 줄이고
    await Folder.decrement('count', {
      include: [{
        model: Member,
        where: { id: MemberId },
      }],
      by: ids.length,
      where: { id: FolderId },
    });
    // 그냥 삭제만 필요한 경우 아무것도 안 보낸다.
    if(count === 0) {
      return res.json({});
    }
    const results = await List.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }, {
        model: Folder,
        where: { id: FolderId },
      }],
      // 몇 개 내려보내야 하는지
      limit: count,
      // 앞에서부터 몇번째의 리스트를 가져와야 하는지
      offset: listOffset(page, count, last),
      attributes: ['id', 'title', 'author', 'img'],
    });
    const lists = results.map(item => {
      return {
        id: item.id,
        img: item.img,
        title: item.title,
        author: item.author,
      }
    });
    res.json({ lists });  
  } catch(err) {
    console.error(err);
  }
});
// 폴더 이동할떄
router.post('/move', async(req, res) => {
  try {
    const MemberId = req.body.MemberId;
    // 현재 폴더
    const FolderId = req.body.FolderId;
    // 이동할 폴더
    const targetId = req.body.targetId;
    const page = req.body.page;
    const count = +req.body.count;
    const last = req.body.last;
    const ids = JSON.parse(req.body.id);
    // 먼저 이동할 아이들을 혹시 몰라 다시 한번 데이터베이스에서 가져오고
    let items = await List.findAll({
      include: [{
        model: Folder,
        where: { id: FolderId },
      }, {
        model: Member,
        where: { id: MemberId },
      }],
      where: { id: ids },
    });
    const selected = items.map(item => item.id);
    // 폴더 아이디 바꿔주기
    await List.update({
      FolderId: targetId,
    }, {
      where: { id: selected },
    });
    // 현재 폴더에서 빠져나간 만큼 빼주기
    await Folder.decrement('count', {
      by: ids.length,
      where: { id: FolderId },
    })
    // 이사간 애들만큼 더해주기
    await Folder.increment('count', {
      by: ids.length,
      where: { id: targetId },
    });
    // 그리고 카운트 업데이트된거
    items = await Folder.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }],
      where: { id: { [Op.not]: FolderId }},
      attributes: ['count'],
    });
    const counts = items.map(item => item.count);
    // 그냥 삭제만 필요한 경우 아무것도 안 보낸다.
    if(count === 0) {
      return res.json({ counts, lists: null });
    }
    items = await List.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }, {
        model: Folder,
        where: { id: FolderId },
      }],
      // 몇 개 내려보내야 하는지
      limit: count,
      // 앞에서부터 몇번째의 리스트를 가져와야 하는지
      offset: listOffset(page, count, last),
      attributes: ['id', 'title', 'author', 'img'],
    });
    const lists = items.map(item => {
      return {
        id: item.id,
        img: item.img,
        title: item.title,
        author: item.author,
      }
    });
    res.json({ counts, lists });  
  } catch(err) {
    console.error(err);
  }
});
// 완독버튼
router.post('/read', async (req, res) => {
  try {
    const ids = JSON.parse(req.body.id);
    const FolderId = req.body.FolderId;
    const MemberId = req.body.MemberId;
    const count = req.body.count;
    const page = req.body.page;
    const last = req.body.last;
    // List에서 DoneList로 옮기기
    let items = await List.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }, {
        model: Folder,
        where: { id: FolderId },
      }],
      where: { id: ids },
    });
    const moveLists = items.map(item => {
      return DoneList.create({
        id: item.id,
        title: item.title,
        author: item.author,
        img: item.img,
        MemberId: item.Member.id,
        FolderId: item.Folder.id,
      });
    });
    await Promise.all(moveLists);
    // 원래 있던 곳에서 삭제
    await List.destroy({
      include: [{
        model: Member,
        where: { id: MemberId },
      }, {
        model: Folder,
        where: { id: FolderId },
      }],
      where: { id: ids },
    });
    // 현재 담고 있는 폴더의 카운트 줄이고, 
    await Folder.decrement('count', {
      include: [{
        model: Member,
        where: { id : MemberId },
      }],
      by: ids.length,
      where: { id: FolderId },
    })
    // doneFolder의 카운트는 늘린다.
    await DoneFolder.increment('count', {
      by: ids.length,
      where: { id: MemberId },
    });
    if(count === 0) {
      return res.json({});
    }
    items = await List.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }, {
        model: Folder,
        where: { id: FolderId },
      }],
      // 몇 개 내려보내야 하는지
      limit: count,
      // 앞에서부터 몇번째의 리스트를 가져와야 하는지
      offset: listOffset(page, count, last),
      attributes: ['id', 'title', 'author', 'img'],
    });
    const lists = items.map(item => {
      return {
        id: item.id,
        img: item.img,
        title: item.title,
        author: item.author,
      }
    });
    res.json({ lists });  
  } catch(err) {
    console.error(err);
  }
});
// 페이지네이션
router.post('/page', async (req, res) => {
  try {
    const page = req.body.page;
    const done = req.body.done;
    const MemberId = req.body.MemberId;
    const offset = (page - 1) * 15;
    let items;
    if(done) {
      items = await DoneList.findAll({
        include: [{
          model: Member,
          where: { id: MemberId },
        }],
        limit: 15,
        offset,
        attributes: ['id', 'title', 'author', 'img'],
      });
    } else {
      const FolderId = req.body.FolderId;
      items = await List.findAll({
        include: [{
          model: Member,
          where: { id: MemberId },
        }, {
          model: Folder,
          where: { id: FolderId },
        }],
        limit: 15,
        offset,
        attributes: ['id', 'title', 'author', 'img'],
      });
    }
    const lists = items.map(item => {
      return {
        id: item.id,
        img: item.img,
        title: item.title,
        author: item.author,
      }
    });
    res.json({ lists });  
  } catch(err) {
    console.error(err);
  }
});
// 완독 해제
router.post('/back', async (req, res) => {
  try {
    const ids = JSON.parse(req.body.id);
    const MemberId = req.body.MemberId;
    const count = req.body.count;
    const page = req.body.page;
    const last = req.body.last;
    let items = await DoneList.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }],
      where: { id: ids },
    });
    // 원래 있던 곳에서 삭제
    await DoneList.destroy({
      include: [{
        model: Member,
        where: { id: MemberId },
      }],
      where: { id: ids },
    });
    // 만약 기존 폴더가 이미 사라지고 없다면?
    let folders = await Folder.findAll({
      attributes: ['id'],
    });
    folders = folders.map(item => item.id);
    // 폴더가 있는 애들만 추가
    items = items.filter(item => {
      return item.Folder && folders.includes(item.Folder.id);
    });
    const moveLists = items.map(item => {
      return List.create({
        id: item.id,
        title: item.title,
        author: item.author,
        img: item.img,
        MemberId: item.Member.id,
        FolderId: item.Folder.id,
      });
    });
    await Promise.all(moveLists);
    // doneFolder의 카운트는 줄이고.
    await DoneFolder.decrement('count', {
      by: ids.length,
      where: { id: MemberId },
    });
    // DoneList => List로 이동할때, 
    // 각각 폴더아이디별로 분류해 Folder의 카운트 올려야 한다.
    const FolderIds = [];
    items.forEach(item => {
      FolderIds[FolderIds.length] = item.Folder.id;
    });
    // 그래서 { 폴더ID: 몇개, 폴더ID: 몇개.. }이런 식으로
    const obj = {};
    FolderIds.forEach(id => {
      obj[id] = (obj[id] == undefined) ? 1 : (obj[id] + 1);
    });
    // 바꿀 폴더 ID 배열
    const id = [];
    for(let prop in obj) {
      id[id.length] = prop;
    }
    // 기존의 폴더를 찾아가 늘리기
    const increments = id.map(async (folderId) => {
      await Folder.increment('count', {
        by: +obj[folderId],
        where: { id: folderId },
      });
    });
    await Promise.all(increments);
    if(count === 0) {
      return res.json({});
    }
    items = await DoneList.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      },],
      // 몇 개 내려보내야 하는지
      limit: count,
      // 앞에서부터 몇번째의 리스트를 가져와야 하는지
      offset: listOffset(page, count, last),
      attributes: ['id', 'title', 'author', 'img'],
    });
    const lists = items.map(item => {
      return {
        id: item.id,
        img: item.img,
        title: item.title,
        author: item.author,
      }
    });
    res.json({ lists });  
  } catch(err) {
    console.error(err);
  }
});
// 읽은 것들에서 삭제
router.delete('/done', async (req, res) => {
  try {
    const ids = JSON.parse(req.body.id);
    const MemberId = req.body.MemberId;
    const count = req.body.count;
    const page = req.body.page;
    const last = req.body.last;
    // doneFolder의 count는 줄이고.
    await DoneFolder.decrement('count', {
      by: ids.length,
      where: { id: MemberId },
    })
    // DoneList에서 삭제하고
    await DoneList.destroy({
      include: [{
        model: Member,
        where: { id: MemberId },
      }],
      where: { id: ids },
    });
    if(count === 0) {
      return res.json({});
    }
    items = await DoneList.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      },],
      // 몇 개 내려보내야 하는지
      limit: count,
      // 앞에서부터 몇번째의 리스트를 가져와야 하는지
      offset: listOffset(page, count, last),
      attributes: ['id', 'title', 'author', 'img'],
    });
    const lists = items.map(item => {
      return {
        id: item.id,
        img: item.img,
        title: item.title,
        author: item.author,
      }
    });
    res.json({ lists });  
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;