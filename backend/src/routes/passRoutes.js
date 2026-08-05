const express = require('express');

const passController = require('../controllers/passController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();


router.post('/', authMiddleware,roleMiddleware("admin","security"), passController.createPass);
//QRCode verify
router.get("/verify/:passNumber", authMiddleware, passController.verifyPass);
router.get('/',authMiddleware,roleMiddleware("admin","security"),passController.getAllPasses);

//serch visitor

router.get('/search',authMiddleware,roleMiddleware("admin","security"),passController.searchPass);

router.get("/active", authMiddleware,roleMiddleware("admin","security"),passController.getActivePasses);

router.get("/expired", authMiddleware,roleMiddleware("admin","security"),passController.getExpiredPasses);


router.get("/number/:passNumber", authMiddleware,roleMiddleware("admin","security"),passController.getPassByNumber);


router.get("/:id", authMiddleware,roleMiddleware("admin","security","employee","visitor"),passController.getPassById);


router.put('/:id', authMiddleware,roleMiddleware("admin","security"),passController.updatePass);

router.delete('/:id', authMiddleware,roleMiddleware("admin"),passController.deletePass);






module.exports = router;