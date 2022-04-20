const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = new Schema({
    attachment: {type: Schema.Types.ObjectId, ref:'Attachment', default: null},
    name: {type: String, default: null},
    password: {type: String, default: null},
    phone: {type: String, default: null},
    email: {type: String, default: null},
    type: {type: Schema.Types.ObjectId, ref:'Role'},
    location: {type: String, default: null},
    age: {type: Number, default: null},
    city: {type: String, default: null},
    marital_status: {type: Schema.Types.ObjectId, ref:'MaritalStatus', default: null},
    police_station: {type: Schema.Types.ObjectId, ref:'PoliceStation', default: null},
    otp: {type: String, default: null},
    expire_otp_date: {type: Date, default: null},
    fcm_token_mobile: {type: String, default: null},
    fcm_token_web: {type: String, default: null},
    isSuspended: {type: Boolean, default: false},
    isInDanger: {type: Boolean, default: false},
    case: {type: Schema.Types.ObjectId, ref:'ViolenceCase', default: null},
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