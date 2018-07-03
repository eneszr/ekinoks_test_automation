(function() {
    const NP_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(3) > div > div > input';
    const TIME_SETTINGS_APPLY_BUTTON='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(8) > div > div > button';
    const POPUP_BUTTON='body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button';

	
	module.exports.test_np1_value = async function(page) {
                const input1 = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(3) > div > div');
                const inpot1 = await input1.$eval('.form-control' , node => node.value);
                if(inpot1 =="Merkez için 13.13.23.1, Kovancılar için 13.13.23.8")
                        {
                            console.log("NP Sunucu1 Value is        TRUE");
                        }
                else
                        {
                            console.log("NP Sunucu1 Value is        FALSE");
                            
                        }
            
	}
	
	module.exports.apply = async function(page) {
                await page.click(TIME_SETTINGS_APPLY_BUTTON);
                await page.waitFor(2000);
                await page.click(POPUP_BUTTON);
                await page.waitFor(2000);
            
        }

}()); 