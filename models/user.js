const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = new Schema({
    photo: {type: Schema.Types.ObjectId, ref:'Attachment'},
    name: {type: String},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    email: {type: String, unique: true},
    address: {type: String},
    type: {type: String},
    age: {type: Number, required:true},
    city: {type: String},
    location: {type: String},
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
    updatedAt: {type: Date},
    updatedBy: {type: Schema.Types.ObjectId, ref:'User', default: null}
},{
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
})

module.exports = mongoose.model('User', user_schema)