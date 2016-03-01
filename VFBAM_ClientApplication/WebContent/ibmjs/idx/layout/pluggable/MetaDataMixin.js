/**
 * 
 */
define([
    "dojo/_base/lang",
    "dojo/request/xhr",
    "dojo/_base/json",
    "./_FlipCardUtils"
], function( lang, xhr, baseJson, _FlipCardUtils){
	return {
		
		defaultServerPath: "FlipCardSaveData.php",
		defaultFileName: "flipcard_default_metadata.json",
		
		defaultDownloadPath: "FlipCardDownload.php",
		defaultDownloadName: "flipcard_download_metadata.json",
		
		
		saveMetadataAs: function(fileName){
			fileName = fileName || this.defaultDownloadName;
			
			xhr.post(this.defaultServerPath, {
				// handleAs: "json",
				sync: false,
				data: {
					filename: fileName, 
					data: this.getMetadata(true)
				}
			}).then(lang.hitch(this, function(data){
				window.open(this.defaultDownloadPath + "?filename="+fileName);
			}), lang.hitch(this, function(error){
				console.log(error);
			}));
		},
		
		loadMetadataAs: function(metadata){
			var fccData = baseJson.fromJson(metadata);
			this.buildFlipCardContainer(fccData);
		},
		
		
		saveMetadata: function(fileName){
			fileName = fileName || this.defaultFileName;
			
			xhr.post(this.defaultServerPath, {
				// handleAs: "json",
				sync: true,
				data: {
					filename: fileName, 
					data: this.getMetadata(true)
				}
			}).then(lang.hitch(this, function(data){
				alert(this._nlsResource.savedSuccessfully + ", result message " + data);
			}), lang.hitch(this, function(error){
				console.log(error);
			}));
			
		},
		
		loadMetadata: function(fileName){
			fileName = fileName || this.defaultFileName;
			
			xhr.get(fileName, {
				// handleAs: "json",
				sync: true
			}).then(lang.hitch(this, function(data){
				var fccData = baseJson.fromJson(data);
				this.buildFlipCardContainer(fccData);
				console.log(this._nlsResource.loadedSuccessfully);
			}), lang.hitch(this, function(error){
				console.log(error);
			}));
		},
		
		/**
		 * get the flip card container's metadata.
		 */
		getMetadata: function(context){
			this.metadata = {
				includeHeader: this.includeHeader,
				fcContainerHeaderHeight: this.fcContainerHeaderHeight,
				fcContainerNavBarWidth: this.fcContainerNavBarWidth,
				fcContainerNavBarDisplayed: this.fcContainerNavBarDisplayed,
				fcCntNavBarToggleAction: this.fcCntNavBarToggleAction,
                navExpanderWidth: this.navExpanderWidth,
				ignoreInitHash: this.ignoreInitHash,
				flipCardModelId: this.flipCardModelId,
				navType: this.navType,
				fcTitle: this.fcTitle,
				initItemId: this.initItemId,
				defaultCntContainerType: this.defaultCntContainerType,
				model: this.model,
				navigationProps: this.navigationProps,
				lazyLoading: this.lazyLoading,
				defaultServerPath: this.defaultServerPath,
				defaultFileName: this.defaultFileName,
				defaultDownloadPath: this.defaultDownloadPath,
				defaultDownloadName: this.defaultDownloadName,
				css3AnimationDisabled_nav: this.css3AnimationDisabled_nav,
				css3AnimationDisabled_container: this.css3AnimationDisabled_container,
				css3AnimationDisabled_card: this.css3AnimationDisabled_card,
				css3AnimationDisabled: this.css3AnimationDisabled,
				
				animationDuration: this.animationDuration
			};
			
			this.metadata.navList = this.navigatorAdapter.doWithAdapter("getMetadata");
			
			if(this.fcContentContainers && !_FlipCardUtils.isObjectEmpty(this.fcContentContainers)){
				this.metadata.contentContainerList = {};
				for(var gKey in this.fcContentContainers){
					var gWidget = this.fcContentContainers[gKey];
					this.metadata.contentContainerList[gKey] = gWidget.getMetadata();
				}
			}
			
			if(context){
				return baseJson.toJson(this.metadata);
			}else{
				return this.metadata;
			}
		},
		
		
		
		/**
		 * clear the saved layout of the flip card container.
		 */
		clearFlipCard: function(){
			if(localStorage){
				localStorage.removeItem(this.flipCardModelId);
			}else{
				cookie(this.flipCardModelId, null, {expires: -1});
			}
			alert(this._nlsResource.savedLayoutCleared);
		},
		/**
		 * save the layout of the flip card container.
		 */
		saveFlipCard: function(){
			var saveContent = this.getMetadata(true);
			this.storage(this.flipCardModelId, saveContent);
			alert(this._nlsResource.savedSuccessfully);
		},
		/**
		 * persistence support.
		 * @param {String} key
		 * @param {Object} value
		 */
		storage: function(key, value){
			if(value){
				if(localStorage){
					localStorage.setItem(key, value);
				}else{
					cookie(key, value, {expires: 999 });
				}
			}else{
				if(localStorage){
					return localStorage.getItem(key);
				}else{
					return cookie(key);
				}
			}
		}
	};
});