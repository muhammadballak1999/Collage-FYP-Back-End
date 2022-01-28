const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const violence_case_schema = new Schema({
    longitude: {type: Number, required: true},
    latitude: {type: Number, required: true},
    condition: {type: String},
    police_station: { type: Schema.Types.ObjectId, ref:'PoliceStation', required:true},
    victim: { type: Schema.Types.ObjectId, ref:'User', required:true},
    status: { type: Schema.Types.ObjectId, ref:'CaseStatus', required:true},

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
});

module.exports = mongoose.model('ViolenceCase', violence_case_schema)