

const cheakLogService = require("../services/cheakLogService");

const cheakIn = async (req, res) => {
    try {
        const { passNumber } = req.body;

        const log = await cheakLogService.createCheakIn(
            passNumber,
            req.user._id
        );

        res.status(201).json({
            success: true,
            message: "Visitor checked in successfully.",
            data: log
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

//cheakOut

const cheakOut = async(req,res)=>{
     try {
          const log = await cheakLogService.createCheakOut(
            req.params.id,
            req.user._id
          );

          res.status(200).json({
            success:true,
            message:"Visitor Cheaked Successfully",
            data:log
          });

     } catch (error) {
        console.error(error);
        res.status(400).json({
            success:false,
            message:error.message
        })
     }
}

const getAllCheakLogs = async(req,res)=>{
   try {
       const log = await cheakLogService.getAllCheakLogs();

       res.status(200).json({
           success:true,
           count: log.length,
           data:log
       })
   } catch (error) {
       console.error(error)
      res.status(500).json({
        success:false,
        message: error.message,
       
      })
   }
}

const getCheakLogById = async(req,res)=>{
    try {
        const log = await cheakLogService.getCheakLogById(req.params.id);

        

        res.status(200).json({
            success:true,
            data:log
        });
    } catch (error) {
        console.error(error)
        res.status(404).json({
            success:false,
            message: error.message,
          
        });
    }
};


const getTodayLogs = async(req,res)=>{
     try {
           const logs = await cheakLogService.getTodayLogs();

           res.status(200).json({
            success:true,
            count:logs.length,
            data:logs
           })
     } catch (error) {
        console.error(error)
        res.status(500).json({
            success:false,
            message:error.message
        })
     }
}




const deleteCheakLog =async (req,res)=>{
     try {
        const log = await cheakLogService.deleteCheakLog(req.params.id);
    
        res.status(200).json({
            success:true,
            message:"Cheak Log Has Successfully Deleted"
        })
     } catch (error) {
        console.error(error)
        res.status(400).json({
            success:false,
            message: error.message,
          
        });
     }
}



const searchCheakLogs = async(req,res)=>{
    try {
         const {keyword} = req.query;

         const log = await cheakLogService.searchCheakLogs(keyword || "");

        res.status(200).json({
            success:true,
            count:log.length,
            data:log
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success:false,
            message:error.message,
            
        })
    }
}







module.exports = {
   cheakIn,
   cheakOut,
   getAllCheakLogs,
   getCheakLogById,
   getTodayLogs,
   searchCheakLogs,
   deleteCheakLog
}