const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const police_station_schema = new Schema({
    longitude: {type: Number, required:true},
    latitude: {type: Number, required:true},

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

module.exports = mongoose.model('PoliceStation', police_station_schema)