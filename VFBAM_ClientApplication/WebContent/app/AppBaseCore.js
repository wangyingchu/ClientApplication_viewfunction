 /***********************  COPYRIGHT START  *****************************************
 // @copyright(external)
 //
 // Licensed Materials - Property of Viewfunction
 // Viewfunction Business Activity Manager
 // (C) Copyright Viewfunction Inc. 2013.
 //
 // Viewfunction grants you ("Licensee") a non-exclusive, royalty free, license to
 // use, copy and redistribute the Non-Sample Header file software in source and
 // binary code form, provided that i) this copyright notice, license and disclaimer
 // appear on all copies of the software; and ii) Licensee does not utilize the
 // software in a manner which is disparaging to Viewfunction.
 //
 // This software is provided "AS IS."  Viewfunction and its Suppliers and Licensors
 // expressly disclaim all warranties, whether  EXPRESS OR IMPLIED, INCLUDING ANY
 // IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR WARRANTY
 // OF NON-INFRINGEMENT.  Viewfunction AND ITS SUPPLIERS AND  LICENSORS SHALL NOT BE
 // LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE THAT RESULT FROM USE OR DISTRIBUTION
 // OF THE SOFTWARE OR THE COMBINATION OF THE SOFTWARE WITH ANY OTHER CODE.IN NO EVENT
 // WILL Viewfunction OR ITS SUPPLIERS AND LICENSORS BE LIABLE FOR ANY LOST REVENUE,
 // PROFIT OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR
 // PUNITIVE DAMAGES, HOWEVER CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, ARISING
 // OUT OF THE USE OF OR INABILITY TO USE SOFTWARE, EVEN IF Viewfunction HAS BEEN
 // ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
 //
 // @endCopyright
 //***********************  COPYRIGHT END  *********************************************/

var Application=(function(){
	//console.log("========================================================");
	//console.log("appInit: create application global ENV object:Application");
	//console.log("========================================================");
	
	//private members:
    var applicationBuildNumber="bld_20130705";
	
	//attribute context interface defination
	var AttributeContextInf= new Interface('AttributeContext', ['setAttribute', 'getAttribute']);
	var attributeContextInstance=new AttributeContextImpl();	
	function _setAttribute(/*String*/ name,/*Object*/ value) {
		Interface.ensureImplements(attributeContextInstance, AttributeContextInf);
		attributeContextInstance.setAttribute(name,value);   
	}	
	function _getAttribute(/*String*/ name) {
		Interface.ensureImplements(attributeContextInstance, AttributeContextInf);
		return attributeContextInstance.getAttribute(name);   
	}
	
	//Messange publish and listening interface defination	
	var MessageUtilInf= new Interface('MessageUtil', ['publishMessage', 'listenToMessageTopic']);
	var messageUtilInstance=new MessageUtilImpl();
	function _publishMessage(/*String*/ topicName,/*Object*/ messageValue){
        Interface.ensureImplements(messageUtilInstance, MessageUtilInf);
		messageUtilInstance.publishMessage(topicName,messageValue);		
    }
	function _listenToMessageTopic(/*String*/ topicName,/*function*/ callbackFunction){
		Interface.ensureImplements(messageUtilInstance, MessageUtilInf);
		return messageUtilInstance.listenToMessageTopic(topicName, callbackFunction);
	}
	
	//Webservice functions interface defination
	var WebServiceUtilInf= new Interface('WebServiceUtil', ['getRESTData','postRESTData','putRESTData','deleteRESTData']);
	var webServiceUtilInstance=new WebServiceUtilImpl();
	function _getRESTData(/*String*/url,/*boolean*/syncFlag,/*object*/queryContent,/*function*/loadCallback,/*function*/errorCallback){
        Interface.ensureImplements(webServiceUtilInstance, WebServiceUtilInf);
        webServiceUtilInstance.getRESTData(/*String*/url,/*boolean*/syncFlag,/*object*/queryContent,/*function*/loadCallback,/*function*/errorCallback);		
    }
	function _postRESTData(/*String*/url,/*String*/textData,/*function*/loadCallback,/*function*/errorCallback){
		Interface.ensureImplements(webServiceUtilInstance, WebServiceUtilInf);
		webServiceUtilInstance.postRESTData(url,textData,loadCallback,errorCallback);
	}
	function _putRESTData(/*String*/url,/*String*/textData,/*function*/loadCallback,/*function*/errorCallback){
		Interface.ensureImplements(webServiceUtilInstance, WebServiceUtilInf);
		webServiceUtilInstance.putRESTData(url,textData,loadCallback,errorCallback);
	}
	function _deleteRESTData(/*String*/url,/*String*/textData,/*function*/loadCallback,/*function*/errorCallback){
		Interface.ensureImplements(webServiceUtilInstance, WebServiceUtilInf);
		webServiceUtilInstance.deleteRESTData(url,textData,loadCallback,errorCallback);
	}	
	
	//ObjectStore functions interface defination
	var ObjectStoreUtilInf=new Interface('ObjectStoreUtil', ['createObjectStore','getObjectStore','removeObjectStore']);
	var objectStoreUtilInstance=new ObjectStoreUtilImpl();
	function _createObjectStore(/*String*/storeName,/*Data object array*/dataArray, /*String*/keyProperty){
		Interface.ensureImplements(objectStoreUtilInstance, ObjectStoreUtilInf);
		return objectStoreUtilInstance.createObjectStore(storeName,dataArray,keyProperty);
	}
	function _getObjectStore(/*Sting*/ storeName){
		Interface.ensureImplements(objectStoreUtilInstance, ObjectStoreUtilInf);
		return objectStoreUtilInstance.getObjectStore(storeName);
	}
	function _removeObjectStore(/*Sting*/ storeName){
		Interface.ensureImplements(objectStoreUtilInstance, ObjectStoreUtilInf);
		return objectStoreUtilInstance.removeObjectStore(storeName);
	}
//public members:
return {
	applicationName:"viewfunction.bam.client",
	applicationVersion:"v1.0",
	getApplicationBuildNumber:function(){
		return applicationBuildNumber;
	},
	ObjectStoreUtil:{
		createObjectStore:function(/*String*/storeName,/*Data object array*/dataArray, /*String*/keyProperty){
			return _createObjectStore(storeName,dataArray,keyProperty);
		},
		getObjectStore:function(/*String*/storeName){
			return _getObjectStore(storeName);
		},
		removeObjectStore:function(/*String*/storeName){
			return _removeObjectStore(storeName);
		}
	},
	WebServiceUtil:{
		getJSONData:function(/*String*/url,/*boolean*/syncFlag,/*object*/queryContent,/*function*/loadCallback,/*function*/errorCallback){
			_getRESTData(url,syncFlag,queryContent,loadCallback,errorCallback);
		},
		postJSONData:function(/*String*/url,/*Strig*/StringData,/*function*/loadCallback,/*function*/errorCallback){
			_postRESTData(url,StringData,loadCallback,errorCallback);
		},
		putJSONData:function(/*String*/url,/*String*/textData,/*function*/loadCallback,/*function*/errorCallback){
			_putRESTData(url,textData,loadCallback,errorCallback);
		},
		deleteJSONData:function(/*String*/url,/*String*/textData,/*function*/loadCallback,/*function*/errorCallback){
			_deleteRESTData(url,textData,loadCallback,errorCallback);
		}	
	},
	//Used to store and access application level attribute object
	AttributeContext:{
		setAttribute:function(/*String*/ name,/*Object*/ value){
			_setAttribute(name,value);
		},
		getAttribute:function(/*String*/ name){			
			return _getAttribute(name);
		}	
	},
    //Used to send application level message by topic name
    MessageUtil:{
        publishMessage:function(/*String*/ topicName,/*Object*/ messageValue){           
		   _publishMessage(topicName,messageValue);		   
        },
        listenToMessageTopic:function(/*String*/ topicName,/*function*/callbackFunction){          
		   return _listenToMessageTopic(topicName,callbackFunction);
        }
    }	
};
})();