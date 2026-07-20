const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('../src/routes/authRoutes')
const visitorRoutes = require('../src/routes/visitorRoutes');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/visitors", visitorRoutes);

app.get('/',(req,res)=>{
     res.json({
        success:true,
        message:"Visitors Pass Management API Running"
     });
});



module.exports = app;

