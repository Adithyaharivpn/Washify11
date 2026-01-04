var express = require("express")
var cors = require("cors")
var dotenv=require("dotenv")
dotenv.config();
require("./connection")

var port=process.env.PORT;

var app=express();


const userRoute=require("./routes/userRoute")
const EmployeeRoute=require("./routes/EmployeeRoute")
const centerRoute = require('./routes/CenterRoute');
const bookingRoute = require('./routes/BookingRoute');
//ghggh
app.use(express.json())
//tttt
app.use(cors())
app.use('/api',userRoute)
app.use('/e',EmployeeRoute)
app.use('/api/centers', centerRoute);   // New Center Route
app.use('/api/bookings', bookingRoute); // New Booking Route

app.listen(port,()=>{
    console.log(`Server is up and Running ${port}`)
})
