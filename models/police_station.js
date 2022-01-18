const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const police_station_schema = new Schema({
    attachement: {type: Schema.Types.ObjectId, ref:'Attachment'},
    name: {type: String, required: true},
    city: {type: String, required:true},
    location: {type: String},
    longitude: {type: Number, required:true},
    latitude: {type: Number, required:true},

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

module.exports = mongoose.model('PoliceStation', police_station_schema)