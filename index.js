const express = require('express');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const ratelimit = require('express-rate-limit');
const mongosanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp= require('hpp');


// app.use(mongosanitize());data sanitization against nosql query injection
// app.use(xss()); //data sanitization aganins malicous code XSS
app.use(cors());
app.use(express.json());
app.use(helmet()); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


//limit request from same api route
const limiter = ratelimit({
    max: 100,
    windoMs: 60 * 60 * 1000, // 1hr,
    message: "too many requests per hour please try in an hour",
  });
  app.use("/api", limiter); 



//Routes
const userRoutes= require('./routes/userRoutes');




   
  
app.use('/api/v1/user', userRoutes);




module.exports = app;