var bidiOptions = {
  def: {label: 'BiDi (default)\u200e', name: null, code: null, direction: null},
  ltr: {label: 'BiDi (LTR)\u200e', name: 'Left to Right', code: 'ltr', direction: 'ltr'},
  rtl: {label: 'BiDi (RTL)\u200e', name: 'Right to Left', code: 'rtl', direction: 'rtl'}
};

var a11yOptions = {
		def: {label: 'A11y (default)\u200e', name: null, code: null, activated: null},
		"true": {label: 'A11y (on)\u200e', name: 'On', code: 'true', activated: true},
		"false": {label: 'A11y (off)\u200e', name: 'Off', code: 'false', activated: false}
};

var bidiDirection = bidiOptions.def;
var a11yMode = a11yOptions.def;

function queryToObject(str) {
	// NOTE: The implementation below is taken directly from Dojo 1.7.2's dojo/io-query
    var dec = decodeURIComponent, qp = str.split("&"), ret = {}, name, val;
    for(var i = 0, l = qp.length, item; i < l; ++i){
        item = qp[i];
        if(item.length){
            var s = item.indexOf("=");
            if(s < 0){
                name = dec(item);
                val = "";
            }else{
                name = dec(item.slice(0, s));
                val  = dec(item.slice(s + 1));
            }
            if(typeof ret[name] == "string"){ // inline'd type check
                ret[name] = [ret[name]];
            }

            if(ret[name] && (ret[name] instanceof Array || typeof ret[name] == "array")){
                ret[name].push(val);
            }else{
                ret[name] = val;
            }
        }
    }
    return ret; // Object
}

function parseCurrentURL() {
	var result = {};
	result.wholeURL = "" + document.location;
	var currentURL  = result.wholeURL;
	result.queryParams = null;
	var anchorIndex = currentURL.indexOf('#');
	result.urlAnchors  = "";
	if ((anchorIndex > 0) && (anchorIndex < (currentURL.length - 1))) {
		result.urlAnchors = currentURL.substring(anchorIndex);
		currentURL = currentURL.substring(0, anchorIndex);
	}
	result.baseURL  = currentURL;
	var queryIndex  = currentURL.indexOf('?');
	if ((queryIndex > 0) && (queryIndex < (currentURL.length - 1))) {
		result.baseURL = currentURL.substring(0, queryIndex);
		var suffix = currentURL.substr(queryIndex+1);
		result.queryParams = queryToObject(suffix);
		if (bidiOptions[result.queryParams.dir]) {
			result.bidiDirection = bidiOptions[result.queryParams.dir];
		}
		if (a11yOptions[result.queryParams.a11y]) {
			result.a11yMode = a11yOptions[result.queryParams.a11y];
		}
	}
	return result;
}

var initialURL = parseCurrentURL();
if (initialURL.bidiDirection) {
	bidiDirection = initialURL.bidiDirection;
	if ((bidiDirection) && (bidiDirection.direction != null)) {
		$("html, body").attr("dir", bidiDirection.direction);
		if(bidiDirection.direction === "rtl"){
			$("<link>").attr({
				"href": "../themes/less/dthink-rtl.css",
				"rel": "stylesheet"
			}).appendTo("head");
		}
	}
}
if (initialURL.a11yMode) a11yMode = initialURL.a11yMode;	

