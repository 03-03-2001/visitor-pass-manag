const express = require('express');

const visitorController = require('../controllers/visitorController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

console.log({
  createVisitor: typeof visitorController.createVisitor,
  getAllVisitors: typeof visitorController.getAllVisitors,
  searchVisitor: typeof visitorController.searchVisitor,
  getVisitorById: typeof visitorController.getVisitorById,
  updateVisitor: typeof visitorController.updateVisitor,
  deleteVisitor: typeof visitorController.deleteVisitor,
});

router.post('/', authMiddleware, visitorController.createVisitor);
router.get('/',visitorController.getAllVisitors);



//serch visitor

router.get('/search',  visitorController.searchVisitor);

router.get("/:id",  visitorController.getVisitorById);

router.put('/:id',visitorController.updateVisitor);

router.delete('/:id',visitorController.deleteVisitor);


module.exports = router;