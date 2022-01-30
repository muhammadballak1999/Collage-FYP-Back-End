const authValidators = require("./authentication");
const policeStationValidators = require("./police_station");
const CaseStatusValidators = require("./case_status");
const MaritalStatusValidators = require("./marital_status");
const BlogValidators = require("./blog");
const AnnouncementAndRuleValidators = require("./annoncement_and_rule");
const NotificationValidators = require("./notifications");
const RoleValidators = require("./role");
const TermsAndConditionsValidators = require("./term_and_condition");
const AboutValidators = require("./about");


module.exports = {
 authValidators,
 policeStationValidators,
 CaseStatusValidators,
 MaritalStatusValidators,
 BlogValidators,
 AnnouncementAndRuleValidators,
 NotificationValidators,
 RoleValidators,
 TermsAndConditionsValidators,
 AboutValidators
};