const visitorService = require('../services/visitorService');

const createVisitor = async(req,res)=>{
   try {
      const visitorData = {
        ...req.body,
        createdBy = req.uer._id, 
    }

      const visitor =  await visitorService.createVisitor(visitorData);

      res.status(201).json({
        success:true,
        message:"Visitor are successfully created"
      });


   } catch (error) {
     res.status(500).json({
        success:false,
        message: error.message
     })
   }
}

const getAllVisitors = async(req,res)=>{
   try {
       const visitors = await visitorService.getAllVisitors();

       res.status(200).json({
           success:true,
           count: visitors.length,
           data:visitors
       })
   } catch (error) {
      res.status(500).json({
        success:false,
        message: error.message
      })
   }
}

const getVisitorById = async(req,res)=>{
    try {
        const visitor = await visitorService.getVisitorById(req.params.id);

        if(!visitor){
            res.status(404).json({
                success:false,
                message:'Visitor Not Found'
            })
        }

        res.status(200).json({
            success:true,
            data:visitor
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


const updateVisitor = async(req,res)=>{
     try {
        const visitor = await visitorService.updateVisitor(
            req.params.id,
            req.body
        );

        if(!visitor){
            res.status(404).json({
                success:false,
                message:'Visitor Not Found'
            })
        }

        res.status(200).json({
            success:true,
            message:"Visitor is Update Successfully ",
            data:visitor
        })
     } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
     }
}


const deleteVisitor =async (req,res)=>{
     try {
        const visitor = await visitorService.deleteVisitor(req.params.id);
        if(!visitor){
            res.status(404).json({
                success:false,
                message:"Visitor Not Found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Visitor Has Successfully Deleted"
        })
     } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
     }
}


const searchVisitor = async(req,res)=>{
    try {
         const {keyword} = req.query;

         const visitor = await visitorService.searchVisitor(keyword || "");

        res.status(200).json({
            success:true,
            count:visitor.length,
            data:visitor
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {
    createVisitor,
    getAllVisitors,
    getVisitorById,
    updateVisitor,
    deleteVisitor,
    searchVisitor
}