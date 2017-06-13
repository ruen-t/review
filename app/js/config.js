var hostName= "http://pt-reviewtool-vmg.wni.co.jp/easyreviewapi/";

var getEmployeeAPI = hostName+"employee/";
var getUserInfo = hostName+"employee/current/"
var getEmployeeByIDAPI = hostName+"employee/?id=";
var getShopAPI = hostName+"master/Shop/";
var getMeetingSpaceAPI =hostName+"master/MeetSpace/";
var getProjectListAPI = hostName+"project/";
var getProjectMemberAPI = hostName+"project/members/?project=";
var getProjectByIDAPI = hostName+"project/?id=";
var getProjectByShopAPI = hostName+"project/search/?data=detail&key=SHOPCODE&query=";
var getShopByIDAPI = hostName+"master/Shop/";



var getReviewTypeAPI =  hostName+"master/RevType/";
var getRoleAPI = hostName+"master/Role/";
var getDevelopmentAPI = hostName+"project/developments/?project=";
var getDevelopmentIDAPI = hostName+"project/developments/?id=";
var getDocumentTypeAPI = hostName+ "master/DocType/";


var getReviewAPI = hostName+"review/";
var getReviewByDateAPI = hostName+"review/search/?data=detail&key=DATE&query=";
var getSpecificReviewAPI = getReviewAPI+"?id=";
var addReviewAPI = hostName+"review/";
var editReviewAPI = hostName+"review/edit/";
var deleteAPI = hostName+"review/edit/";

var getFeedbackAPI=hostName+"review/feedbacks/?review=";
var addFeedbackAPI=hostName+"review/feedbacks/";
var editFeedbackAPI=hostName+"review/feedback/";

var getReviewMemberAPI= hostName+"review/members/?review=";
var deleteReviewMemberAPI= hostName+"review/member/edit/";
var addReviewMemberAPI= hostName+"review/members/";

var getReviewDocumentAPI = hostName+"review/documents/?review=";
var addDocumentAPI = hostName+"review/documents/";
var deleteDocumentAPI = hostName+"review/document/edit/";
var reportAPI = "http://pt-reviewtool-vmg.wni.co.jp/easyreviewapi/report/?key=DATE&query=";
