 (function() {
	const MASK_ID_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(3) > div > div > select';
	const MASK_WIDTH_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(4) > div > div > input';
	const MASK_HEIGHT_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(5) > div > div > input';
    const MASK_VISIBLE_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(6) > div > div > label > input';
    const MASK_UP_SELECTOR = '#mask_up';
    const MASK_DOWN_SELECTOR = '#mask_down';
    const MASK_RIGHT_SELECTOR = '#mask_right';
    const MASK_LEFT_SELECTOR = '#mask_left';
    const MASK_REFRESH = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(7) > div > div > button';
    const MASK_APPLY = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(9) > div > div > button';
    const POPUP_SELECTOR = 'body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button';
	module.exports.select_mask = async function(page, i) {
		var maskid = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
        await page.click(MASK_ID_SELECTOR);
        await page.keyboard.type("Lütfen");
        await page.waitFor(5000);
        await page.keyboard.type(maskid[i]); console.log("ok " + maskid[i]);
		await page.waitFor(5000);
        await page.keyboard.type('Enter');
	}
	module.exports.mask_size = async function(page, width, height){
		await page.click(MASK_WIDTH_SELECTOR);
        for(let i = 0; i<5; i++){ 
            await page.keyboard.press('Backspace');
            await page.waitFor(250);
        }
        await page.keyboard.type(width);
        await page.waitFor(500);
		await page.keyboard.press("Enter");
        await page.waitFor(1000);
        await page.click(MASK_HEIGHT_SELECTOR);
        for(let i = 0; i<5; i++){ 
            await page.keyboard.press('Backspace');
            await page.waitFor(250);
        }
		await page.keyboard.type(height);
        await page.waitFor(500);
		await page.keyboard.press("Enter");
        await page.waitFor(1000);
	}
	module.exports.mask_visible = async function(page)
    {
        await page.click(MASK_VISIBLE_SELECTOR);
    }
    module.exports.mask_up = async function(page)
    {
        await page.click(MASK_UP_SELECTOR); 
    }
    module.exports.mask_down = async function(page)
    {
        await page.click(MASK_DOWN_SELECTOR); 
    }
    module.exports.mask_right = async function(page)
    {
        await page.click(MASK_RIGHT_SELECTOR); 
    }
    module.exports.mask_left = async function(page)
    {
        await page.click(MASK_LEFT_SELECTOR); 
    }
    module.exports.mask_refresh = async function(page)
    {
        await page.click(MASK_REFRESH);
    }
    module.exports.mask_apply = async function(page)
    {
        await page.click(MASK_APPLY);
    }
	module.exports.mask_popup = async function(page)
    {
        await page.click(POPUP_SELECTOR);
    }
	
}());

