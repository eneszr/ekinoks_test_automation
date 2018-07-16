(function() {
	const RTSP_ID = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(2) > div > div > select';
    const RTSP_USER = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(3) > div > div > select';
    const RTSP_APPLY_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(7) > div > div > button';
    const RTSP_OK_SELECTOR = 'body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button';
    const RTSP_CHECKBOX_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div > label > input';
    const RTSP_CHECKBOX_SELECTOR_UP = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div > label';
    module.exports.rtsp_set = async function(page, id, user,set) {
         await page.waitForSelector(RTSP_ID,'visible');
         await page.waitForSelector(RTSP_CHECKBOX_SELECTOR,'visible');
		const input = await page.$(RTSP_CHECKBOX_SELECTOR_UP);
        const inpot = await input.$eval('.ng-pristine' , node => node.checked);                    

        if(inpot!=set){
		await page.click(RTSP_CHECKBOX_SELECTOR);
        }
        await page.click(RTSP_ID);
		await page.keyboard.type(id);
        await page.keyboard.press('Enter');
        await page.waitForSelector(RTSP_USER,'visible'); 
        await page.waitFor(1000);
		await page.click(RTSP_USER);
		await page.keyboard.type(user);
		await page.click(RTSP_APPLY_SELECTOR);
        await page.waitForSelector(RTSP_OK_SELECTOR,'visible'); 
        await page.click(RTSP_OK_SELECTOR);
		
	}
	module.exports.rtsp_set_no = async function(page,set) {
         await page.waitForSelector(RTSP_ID,'visible');
         await page.waitForSelector(RTSP_CHECKBOX_SELECTOR,'visible');
		const input = await page.$(RTSP_CHECKBOX_SELECTOR_UP);
        const inpot = await input.$eval('.ng-pristine' , node => node.checked);                    

        if(inpot!=set){
		await page.click(RTSP_CHECKBOX_SELECTOR);
        }
		await page.click(RTSP_APPLY_SELECTOR);
        await page.waitForSelector(RTSP_OK_SELECTOR,'visible'); 
        await page.click(RTSP_OK_SELECTOR);
		
	}
	
	
}());

