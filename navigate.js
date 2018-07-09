 const puppeteer = require('puppeteer');

(function() {
	
        var URL ;
        const SELECTOR_select = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div > select';
        const SELECTOR_input = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div > input';
        const SELECTOR_camera = '#t01 > tbody > tr:nth-child(2) > td:nth-child(2) > button';
        const SELECTOR_child2_select = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(2) > div > div > select';
	module.exports.toEncodingHigh = async function(page,ip) {
URL = ip;
		await page.goto('http://'+URL+':8080/#/tabs/encoding.json');
                await page.waitForSelector(SELECTOR_input,'visible');
	}
	module.exports.toLive = async function(page,ip) {
            URL = ip;

		await page.goto('http://'+URL+':8080/#/tabs/live_view.json');
                await page.waitForSelector(SELECTOR_input,'visible');        
                await page.waitFor(2000);

	}
	module.exports.toEncodingLow = async function(page,ip) {
                URL = ip;

		await page.goto('http://'+URL+':8080/#/tabs/encoding_low.json');
                await page.waitForSelector(SELECTOR_input,'visible');
	}
	
	module.exports.toVersion = async function(page,ip) {
            URL = ip;
		await page.goto('http://'+URL+':8080/#/tabs/version_info.json');
                await page.waitForSelector(SELECTOR_input,'visible');
	}
	
	module.exports.toResolution = async function(page,ip) {
            URL = ip;
		await page.goto('http://'+URL+':8080/#/tabs/resolution.json');
                await page.waitForSelector(SELECTOR_select,'visible');
	}
	module.exports.toCamera = async function(page,ip) {
                URL = ip;
                await page.goto('http://'+URL+':8080/#/tabs/ptz_next.json');
                await page.waitForSelector(SELECTOR_camera,'visible');
	}
	module.exports.toAlarm = async function(page,ip) {
                URL = ip;
                await page.goto('http://'+URL+':8080/#/tabs/alarm.json');
                await page.waitForSelector(SELECTOR_child2_select,'visible');
	}
	module.exports.toTime = async function(page,ip) {
                URL = ip;
                await page.goto('http://'+URL+':8080/#/tabs/time_settings.json');
                await page.waitForSelector(SELECTOR_child2_select,'visible');
	}
	module.exports.toRTSP = async function(page,ip){
                URL = ip;
                await page.goto('http://'+URL+':8080/#/tabs/rtsp_manag.json');
                await page.waitForSelector(SELECTOR_child2_select,'visible');
    }
	
}());
