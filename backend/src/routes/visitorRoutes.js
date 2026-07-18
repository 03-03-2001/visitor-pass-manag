const express = require('express');

const visitorController = require('../controllers/visitorController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/', authMiddleware, visitorController.createVisitor);
router.get('/',visitorController.getAllVisitors);

//serch visitor

router.get('/search',  visitorController.searchVisitor);

router.get("/:id",  visitorController.getVisitorById);

router.put('/:id',visitorController.updateVisitor);

router.delete('/:id',visitorController.deleteVisitor);


module.exports = router;