require("dotenv").config()
const app = require("./src/app");
const { connectToDB } = require("./src/config/db");


connectToDB()


app.listen(3000,()=>{
    console.log("app running at port 3000")
})