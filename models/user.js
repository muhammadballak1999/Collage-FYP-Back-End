const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = new Schema({
    attachment: {type: Schema.Types.ObjectId, ref:'Attachment', default: null},
    name: {type: String},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    email: {type: String, unique: true},
    type: {type: Schema.Types.ObjectId, ref:'Role', required: true},
    location: {type: String},
    age: {type: Number},
    city: {type: String},
    marital_status: {type: Schema.Types.ObjectId, ref:'MaritalStatus'},
    police_station: {type: Schema.Types.ObjectId, ref:'PoliceStation', default: null},
    otp: {type: String, default: null},
    expire_otp_date: {type: Date, default: null},
    isSuspended: {type: Boolean},
    suspendedBy: {type: Schema.Types.ObjectId, ref:'User', default: null},
    suspendedAt: {type: Date, default: null},

    //defaults
    createdAt: {type: Date, default: new Date(Date.now())},
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