const TermsAndConditions = require("../models/terms_and_conditions");
const catchAsync  = require('../utils/catchAsync');

// Get Terms and Conditions

exports.get = catchAsync(async(req, res, next) => {

    let terms_and_conditions = await TermsAndConditions.find({isDeleted: false})
    .select('-createdBy -deletedAt -deletedBy -updatedAt -updatedBy -isDeleted')
    .sort({_id: -1})
    .exec();

    if(terms_and_conditions.length === 0) {
        let new_term_and_condition = new TermsAndConditions();
        new_term_and_condition.content = '';
        await new_term_and_condition.save();
        res.status(200).send({
            success: true,
            message: 'New term and condition created successfully',
            data: new_term_and_condition
        })
        return
    }

    res.status(200).send({
        success: true,
        message: 'All terms and conditions fetched successfully',
        data: terms_and_conditions[0]
    });
});


// Create Term and Condition

exports.create = catchAsync(async(req, res, next) => {

    var term_and_condition = new TermsAndConditions();
    term_and_condition.content = req.body.content; 
    term_and_condition.createdBy = req.decoded.id;

    await term_and_condition.save();

    res.status(200).send({
        success: true,
        message: 'Term and condition created successfully',
        data: term_and_condition
    })

});


// Update Term and Condition

exports.update = catchAsync(async(req, res, next) => {

    let term_and_condition = await TermsAndConditions.findOne({_id: req.params.id, isDeleted: false});

    if(!term_and_condition) {
        res.status(404).send({
            success: false,
            message: 'No terms and conditions were found!',
            data: {}
        })
    }

    if(req.body.content){term_and_condition.content = req.body.content}
    if(req.body.content === '') {term_and_condition.content = '<p></p>'}
    term_and_condition.updatedBy = req.decoded.id;
    term_and_condition.updatedAt = new Date(Date.now());

    await term_and_condition.save();

    res.status(200).send({
        success: true,
        message: 'Term and condition updated successfully',
        data: term_and_condition
    })
});
