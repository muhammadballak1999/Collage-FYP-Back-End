const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blog_schema = new Schema({
    attachement: {type: Schema.Types.ObjectId, ref:'Attachment'},
    title: {type: String},
    content: {type: String},

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

module.exports = mongoose.model('Blog', blog_schema)