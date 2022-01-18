const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorController = require('./utils/errorController');
const AppError = require('./utils/appError');
dotenv.config();

app.use(mongoSanitize());
app.use(morgan('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))
app.use(cors());
app.use(xss());

const blogRoutes = require('./routes/blog');
app.use('/', blogRoutes)


app.all('*', (req, res, next) => {
  throw new AppError(`Can not find ${req.originalUrl} on this server!`,404)
  });

app.use(errorController);

mongoose.connect(process.env.DBURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('Connected to the Database')
    }
})


const port = process.env.PORT || 5000 ;

app.listen(port, err=>{
    if(err){
      console.log(err)
    }else {
      console.log(`Listening on port ${port}`)
    }
  })