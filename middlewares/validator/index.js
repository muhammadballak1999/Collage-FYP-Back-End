const authValidators = require("./authentication");
const policeStationValidators = require("./police_station");
const CaseStatusValidators = require("./case_status");
const MaritalStatusValidators = require("./marital_status");
const BlogValidators = require("./blog");
const notificationValidators = require("./notifications");

module.exports = {
 authValidators,
 policeStationValidators,
 CaseStatusValidators,
 MaritalStatusValidators,
 BlogValidators,
 notificationValidators
};