 const puppeteer = require('puppeteer');

(function() {
	const URL = "10.5.177.47";
	const TAB_ENCODINGH_URL = 'http://'+URL+':8080/#/tabs/encoding.json';
        const TAB_ENCODINGL_URL = 'http://'+URL+':8080/#/tabs/encoding_low.json';
	const TAB_VERSION_URL = 'http://'+URL+':8080/#/tabs/version_info.json';
        const TAB_RESOLUTION_URL = 'http://'+URL+':8080/#/tabs/resolution.json';
	const TAB_CAMERA_URL = 'http://'+URL+':8080/#/tabs/ptz_next.json';
        const TAB_LIVE_URL = 'http://'+URL+':8080/#/tabs/live_view.json';
        const TAB_ALARM_URL = 'http://'+URL+':8080/#/tabs/alarm.json';
        const TAB_TIME_URL = 'http://'+URL+':8080/#/tabs/time_settings.json';
        const SELECTOR_select = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(1) > div > div > select';
        const SELECTOR_input = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(1) > div > div > input';
        const SELECTOR_camera = '#current_device';
        const SELECTOR_child2_select = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(2) > div > div > select';
	module.exports.toEncodingHigh = async function(page) {
		await page.goto(TAB_ENCODINGH_URL);
                await page.waitForSelector(SELECTOR_input,'visible');
	}
	module.exports.toLive = async function(page) {
		await page.goto(TAB_LIVE_URL);
                await page.waitForSelector(SELECTOR_select,'visible');
	}
	module.exports.toEncodingLow = async function(page) {
		await page.goto(TAB_ENCODINGL_URL);
                await page.waitForSelector(SELECTOR_input,'visible');
	}
	
	module.exports.toVersion = async function(page) {
		await page.goto(TAB_VERSION_URL);
                await page.waitForSelector(SELECTOR_input,'visible');
	}
	
	module.exports.toResolution = async function(page) {
		await page.goto(TAB_RESOLUTION_URL);
                await page.waitForSelector(SELECTOR_select,'visible');
	}
	module.exports.toCamera = async function(page) {
                await page.goto(TAB_CAMERA_URL);
                await page.waitForSelector(SELECTOR_camera,'visible');
	}
	module.exports.toAlarm = async function(page) {
                await page.goto(TAB_ALARM_URL);
                await page.waitForSelector(SELECTOR_child2_select,'visible');
	}
	module.exports.toTime = async function(page) {
                await page.goto(TAB_TIME_URL);
                await page.waitForSelector(SELECTOR_child2_select,'visible');
	}
	
}());
