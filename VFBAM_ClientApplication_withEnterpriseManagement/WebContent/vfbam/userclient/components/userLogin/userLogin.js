var USER_NAME_COOKIE_KEY="USER_NAME_COOKIE_KEY";
var USER_PWD_COOKIE_KEY="USER_PWD_COOKIE_KEY";
var RECORD_USERINFO_COOKIE_KEY="RECORD_USERINFO_COOKIE_KEY";
var PARTICIPANT_SERVICE_ROOT="/ParticipantManagementService/ws/";
var PARTICIPANT_AUTH_REST_LOCATION=PARTICIPANT_SERVICE_ROOT+"participantAuthenticateService/participantLogin/";

var rememberUserInfoCheckBox=new dijit.form.CheckBox({},"app_userLogin_rememberUserInfo");
var timer = new dojox.timing.Timer(100);
timer.onTick = function(){
    setUserLoginInfoFromCookie();
    timer.stop();
};
timer.start();
function setUserLoginInfoFromCookie(){
    require(["dojo/cookie"], function(cookie){
        var loadFromCookieFlag = cookie(RECORD_USERINFO_COOKIE_KEY);
        if(loadFromCookieFlag=="Y"){
            rememberUserInfoCheckBox.set("checked",true);
            var userNameInCookie = cookie(USER_NAME_COOKIE_KEY);
            var userPWDInCookie = cookie(USER_PWD_COOKIE_KEY);
            dijit.byId("app_userLogin_userLoginName").set("value",userNameInCookie);
            dijit.byId("app_userLogin_userPassword").set("value",userPWDInCookie);
        }
    });
}
function saveUserLoginInfoInCookie(){
    require(["dojo/cookie"], function(cookie){
        cookie(RECORD_USERINFO_COOKIE_KEY, "Y", { expires: 30 });
        var userName=dijit.byId("app_userLogin_userLoginName").get("value");
        var userPWD=dijit.byId("app_userLogin_userPassword").get("value");
        cookie(USER_NAME_COOKIE_KEY,userName, { expires: 30 });
        cookie(USER_PWD_COOKIE_KEY, userPWD, { expires: 30 });
    });
}
function clearUserLoginInfoInCookie(){
    require(["dojo/cookie"], function(cookie){
        cookie(RECORD_USERINFO_COOKIE_KEY, null, {expires: -1});
        cookie(USER_NAME_COOKIE_KEY, null, {expires: -1});
        cookie(USER_PWD_COOKIE_KEY, null, {expires: -1});
    });
}
function doUserLogin(){
    var userName=dijit.byId("app_userLogin_userLoginName").get("value");
    var userPWD=dijit.byId("app_userLogin_userPassword").get("value");
    if(userName==""){
        UI.showToasterMessage({type:"warn",message:"请输入用户登录ID"});
        return;
    }if(userPWD==""){
        UI.showToasterMessage({type:"warn",message:"请输入用户密码"});
        return;
    }
    var cacheUserInfoFlag=rememberUserInfoCheckBox.get("checked");
    if(cacheUserInfoFlag){
        saveUserLoginInfoInCookie();
    }else{
        clearUserLoginInfoInCookie();
    }
    var userLoginData={};
    userLoginData.participantID=userName;
    userLoginData.participantPWD=userPWD;
    userLoginData.participantScope=APPLICATION_ID;

    var userLoginDataContent=dojo.toJson(userLoginData);
    UI.showProgressDialog("登录系统");
    var resturl=PARTICIPANT_AUTH_REST_LOCATION;

    var errorCallback= function(data){
        UI.hideProgressDialog();
        UI.showSystemErrorMessage(data);
    };
    var loadCallback=function(data){
        UI.hideProgressDialog();
        window.location.href="index.html?participantId="+data.participantID;
    };
    Application.WebServiceUtil.postJSONData(resturl,userLoginDataContent,loadCallback,errorCallback);
}