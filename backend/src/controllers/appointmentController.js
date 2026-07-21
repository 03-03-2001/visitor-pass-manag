
const appointmentService = require('../services/appointmentService')

const createAppointment = async(req,res)=>{
   try {


      const appointment =  await appointmentService.createAppointment(req.body);

      res.status(201).json({
        success:true,
        message:"Appointment are successfully created",
        data:appointment
      });


   } catch (error) {
     return  res.status(500).json({
        success:false,
        message: error.message
     })
   }
}

const getAllAppointments = async(req,res)=>{
   try {
       const appointments = await appointmentService.getAllAppointments();

       res.status(200).json({
           success:true,
           count: appointments.length,
           data:appointments
       })
   } catch (error) {
      res.status(500).json({
        success:false,
        message: error.message
      })
   }
}

const getAppointmentById = async(req,res)=>{
    try {
        const appointment = await appointmentService.getAppointmentById(req.params.id);

        if(!appointment){
           return res.status(404).json({
                success:false,
                message:'Appointment Not Found'
            })
        }

        res.status(200).json({
            success:true,
            data:appointment
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


const updateAppointment = async(req,res)=>{
     try {
        const appointment = await appointmentService.updateAppointment(
            req.params.id,
            req.body
        );

        if(!appointment){
           return res.status(404).json({
                success:false,
                message:'Appointment Not Found'
            })
        }

        res.status(200).json({
            success:true,
            message:"Appointment is Update Successfully ",
            data:Appointment
        })
     } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
     }
}


const deleteAppointment =async (req,res)=>{
     try {
        const appointment = await appointmentService.deleteAppointment(req.params.id);
        if(!appointment){
           return res.status(404).json({
                success:false,
                message:"Appointment Not Found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Appointment Has Successfully Deleted"
        })
     } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
     }
}


const approvedAppointment = async(req,res)=>{
    try {
        

         const appointment = await appointmentService.approvedAppointment(
              req.params.id,
              req.user.id
         );

         if(!appointment){
           return res.status(404).json({
                success:false,
                message:"Appointment Not Found"
           })
         }

        res.status(200).json({
            success:true,
            message:"Appointment Approved Successfully",
            data:appointment
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const rejectAppointment = async(req,res)=>{
    try {
        const {remarks} = req.body;

        const appointment = await appointmentServices.rejectAppointment(
            req.params.id,
             remarks
        );

        if(!appointment){
            return res.status(404).json({
                success:false,
                message:"Appointment Not Found"
            })
        };
        res.status(200).json({
            success:true,
            message:"Appointment Rejected Successfully",
            data:appointment
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

const searchAppointment = async(req,res)=>{
    try {
         const {keyword} = req.query;

         const appointment = await appointmentServices.searchAppointment(keyword || "");

        res.status(200).json({
            success:true,
            count:appointment.length,
            data:appointment
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    approvedAppointment,
    rejectAppointment,
    searchAppointment
}