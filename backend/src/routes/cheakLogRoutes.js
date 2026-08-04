const express = require('express');


const cheakLogController = require("../controllers/cheakLogController")
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();


router.post('/cheakin', authMiddleware,roleMiddleware("admin","security"), cheakLogController.cheakIn);
router.put('/cheakout/:id',authMiddleware,roleMiddleware("admin","security"),cheakLogController.cheakOut);



router.get('/today',authMiddleware,roleMiddleware("admin","security"),cheakLogController.getTodayLogs);

router.get("/search", authMiddleware,roleMiddleware("admin","security"),cheakLogController.searchCheakLogs);

router.get("/", authMiddleware,roleMiddleware("admin","security"),cheakLogController.getAllCheakLogs);





router.get("/:id", authMiddleware,roleMiddleware("admin","security"),cheakLogController.getCheakLogById);




router.delete('/:id', authMiddleware,roleMiddleware("admin"),cheakLogController.deleteCheakLog);






module.exports = router;