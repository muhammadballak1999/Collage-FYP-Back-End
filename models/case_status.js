const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const case_status_schema = new Schema({
    status: {type: String},

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

module.exports = mongoose.model('CaseStatus', case_status_schema)