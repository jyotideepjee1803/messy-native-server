const express = require('express');
const NoticeController = require('./controller');
const verifyJWT = require('../../middleware/verifyJWT');
const router = express.Router();

router.post('/',verifyJWT, NoticeController.createNotice);
router.get('/', verifyJWT, NoticeController.getNotices);
router.put('/:id', verifyJWT, NoticeController.updateNotice);
router.delete('/:id', verifyJWT, NoticeController.deleteNotice);

module.exports = router;