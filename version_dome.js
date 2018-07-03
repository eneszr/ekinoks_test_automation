(function() {
    const RELOAD_BUTTON_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(14) > div > div > button';
    const BUTTON_RELOAD_YES='body > div.bootbox.modal.fade.bootbox-confirm.in > div > div > div.modal-footer > button.btn.btn-primary'
    
     module.exports.reload = async function(page) {
		await page.click(RELOAD_BUTTON_SELECTOR);
                await page.waitFor(2000);
                await page.click(BUTTON_RELOAD_YES);
                console.log(".....CAMERA IS RESTARTING.....");
		//await page.waitFor(2000);
	}
    
}());