  (function() {

	const MOTION_DETECTOR_SELECTOR_UP= 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(9) > div > div';
	const MOTION_DETECTOR_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(9) > div > div > select';    
	const MOTION_TRESHOLD_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(10) > div > div > input';    
        const APPLY_BUTTON_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(12) > div > div > button';
        const POPUP_SELECTOR = 'body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button'
        const ALARM_ACTIVE = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(8) > div > div > label > input';
        const ALARM_ACTIVE_UP = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(8) > div > div > label';
	module.exports.test_alarm_active = async function(page)
        {
                        const input = await page.$(ALARM_ACTIVE_UP);
                        const inpot = await input.$eval('.ng-valid' , node => node.checked);
                        return inpot;
        }
        module.exports.set_alarm_active = async function(page)
        {
                        await page.click(ALARM_ACTIVE);
        }
        module.exports.test_sei_selected = async function(page) 
        {
                        
            const input1 = await page.$(MOTION_DETECTOR_SELECTOR_UP);
            const inpot1 = await input1.$eval('.form-control' , node => node.value);
            if(inpot1 == 2)
            {
                console.log("Hareket Tespit Değeri.....DOĞRU");
                return 1;
            }
            else
            {
                console.log("Hareket Tespit Değeri.....YANLIŞ");
                return 0;
            }
        }
	
         module.exports.set_motion_detector = async function(page , set)
        {
            await page.click(MOTION_DETECTOR_SELECTOR);
            await page.keyboard.type(set);
            await page.keyboard.down('Enter');
            

            
        }
        module.exports.set_motion_treshold = async function(page , set)
        {
            await page.click(MOTION_TRESHOLD_SELECTOR);
            for (let i = 0; i < 20; i++)
            await page.keyboard.down('Backspace');
            await page.keyboard.type(set);
        }
        module.exports.set_apply = async function(page)
        {
            await page.click(APPLY_BUTTON_SELECTOR);
            await page.waitForSelector(POPUP_SELECTOR,'visible');
            await page.click(POPUP_SELECTOR);
            await page.waitFor(1000);
            
        }
	
	
    
}());


 

