const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notification_schema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref:'User'},
    title: {type: String},
    description: {type: String},

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

module.exports = mongoose.model('Notification', notification_schema)