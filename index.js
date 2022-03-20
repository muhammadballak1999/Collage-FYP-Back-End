const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require('cors');
const hpp = require('hpp');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const admin = require('firebase-admin');
const errorController = require('./utils/errorController');
const AppError = require('./utils/appError');
// const serviceAccount = require('./fcm-admin-credentials.json');
dotenv.config();

app.use(new CaseSensitivePathsPlugin());

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json()); 
app.use(mongoSanitize());
app.use(morgan('dev'));
app.use(cors());
app.use(xss());
app.use(hpp());

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const blogRoutes = require('./routes/blog');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/authentication');
const adminRoutes = require('./routes/admin');
const announcementAndRulesRoutes = require('./routes/announcement_and_rule');
const maritalStatusRoutes = require('./routes/marital_status');
const caseStatusRoutes = require('./routes/case_status');
const roleRoutes = require('./routes/role');
const termsAndConditionsRoutes = require('./routes/terms_and_conditions');
const violenceCasesRoutes = require('./routes/violence_case');
const aboutRoutes = require('./routes/about');
const notificationRoutes = require('./routes/notification');
app.use('/', notificationRoutes);
app.use('/', aboutRoutes);
app.use('/', violenceCasesRoutes);
app.use('/', termsAndConditionsRoutes);
app.use('/', roleRoutes);
app.use('/', caseStatusRoutes);
app.use('/', maritalStatusRoutes);
app.use('/', announcementAndRulesRoutes);
app.use('/', adminRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', blogRoutes);


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