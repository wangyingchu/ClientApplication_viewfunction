require([
    "dojo/_base/lang","dojo/_base/declare", "dijit/_Widget", "dijit/_Templated",
    "dojo/text!vfbam/userclient/common/UI/components/participantProfile/template/ParticipantFacePhotoUploaderWidget.html","dojo/dom-style","dojo/io/iframe"
],function(lang,declare, _Widget, _Templated, template,domStyle,ioIframe){
    declare("vfbam.userclient.common.UI.components.participantProfile.ParticipantFacePhotoUploaderWidget", [_Widget, _Templated], {
        templateString: template,
        widgetsInTemplate: true,
        uploadButton:null,
        fileUploader:null,
        postCreate: function(){
            var participantSpace=APPLICATION_ID;
            if(this.participantSpace){
                participantSpace=this.participantSpace;
            }
        	var pathToUploadServerService=PARTICIPANT_SERVICE_ROOT+"participantOperationService/userInfo/updateFacePhoto/"+participantSpace+"/"+this.participantId;
            var that=this;
            var documentFormIdValue="photoForm"+new Date().getTime();
            this.form.id=documentFormIdValue;
            this.fileUploader = new dojox.form.Uploader({
                label: '<i class="icon-picture"></i> 选择图像文件',
                onChange:function(fileArray){
                	if(fileArray.length>0){ 
                		domStyle.set(that.selectedFileInfoContainer,"visibility","visible");                		
                		var fileSize;
                		var num;
                		if(fileArray[0].size>1024000){
                			num = new Number(fileArray[0].size/1024000);                			
                			fileSize=num.toFixed(2)+" MB";
                		}else{
                			num = new Number(fileArray[0].size/1024); 
                			fileSize=num.toFixed(0)+" KB";
                		}
                		that.selectedFileInfo.innerHTML=fileArray[0].name+" ("+fileSize+")";                		
                		if(fileArray[0].size>1024000){
                			UI.showToasterMessage({type:"error",message:"图像文件大小必须小于1MB"});
                			that.uploadButton.set("disabled","disabled");
                			return;
                		}
                		if(fileArray[0].type=="image/jpeg"||fileArray[0].type=="image/gif"||fileArray[0].type=="image/png"){                			
                		}else{
                			UI.showToasterMessage({type:"error",message:"请选择JPEG,PNG或GIF格式的图像文件"});
                			that.uploadButton.set("disabled","disabled");
                			return;                			
                		}  
                		that.uploadButton.set("disabled",false);
                	}                	
                },
                multiple: false
            }, this.fileUploaderNode);    		
    		this.uploadButton = new dijit.form.Button({
                label: '<i class="icon-upload-alt"></i> 上传图像文件',
                onClick: lang.hitch(this, function(){
                	UI.showProgressDialog("上传图像文件");
                    ioIframe.send({
                        form: this.form.id,
                        url: pathToUploadServerService,
                        handleAs: "json"
                      }).then(function(data){                     	
                      }, function(data){
                    	   that._uploadCallback(data);
                      });
                })
            },this.uploadButtonNode);
    		this.uploadButton.set("disabled","disabled");
        },
        doCloseContainerDialog:function(){},        
        _uploadCallback:function(data){  
        	UI.hideProgressDialog();
        	this.doCloseContainerDialog();
        	UI.showToasterMessage({type:"success",message:"用户头像图片更新成功"});
        	this.participantProfileEditor.reloadUserFacePhoto();
            if(this.callback){
                this.callback(data);
            }
        },  
        _endOfCode: function(){}
    });
});