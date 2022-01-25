const authValidators = require("./authentication");
const policeStationValidators = require("./police_station");
const CaseStatusValidators = require("./case_status");
const MaritalStatusValidators = require("./marital_status");
const BlogValidators = require("./blog");
const AnnouncementAndRuleValidators = require("./annoncement_and_rule");
const NotificationValidators = require("./notifications");
const RoleValidators = require("./role");

module.exports = {
 authValidators,
 policeStationValidators,
 CaseStatusValidators,
 MaritalStatusValidators,
 BlogValidators,
 AnnouncementAndRuleValidators,
 NotificationValidators,
 RoleValidators
};