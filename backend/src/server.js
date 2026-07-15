const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const connectDB = require("../src/config/db");
console.log("connectDB", connectDB);

connectDB();

console.log(process.env.JWT_SECRET);
const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`successfully running server in ${PORT}`);
})