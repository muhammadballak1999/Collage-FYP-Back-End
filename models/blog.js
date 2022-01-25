const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blog_schema = new Schema({
    attachment: {type: Schema.Types.ObjectId, ref:'Attachment', default: null},
    title: {type: String, required: true},
    content: {type: String, required: true},

    //defaults
    createdAt: {type: Date, default: new Date(Date.now())},
    createdBy: {type: Schema.Types.ObjectId, ref:'User', default: null},
    isDeleted: {type: Boolean, default: false},
    deletedAt: {type: Date},
    deletedBy: {type: Schema.Types.ObjectId, ref:'User', default: null},
    updatedAt: {type: Date},
    updatedBy: {type: Schema.Types.ObjectId, ref:'User', default: null}
},{
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
});

module.exports = mongoose.model('Blog', blog_schema)