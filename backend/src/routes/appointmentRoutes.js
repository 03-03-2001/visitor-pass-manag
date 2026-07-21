const express = require('express');

const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();


router.post('/', authMiddleware,roleMiddleware("admin","employee","visitor"), appointmentController.createAppointment);
router.get('/',authMiddleware,roleMiddleware("admin","security"),appointmentController.getAllAppointments);

//serch visitor

router.get('/search',authMiddleware,roleMiddleware("admin","security"),appointmentController.searchAppointment);

router.get("/:id", authMiddleware,roleMiddleware("admin","security","employee"),appointmentController.getAppointmentById);

router.put('/:id', authMiddleware,roleMiddleware("admin","employee"),appointmentController.updateAppointment);

router.delete('/:id', authMiddleware,roleMiddleware("admin"),appointmentController.deleteAppointment);

router.put('/:id/approve',authMiddleware,roleMiddleware("admin","employee"),appointmentController.approvedAppointment);

router.put('/:id/reject',authMiddleware,roleMiddleware("admin","employee"),appointmentController.rejectAppointment);




module.exports = router;