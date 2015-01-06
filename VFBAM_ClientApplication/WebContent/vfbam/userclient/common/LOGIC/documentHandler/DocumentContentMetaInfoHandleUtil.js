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

var DocumentHandleUtil=(function(){
    //private members:

    //public members:
    return {
        isSpecialDocumentTypeByCheckPostfix:function(fileName,postfix){
            if(!fileName){
                return false;
            }
            var lastDotPostion=fileName.lastIndexOf(".");
            if(lastDotPostion<=0){
                return false;
            }
            var postfixFileType=fileName.substring(lastDotPostion+1);
            if(postfixFileType==postfix){
                return true;
            }else{
                return false;
            }
        },
        isPreviewable:function(detectedDocumentType,documentName){
            if(!detectedDocumentType){
                return false;
            }
            if(detectedDocumentType.match("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")||
                detectedDocumentType.match("application/vnd.openxmlformats-officedocument.wordprocessingml.document")||
                detectedDocumentType.match("application/vnd.openxmlformats-officedocument.presentationml.presentation")||
                detectedDocumentType.match("application/vnd.ms-word")||
                detectedDocumentType.match("application/msword")||
                detectedDocumentType.match("application/vnd.ms-excel")||
                detectedDocumentType.match("application/vndms-powerpoint")||
                (detectedDocumentType.match("application/zip")&&DocumentHandleUtil.isSpecialDocumentTypeByCheckPostfix(documentName,"pptx"))||
                detectedDocumentType.match("application/vnd.oasis.opendocument.text")||
                detectedDocumentType.match("application/vnd.oasis.opendocument.spreadsheet")||
                detectedDocumentType.match("application/vnd.oasis.opendocument.presentation")||
                detectedDocumentType.match("application/pdf")||
                detectedDocumentType.match("image")||
                detectedDocumentType.match("text/plain")||
                detectedDocumentType.match("text/xml")||
                detectedDocumentType.match("application/x-javascript")||
                detectedDocumentType.match("text/css")||
                (detectedDocumentType.match("application/octet-stream")&&DocumentHandleUtil.isSpecialDocumentTypeByCheckPostfix(documentName,"sql"))||
                detectedDocumentType.match("text/x-sql")
                ){
                return true;
            }else{
                return false;
            }
        },
        getFileTypeIcon:function(fileType,isFolder,fileName){
            if(isFolder){
                return "vfbam/userclient/css/image/fileType/folder16.png";
            }
            if(fileType.match("image/png")){
                return "vfbam/userclient/css/image/fileType/graphic16.gif";
            }
            if(fileType.match("image/jpeg")){
                return "vfbam/userclient/css/image/fileType/jpg.png";
            }
            if(fileType.match("image/bmp")){
                return "vfbam/userclient/css/image/fileType/jpg.png";
            }
            if(fileType.match("application/pdf")){
                return "vfbam/userclient/css/image/fileType/pdf.png";
            }
            if(fileType.match("text/plain")){
                if(fileType.match("text/x-java-source")||fileType.match("text/x-java")){
                    return "vfbam/userclient/css/image/fileType/java.png";
                }else{
                    return "vfbam/userclient/css/image/fileType/txt.png";
                }
            }
            if(fileType.match("image/x-pcx")){
                return "vfbam/userclient/css/image/fileType/ini.png";
            }
            if(fileType.match("text/css")){
                return "vfbam/userclient/css/image/fileType/css.png";
            }
            if(fileType.match("application/x-javascript")){
                return "vfbam/userclient/css/image/fileType/js.png";
            }
            if(fileType.match("application/x-javascript")){
                return "vfbam/userclient/css/image/fileType/java.png";
            }
            if(fileType.match("text/x-sql")){
                return "vfbam/userclient/css/image/fileType/dbdoc.png";
            }
            if((fileType.match("application/octet-stream")&&DocumentHandleUtil.isSpecialDocumentTypeByCheckPostfix(fileName,"sql"))){
                return "vfbam/userclient/css/image/fileType/dbdoc.png";
            }
            if(fileType.match("text/css")){
                return "vfbam/userclient/css/image/fileType/codetext.gif";
            }
            if(fileType.match("application/x-javascript")){
                return "vfbam/userclient/css/image/fileType/codetext.gif";
            }
            if(fileType.match("application/javascript")){
                return "vfbam/userclient/css/image/fileType/codetext.gif";
            }
            //for sound
            if(fileType.match("video/x-mpeg")){
                return "vfbam/userclient/css/image/fileType/audio.gif";
            }
            if(fileType.match("audio/x-mpeg-3")){
                return "vfbam/userclient/css/image/fileType/audio.gif";
            }
            if(fileType.match("audio/mpeg3")){
                return "vfbam/userclient/css/image/fileType/audio.gif";
            }
            if(fileType.match("video/mpeg")){
                return "vfbam/userclient/css/image/fileType/audio.gif";
            }
            if(fileType.match("audio/mpeg")){
                return "vfbam/userclient/css/image/fileType/audio.gif";
            }
            //for excel
            if(fileType.match("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")){
                return "vfbam/userclient/css/image/fileType/xls.png";
            }
            if(fileType.match("application/excel")){
                return "vfbam/userclient/css/image/fileType/xls.png";
            }
            if(fileType.match("application/vndms-excel")){
                return "vfbam/userclient/css/image/fileType/xls.png";
            }
            if(fileType.match("application/x-excel")){
                return "vfbam/userclient/css/image/fileType/xls.png";
            }
            if(fileType.match("application/x-msexcel")){
                return "vfbam/userclient/css/image/fileType/xls.png";
            }
            if(fileType.match("application/vnd.ms-excel")){
                return "vfbam/userclient/css/image/fileType/xls.png";
            }
            //for ms word
            if(fileType.match("application/vnd.ms-word")){
                return "vfbam/userclient/css/image/fileType/doc.png";
            }
            if(fileType.match("application/vnd.openxmlformats-officedocument.wordprocessingml.document")){
                return "vfbam/userclient/css/image/fileType/doc.png";
            }
            //for power point
            if(fileType.match("application/vnd.openxmlformats-officedocument.presentationml.presentation")){
                return "vfbam/userclient/css/image/fileType/ppt.png";
            }
            if(fileType.match("application/mspowerpoint")){
                return "vfbam/userclient/css/image/fileType/ppt.png";
            }
            //for open office
            if(fileType.match("application/vnd.oasis.opendocument.text")){
                return "vfbam/userclient/css/image/fileType/odt.png";
            }
            if(fileType.match("application/vnd.oasis.opendocument.spreadsheet")){
                return "vfbam/userclient/css/image/fileType/ods.png";
            }
            if(fileType.match("application/vnd.oasis.opendocument.presentation")){
                return "vfbam/userclient/css/image/fileType/odp.png";
            }
            //for zip
            if(fileType.match("application/x-zip-compressed")){
                return "vfbam/userclient/css/image/fileType/compressed.gif";
            }
            if(fileType.match("application/zip")){
                //current document type check service can't tell pptx file
                if(this.isSpecialDocumentTypeByCheckPostfix(fileName,"pptx")){
                    return "vfbam/userclient/css/image/fileType/ppt.png";
                }
                return "vfbam/userclient/css/image/fileType/compressed.gif";
            }
            if(fileType.match("multipart/x-zip")){
                return "vfbam/userclient/css/image/fileType/compressed.gif";
            }
            if(fileType.match("application/x-compressed")){
                return "vfbam/userclient/css/image/fileType/compressed.gif";
            }
            //for xml
            if(fileType.match("text/xml")){
                return "vfbam/userclient/css/image/fileType/xml.png";
            }
            if(fileType.match("application/xml")){
                return "vfbam/userclient/css/image/fileType/xml.png";
            }
            return "vfbam/userclient/css/image/fileType/default.png"
        },
        isThumbnailable:function(fileType,fileName){
            if(fileType.match("image")){
                return true;
            }
            return false;
        },
        getDocumentMainType:function(documentInfo){
            var contentMimeType=documentInfo.documentType;
            if((contentMimeType.indexOf("image/vnddwg")>=0)
                ||(contentMimeType.indexOf("image/x-dwg")>=0)||(contentMimeType.indexOf("application/acad")>=0)
                ||(contentMimeType.indexOf("image/vnd.dwg")>=0)){
                return "DWG 文档";
            }
            if((contentMimeType.indexOf("application/pdf")>=0)){
                return "PDF 文档";
            }
            if((contentMimeType.indexOf("image/jpeg")>=0)
                ||(contentMimeType.indexOf("image/pjpeg")>=0)){
                return "JPEG 图像";
            }
            if((contentMimeType.indexOf("image/jpeg")>=0)
                ||(contentMimeType.indexOf("image/png")>=0)){
                return "PNG 图像";
            }
            if((contentMimeType.indexOf("application/vnd.ms-excel")>=0)
                ||(contentMimeType.indexOf("application/excel")>=0)||(contentMimeType.indexOf("application/vndms-excel")>=0)
                ||(contentMimeType.indexOf("application/x-excel")>=0)||(contentMimeType.indexOf("application/x-msexcel")>=0)
                ||(contentMimeType.indexOf("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")>=0)){
                return "MS Excel 文档";
            }
            if((contentMimeType.indexOf("application/mspowerpoint")>=0)
                ||(contentMimeType.indexOf("application/vndms-powerpoint")>=0)||(contentMimeType.indexOf("application/powerpoint")>=0)
                ||(contentMimeType.indexOf("application/x-mspowerpoint")>=0)||(contentMimeType.indexOf("application/vnd.ms-powerpoint")>=0)
                ||(contentMimeType.indexOf("application/vnd.openxmlformats-officedocument.presentationml.presentation")>=0)){
                return "MS PowerPoint 文档";
            }
            if((contentMimeType.indexOf("application/msword")>=0)
                ||(contentMimeType.indexOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document")>=0)){
                return "MS Word 文档";
            }
            if((contentMimeType.indexOf("application/vnd.oasis.opendocument.text")>=0)){
                return "OpenOffice ODT 文档";
            }
            if((contentMimeType.indexOf("application/vnd.oasis.opendocument.presentation")>=0)){
                return "OpenOffice ODP 文档";
            }
            if((contentMimeType.indexOf("application/vnd.oasis.opendocument.spreadsheet")>=0)){
                return "OpenOffice ODS 文档";
            }
            if((contentMimeType.indexOf("application/java-byte-code")>=0)
                ||(contentMimeType.indexOf("application/x-java-class")>=0)||(contentMimeType.indexOf("application/java")>=0)
                ||(contentMimeType.indexOf("application/x-java-applet")>=0)||(contentMimeType.indexOf("application/java-vm")>=0)){
                return "Java 文件";
            }
            //for common image file
            if((contentMimeType.indexOf("image")>=0)){
                if((contentMimeType.indexOf("image/vnd.adobe.photoshop")>=0)){
                    return "Photoshop 图像文件";
                }
                return "图像文件";
            }
            return contentMimeType;
        },
        getPreviewPicURL:function(fileType,isFolder){
            if(isFolder){
                return "vfbam/userclient/css/image/fileType/fileTypePreview/folderDocument.png";
            }
            if(fileType.match("image/png")){
                return "images/222122my3ue60tnlly68ee.jpg";
            }
            if(fileType.match("image/jpeg")){
                return "images/222122my3ue60tnlly68ee.jpg";
            }
            if(fileType.match("image/bmp")){
                return "images/222122my3ue60tnlly68ee.jpg";
            }
            if(fileType.match("application/pdf")){
                return "vfbam/userclient/css/image/fileType/fileTypePreview/pdfDocument.png";
            }
            if(fileType.match("text/plain")){
                if(fileType.match("text/x-java-source")||fileType.match("text/x-java")){
                    //return "vfbam/userclient/css/image/fileType/java.png";
                    return "vfbam/userclient/css/image/fileType/fileTypePreview/textDocument.png";
                }else{
                    return "vfbam/userclient/css/image/fileType/fileTypePreview/textDocument.png";
                }
            }
            /*
            if(fileType.match("image/x-pcx")){
                return "vfbam/userclient/css/image/fileType/ini.png";
            }
            if(fileType.match("text/css")){
                return "vfbam/userclient/css/image/fileType/css.png";
            }
            if(fileType.match("application/x-javascript")){
                return "vfbam/userclient/css/image/fileType/js.png";
            }
            if(fileType.match("application/x-javascript")){
                return "vfbam/userclient/css/image/fileType/java.png";
            }
            if(fileType.match("text/x-sql")){
                return "vfbam/userclient/css/image/fileType/dbdoc.png";
            }
            if((fileType.match("application/octet-stream")&&DocumentHandleUtil.isSpecialDocumentTypeByCheckPostfix(fileName,"sql"))){
                return "vfbam/userclient/css/image/fileType/dbdoc.png";
            }
            if(fileType.match("text/css")){
                return "vfbam/userclient/css/image/fileType/codetext.gif";
            }
            if(fileType.match("application/x-javascript")){
                return "vfbam/userclient/css/image/fileType/codetext.gif";
            }
            if(fileType.match("application/javascript")){
                return "vfbam/userclient/css/image/fileType/codetext.gif";
            }
            //for sound
            if(fileType.match("video/x-mpeg")){
                return "vfbam/userclient/css/image/fileType/audio.gif";
            }
            if(fileType.match("audio/x-mpeg-3")){
                return "vfbam/userclient/css/image/fileType/audio.gif";
            }
            if(fileType.match("audio/mpeg3")){
                return "vfbam/userclient/css/image/fileType/audio.gif";
            }
            if(fileType.match("video/mpeg")){
                return "vfbam/userclient/css/image/fileType/audio.gif";
            }
            if(fileType.match("audio/mpeg")){
                return "vfbam/userclient/css/image/fileType/audio.gif";
            }
            */
            //for excel
            if(fileType.match("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")){
                return "vfbam/userclient/css/image/fileType/fileTypePreview/excelDocument.png";
            }
            if(fileType.match("application/excel")){
                return "vfbam/userclient/css/image/fileType/fileTypePreview/excelDocument.png";
            }
            if(fileType.match("application/vndms-excel")){
                return "vfbam/userclient/css/image/fileType/fileTypePreview/excelDocument.png";
            }
            if(fileType.match("application/x-excel")){
                return "vfbam/userclient/css/image/fileType/fileTypePreview/excelDocument.png";
            }
            if(fileType.match("application/x-msexcel")){
                return "vfbam/userclient/css/image/fileType/fileTypePreview/excelDocument.png";
            }
            if(fileType.match("application/vnd.ms-excel")){
                return "vfbam/userclient/css/image/fileType/fileTypePreview/excelDocument.png";
            }
            //for ms word
            if(fileType.match("application/vnd.ms-word")){
                return "vfbam/userclient/css/image/fileType/fileTypePreview/wordDocument.png";
            }
            if(fileType.match("application/vnd.openxmlformats-officedocument.wordprocessingml.document")){
                return "vfbam/userclient/css/image/fileType/fileTypePreview/wordDocument.png";
            }
            //for power point
            if(fileType.match("application/vnd.openxmlformats-officedocument.presentationml.presentation")){
                return "vfbam/userclient/css/image/fileType/fileTypePreview/pptDocument.png";
            }
            if(fileType.match("application/mspowerpoint")){
                return "vfbam/userclient/css/image/fileType/fileTypePreview/pptDocument.png";
            }

            /*
            //for open office
            if(fileType.match("application/vnd.oasis.opendocument.text")){
                return "vfbam/userclient/css/image/fileType/odt.png";
            }
            if(fileType.match("application/vnd.oasis.opendocument.spreadsheet")){
                return "vfbam/userclient/css/image/fileType/ods.png";
            }
            if(fileType.match("application/vnd.oasis.opendocument.presentation")){
                return "vfbam/userclient/css/image/fileType/odp.png";
            }
            //for zip
            if(fileType.match("application/x-zip-compressed")){
                return "vfbam/userclient/css/image/fileType/compressed.gif";
            }
            if(fileType.match("application/zip")){
                //current document type check service can't tell pptx file
                if(this.isSpecialDocumentTypeByCheckPostfix(fileName,"pptx")){
                    return "vfbam/userclient/css/image/fileType/ppt.png";
                }
                return "vfbam/userclient/css/image/fileType/compressed.gif";
            }
            if(fileType.match("multipart/x-zip")){
                return "vfbam/userclient/css/image/fileType/compressed.gif";
            }
            if(fileType.match("application/x-compressed")){
                return "vfbam/userclient/css/image/fileType/compressed.gif";
            }
            //for xml
            if(fileType.match("text/xml")){
                return "vfbam/userclient/css/image/fileType/xml.png";
            }
            if(fileType.match("application/xml")){
                return "vfbam/userclient/css/image/fileType/xml.png";
            }
            */
            return "vfbam/userclient/css/image/fileType/fileTypePreview/genericDocument.png";
        }
    };
})();