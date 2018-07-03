(function() {
    const TAB_DOME_CAMERA_SELECTOR ='body > div > div:nth-child(3) > div.col-md-8 > div.ng-isolate-scope > ul > li:nth-child(4) > a';
    const TAB_DOME_VERSION_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.ng-isolate-scope > ul > li:nth-child(15) > a';
    const TAB_WATCH_CAMERA_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.ng-isolate-scope > ul > li:nth-child(1) > a';
    const TAB_ENCODING_HIGH_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.ng-isolate-scope > ul > li:nth-child(5) > a';
    const TAB_TIME_SETTINGS_SELECTOR ='body > div > div:nth-child(3) > div.col-md-8 > div.ng-isolate-scope > ul > li:nth-child(3) > a';
    const TAB_ENCODINGL_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.ng-isolate-scope > ul > li:nth-child(6) > a';
    const TAB_RESOLUTION_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.ng-isolate-scope > ul > li:nth-child(7) > a';
    
        module.exports.toDomeCamera = async function(page) {
		await page.click(TAB_DOME_CAMERA_SELECTOR);
		await page.waitFor(1000);
	}
	
	module.exports.toDomeVersion = async function(page) {
		await page.click(TAB_DOME_VERSION_SELECTOR);
		await page.waitFor(2000);
	}
	
	module.exports.toWatchCamera = async function(page) {
		await page.click(TAB_WATCH_CAMERA_SELECTOR);
		await page.waitFor(2000);
	}
	
	module.exports.toDomeEncodingHigh = async function(page) {
		await page.click(TAB_ENCODING_HIGH_SELECTOR);
		await page.waitFor(2000);
	}
	    
        module.exports.toTimeSettings = async function(page) {
		await page.click(TAB_TIME_SETTINGS_SELECTOR);
		await page.waitFor(2000);
	}
	
	module.exports.toDomeEncodingLow = async function(page) {
		await page.click(TAB_ENCODINGL_SELECTOR);
		await page.waitFor(2000);
	}
	module.exports.toResolution = async function(page) {
		await page.click(TAB_RESOLUTION_SELECTOR);
		await page.waitFor(2000);
	}
	
}());
