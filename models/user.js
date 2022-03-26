const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = new Schema({
    attachment: {type: Schema.Types.ObjectId, ref:'Attachment', default: null},
    name: {type: String},
    username: {type: String},
    password: {type: String},
    phone: {type: String},
    email: {type: String},
    type: {type: Schema.Types.ObjectId, ref:'Role'},
    location: {type: String},
    age: {type: Number},
    city: {type: String},
    marital_status: {type: Schema.Types.ObjectId, ref:'MaritalStatus'},
    police_station: {type: Schema.Types.ObjectId, ref:'PoliceStation', default: null},
    otp: {type: String, default: null},
    expire_otp_date: {type: Date, default: null},
    fcm_token_mobile: {type: String, default: null},
    fcm_token_web: {type: String, default: null},
    isSuspended: {type: Boolean, default: false},
    suspendedBy: {type: Schema.Types.ObjectId, ref:'User', default: null},
    suspendedAt: {type: Date, default: null},

    //defaults
    createdAt: {type: Date, default: () => {return new Date(new Date().setHours(new Date().getHours() + 3))}},
    createdBy: {type: Schema.Types.ObjectId, ref:'User', default: null},
    isDeleted: {type: Boolean, default: false},
    deletedAt: {type: Date, default: null},
    deletedBy: {type: Schema.Types.ObjectId, ref:'User', default: null},
    updatedAt: {type: Date, default: null},
    updatedBy: {type: Schema.Types.ObjectId, ref:'User', default: null}
},{
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
})

module.exports = mongoose.model('User', user_schema)