var hostName= "http://172.16.252.110/";

var getEmployeeAPI = hostName+"reviewtoolapi/employee/";
var getShopAPI = hostName+"reviewtoolapi/master/Shop/";
var getMeetingSpaceAPI =hostName+"reviewtoolapi/master/MeetSpace/";
var getProjectListAPI = hostName+"reviewtoolapi/project/";
var getProjectMemberAPI = hostName+"reviewtoolapi/project/members/?project=";
var getReviewTypeAPI =  hostName+"reviewtoolapi/master/RevType/";
var getRoleAPI = hostName+"reviewtoolapi/master/Role/";
var getDevelopmentAPI = hostName+"reviewtoolapi/project/developments/?project=";
var getDocumentTypeAPI = hostName+ "reviewtoolapi/master/DocType/";


var getReviewAPI = hostName+"reviewtoolapi/review/";
var getSpecificReviewAPI = getReviewAPI+"?id=";
var addReviewAPI = hostName+"reviewtoolapi/review/";
var editReviewAPI = hostName+"reviewtoolapi/review/edit/";
var deleteAPI = hostName+"reviewtoolapi/review/edit/";

var getFeedbackAPI=hostName+"reviewtoolapi/review/feedbacks/?review=";
var addFeedbackAPI=hostName+"reviewtoolapi/review/feedbacks/";
var editFeedbackAPI=hostName+"reviewtoolapi/review/feedback/";

var getReviewMemberAPI= hostName+"reviewtoolapi/review/members/?review=";
var deleteReviewMemberAPI= hostName+"reviewtoolapi/review/member/";

var getReviewDocumentAPI = hostName+"reviewtoolapi/review/documents/?review=";
var addDocumentAPI = hostName+"reviewtoolapi/review/documents/";
var deleteDocumentAPI = hostName+"reviewtoolapi/review/document/";
