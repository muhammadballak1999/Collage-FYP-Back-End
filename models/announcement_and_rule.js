const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcement_and_rule_schema = new Schema({
    attachement: {type: Schema.Types.ObjectId, ref:'Attachment'},
    title: {type: String},
    content: {type: String},

    //defaults
    createdAt: {type: Date, default: new Date(Date.now())},
    createdBy: {type: Schema.Types.ObjectId, ref:'User', default: null},
    isDeleted: {type: Boolean, default: false},
    deletedAt: {type: Date, default: null},
    deletedBy: {type: Schema.Types.ObjectId, ref:'User', default: null},
    updatedAt: {type: Date},
    updatedBy: {type: Schema.Types.ObjectId, ref:'User', default: null}
});

module.exports = mongoose.model('AnnouncementAndRule', announcement_and_rule_schema)