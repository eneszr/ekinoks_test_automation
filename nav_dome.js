(function() {
        const SELECTOR_select = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div > select';
        const SELECTOR_input = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div > input';
        const SELECTOR_camera = '#t01 > tbody > tr:nth-child(2) > td:nth-child(2) > button';
        const SELECTOR_child2_select = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(2) > div > div > select';
    
        module.exports.toDomeCamera = async function(page,ip) {
                URL = ip;	
                await page.goto('http://'+URL+':8080/#/tabs/ptz_next.json');
                await page.waitForSelector(SELECTOR_camera,'visible');
                await page.waitFor(500);
	}
	
	module.exports.toDomeVersion = async function(page,ip) {
                URL = ip;	
                await page.goto('http://'+URL+':8080/#/tabs/version_info.json');
                await page.waitForSelector(SELECTOR_input,'visible');
	}
	module.exports.toWatchCamera = async function(page,ip) {
                URL = ip;	
                await page.goto('http://'+URL+':8080/#/tabs/live_view.json');
                await page.waitForSelector(SELECTOR_input,'visible');
	}
	module.exports.toDomeEncodingHigh = async function(page,ip) {
                URL = ip;
                await page.goto('http://'+URL+':8080/#/tabs/encoding.json');
                await page.waitForSelector(SELECTOR_input,'visible');
	}
	    
        module.exports.toTimeSettings = async function(page,ip) {
		URL = ip;
                await page.goto('http://'+URL+':8080/#/tabs/time_settings.json');
                await page.waitForSelector(SELECTOR_select,'visible');
	}
	
	module.exports.toDomeEncodingLow = async function(page,ip) {
		URL = ip;
                await page.goto('http://'+URL+':8080/#/tabs/encoding_low.json');
                await page.waitForSelector(SELECTOR_input,'visible');
	}
	module.exports.toResolution = async function(page,ip) {
		URL = ip;
                await page.goto('http://'+URL+':8080/#/tabs/resolution.json');
                await page.waitForSelector(SELECTOR_select,'visible');
	}
	
}());
