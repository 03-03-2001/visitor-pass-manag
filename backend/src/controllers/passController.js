
const { count } = require('node:console');
const passService = require('../services/passService');

const createPass = async(req,res)=>{
   try {

       const passData = {
        ...req.body,
        createdBy: req.user._id,
        passNumber:`PASS-${Date.now()}`
       };

      const pass =  await passService.createPass(passData);

      res.status(201).json({
        success:true,
        message:"Pass are successfully created",
        data:pass
      });


   } catch (error) {
     return  res.status(500).json({
        success:false,
        message: "Error creating Pass",
        error:error.message
     })
   }
}

const getAllPasses = async(req,res)=>{
   try {
       const passes = await passService.getAllPasses();

       res.status(200).json({
           success:true,
           count: passes.length,
           data:passes
       })
   } catch (error) {
      res.status(500).json({
        success:false,
        message: "Error Fetching Passes",
        error:error.message
      })
   }
}

const getPassById = async(req,res)=>{
    try {
        const pass = await passService.getPassById(req.params.id);

        if(!pass){
           return res.status(404).json({
                success:false,
                message:'Pass Not Found'
            })
        }

        res.status(200).json({
            success:true,
            data:pass
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error fetching pass",
            error:error.message
        });
    }
};


const updatePass = async(req,res)=>{
     try {
        const pass = await passService.updatePass(
            req.params.id,
            req.body
        );

        if(!pass){
           return res.status(404).json({
                success:false,
                message:'Pass Not Found'
            });
        }

        res.status(200).json({
            success:true,
            message:"Pass is Update Successfully ",
            data:pass
        })
     } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error Updating Pass",
            error:error.message
        });
     }
}


const deletePass =async (req,res)=>{
     try {
        const pass = await passService.deletePass(req.params.id);
        if(!pass){
           return res.status(404).json({
                success:false,
                message:"Pass Not Found"
            });
        }

        res.status(200).json({
            success:true,
            message:"Pass Has Successfully Deleted"
        })
     } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error Deleting Passes",
            error:error.message
        });
     }
}



const searchPass = async(req,res)=>{
    try {
         const {keyword} = req.query;

         const pass = await passService.searchPass(keyword || "");

        res.status(200).json({
            success:true,
            count:pass.length,
            data:pass
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error Searching Passes",
            error:error.message
        })
    }
}

const getPassByNumber = async(req,res)=>{
      try {
          const {passNumber} = req.params;

          const pass = await passService.getPassByNumber(passNumber);
          if(!pass){
            return res.status(404).json({
                success:false,
                message:"Pass Not Found"
            })
          }

          res.status(200).json({
            success:false,
            data:pass
          })

      } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error fetching Passes",
            error:error.message
        })
      }
}

const getActivePasses = async(req,res)=>{
    try {
        const pass = await passService.getActivePasses();

        res.status(200).json({
            success:true,
            count:pass.length,
            data:pass
        })
    } catch (error) {
        res.status(500).json({
            success:true,
            message:"Error fetching active passes",
            error:error.message
        })
    }
}

const getExpiredPasses = async(req,res)=>{
    try {
        const pass = await passService.getExpiredPasses();

        res.status(200).json({
            success:true,
            count:pass.length,
            data:pass
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error Fetching expired passes",
            error:error.message
        })
    }
}

module.exports = {
    createPass,
   getAllPasses,
    getPassById,
    updatePass,
    deletePass,
    searchPass,
    getPassByNumber,
    getActivePasses ,
    getExpiredPasses
}