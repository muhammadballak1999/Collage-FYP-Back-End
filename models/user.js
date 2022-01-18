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

    //defaults
    createdAt: {type: Date, default: new Date(Date.now())},
    createdBy: {type: Schema.Types.ObjectId, ref:'User'},
    deletedAt: {type: Date,},
    deletedBy: {type: {type: Schema.Types.ObjectId, ref:'User'},},
    updatedAt: {type: Date},
    updatedBy: {type: {type: Schema.Types.ObjectId, ref:'User'}}
},{
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
})

module.exports = mongoose.model('User', user_schema)