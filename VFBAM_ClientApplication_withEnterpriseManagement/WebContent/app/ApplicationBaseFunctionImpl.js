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

//attribute context interface implementation ****************************//
//Constructor.
var AttributeContextImpl = function() {
	require(["idx/context" // global data context provider
		], 
        function(context){		
    });
};
//Methods.    
AttributeContextImpl.prototype.setAttribute = function(/*String*/ name,/*Object*/ value) {
	idx.context.set(null,name,value);
};
AttributeContextImpl.prototype.getAttribute = function(/*String*/ name) {
	return idx.context.get(null,name);
};
//***********************************************************************//

//Messange publish and listening interface implementation ***************//
//Constructor.
var MessageUtilImpl=function(){	
};
//Methods. 
MessageUtilImpl.prototype.publishMessage = function(/*String*/ topicName,/*Object*/ messageValue) {
	require(["dojo/topic"], 
        function(topic){
            topic.publish(topicName, messageValue);
    });
};
MessageUtilImpl.prototype.listenToMessageTopic = function(/*String*/ topicName,/*function*/ callbackFunction) {
	var dojoTopicHandler;	
	require(["dojo/topic"], 
        function(topic){
            dojoTopicHandler=topic.subscribe(topicName, callbackFunction);
    });
	return new MessageListenerHandler(dojoTopicHandler);
};
//Class used to cancel message listening
var MessageListenerHandler=function(/*Object*/ handlerObject){
	this.internalHandlerObj=handlerObject;
}
MessageListenerHandler.prototype.calcelMessageListening = function(){
	this.internalHandlerObj.remove();
};
//***********************************************************************//

//Webservice interface implementation ***********************************//
//Constructor.
var WebServiceUtilImpl=function(){	
};
//Methods.
WebServiceUtilImpl.prototype.getRESTData = function(/*String*/url,/*boolean*/syncFlag,/*object*/queryContent,/*function*/loadCallback,/*function*/errorCallback) {	
	// The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
	var xhrArgs = {
		url:url,
		handleAs: "json",
		sync:syncFlag,
		preventCache: true,
		content:queryContent,
		load: loadCallback,
		error: errorCallback
	};
	dojo.xhrGet(xhrArgs);
};
WebServiceUtilImpl.prototype.postRESTData = function(/*String*/url,/*String*/stringData,/*function*/loadCallback,/*function*/errorCallback){
	var xhrArgs = {
		url: url,
	    postData: stringData,
	    handleAs: "json",
	    load: loadCallback,
	    error: errorCallback,
	    headers: {
	        "Content-Type":"text/json"
	      }
	};  
	dojo.xhrPost(xhrArgs);		
};
WebServiceUtilImpl.prototype.putRESTData = function(/*String*/url,/*String*/stringData,/*function*/loadCallback,/*function*/errorCallback){	
	var xhrArgs = {
		url: url,
		putData: stringData,
		handleAs: "json",
		load: loadCallback,
		error: errorCallback,
		headers: {
		        "Content-Type":"text/json"
		   }
	};
	dojo.xhrPut(xhrArgs);   
};
WebServiceUtilImpl.prototype.deleteRESTData = function(/*String*/url,/*String*/stringData,/*function*/loadCallback,/*function*/errorCallback) {
	var xhrArgs = {
			url: url,
			putData: stringData,
			handleAs: "json",
			load: loadCallback,
			error: errorCallback,
			headers: {
			        "Content-Type": "text/json"
			   }
		};
	dojo.xhrDelete(xhrArgs);	
}; 
//************************************************************************//

//ObjectStore interface implementation ***********************************//
//Constructor.
var ObjectStoreUtilImpl=function(){	
    //need require to make function createObjectStore work
    require(["dojo/store/Memory"], 
        function(Memory){		
    });
	this.internalHaspMap=new HaspMap();
};
//Methods.
ObjectStoreUtilImpl.prototype.createObjectStore = function(/*String*/storeName,/*Data object array*/dataArray, /*String*/keyProperty){
    var interNalDojoMemoryStore;
    require(["dojo/store/Memory"],
        function(Memory){
            interNalDojoMemoryStore = new Memory({data:dataArray, idProperty: keyProperty});
         });
	var objectStore=new ObjectStore(interNalDojoMemoryStore); 
	this.internalHaspMap.put(storeName,objectStore);
	return objectStore; 
};
ObjectStoreUtilImpl.prototype.getObjectStore = function(/*String*/storeName){
	return this.internalHaspMap.get(storeName);
}
ObjectStoreUtilImpl.prototype.removeObjectStore = function(/*String*/storeName){
	return this.internalHaspMap.remove(storeName);
}
//data store access class
var ObjectStore=function(/*object*/ memoryObjectStore){
    this.internalObjectStore=memoryObjectStore;   
};
ObjectStore.prototype.add = function(/*Object*/ dataObject) {
    this.internalObjectStore.add(dataObject);
};
ObjectStore.prototype.get = function(/*String*/ objectKey) {
    return this.internalObjectStore.get(objectKey);
};
ObjectStore.prototype.getObjectKey = function(/*Object*/ dataObject) {
    return this.internalObjectStore.getIdentity(objectKey);
};
ObjectStore.prototype.remove = function(/*String*/ objectKey) {
    return this.internalObjectStore.remove(objectKey);
};
ObjectStore.prototype.update = function(/*Object*/ dataObject) {
    this.internalObjectStore.put(dataObject);
};
ObjectStore.prototype.setData = function(/*ObjectArray*/ dataObjectArray) {
    this.internalObjectStore.setData(dataObjectArray);
};
ObjectStore.prototype.queryObject = function(/*Object*/ queryObject) {
    return this.internalObjectStore.query(queryObject);
};
//***********************************************************************//

//internal Utils ********************************************************//
var HaspMap=function(){
    this.mapBucket=new Object();
	this.size=0;
};
HaspMap.prototype.containsKey = function(/*String*/key) {
	return (key in this.mapBucket);
}
HaspMap.prototype.containsObject = function(/*Object*/object) {
    for(var prop in this.mapBucket){
		if(this.mapBucket[prop]==object){
			return true;
		}
	}
    return false;    
};
HaspMap.prototype.put = function(/*String*/key,/*object*/ value) {
	if(!this.containsKey(key)){
		this.size++;
	}
	this.mapBucket[key]=value;
}
HaspMap.prototype.get = function(/*String*/key) {
	if(this.containsKey(key)){
		return this.mapBucket[key]
	}else{
		return null;
	}
}
HaspMap.prototype.remove = function(/*String*/key) {
	var deleteResult=delete this.mapBucket[key];
	if(deleteResult){
		this.size--;
	}
	return deleteResult;
}
HaspMap.prototype.size = function() {
	return this.size;
}
HaspMap.prototype.keys = function() {
	var keys=new Array(this.size);
	for(var prop in this.mapBucket){
		keys.push(prop);
	}
	return keys;
}
HaspMap.prototype.objects = function() {
	var objects=new Array(this.size);
	for(var prop in this.mapBucket){
		objects.push(this.mapBucket[prop]);
	}
	return objects;
}