const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const violence_case_schema = new Schema({
    longitude: {type: Number, required: true},
    latitude: {type: Number, required: true},
    condition: {type: String},
    police_station: { type: Schema.Types.ObjectId, ref:'PoliceStation'},
    victim: { type: Schema.Types.ObjectId, ref:'User'},
    status: { type: Schema.Types.ObjectId, ref:'CaseStatus'},

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
});

module.exports = mongoose.model('ViolenceCase', violence_case_schema)