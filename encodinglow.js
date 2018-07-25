  (function() {

        const IFRAME_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div > input';
	const APPLY_BUTTON_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(9) > div > div > button';
	const POPUP_SELECTOR = 'body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button';
        const BIT_CON_MET = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(2) > div > div > select';
        const CODDING_QUAL = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(3) > div > div > select';
        const BIT_RATE = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(6) > div > div > input';
        ///FOR TESTS
        const IFRAME_SELECTOR_UP = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div';
        const BIT_CON_MET_UP = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(2) > div > div';
        const CODDING_QUAL_UP = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(3) > div > div';
        const BIT_RATE_UP = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(6) > div > div';
        const BIT_CALC_MET = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(4) > div > div > select';
	module.exports.set_intraframe = async function(page, iFrameInterval) {
		await page.click(IFRAME_SELECTOR);
		for (let i = 0; i < 10; i++)
			await page.keyboard.down('Backspace');
		await page.keyboard.type(iFrameInterval);
            
	}
	module.exports.set_bit_con = async function(page, set)
        {
            
            await page.click(BIT_CON_MET);
            await page.keyboard.type(set);
            await page.keyboard.type("Enter");
            await page.click(BIT_CON_MET);
            
        }
        
        module.exports.set_codding_quality = async function(page, set)
        {
            
            await page.click(CODDING_QUAL);
            await page.keyboard.type(set);
            await page.keyboard.type("Enter");
            await page.click(CODDING_QUAL);
          
        }
        
        module.exports.set_bit_rate = async function(page, set) {
		await page.click(BIT_RATE);
		for (let i = 0; i < 10; i++)
                    await page.keyboard.down('Backspace');
                    await page.keyboard.type(set);
		
	}
	
	module.exports.apply = async function(page){
            await page.click(APPLY_BUTTON_SELECTOR);
            await page.waitForSelector(POPUP_SELECTOR,'visible');
            await page.click(POPUP_SELECTOR);
            await page.waitFor(1000);
            
        }
        	module.exports.set_calc_method = async function(page, set) {
		await page.click(BIT_CALC_MET);
            await page.keyboard.type(set);
            await page.keyboard.type(set);
            await page.click(BIT_CALC_MET);
		
	}
        
        //////////////  ENCODİNG LOW TEST ////////////////
        
          module.exports.test_intraframe = async function(page) {
                        const input1 = await page.$(IFRAME_SELECTOR_UP);
                        const inpot1 = await input1.$eval('.form-control' , node => node.value);
                        if(inpot1 == 12)
                        {
                            console.log("Intraframe Aralığı Değeri.....DOĞRU");
                            return 1;
                        }
                        else
                        {
                            console.log("Intraframe Aralığı Değeri.....YANLIŞ");
                            return 0;
                        }
            
	}
	module.exports.test_bit_con = async function(page, set)
        {
            
            const input2 = await page.$(BIT_CON_MET_UP);
                        const inpot2 = await input2.$eval('.form-control' , node => node.selectedIndex);
                        if(inpot2 == 2)
                        {
                            console.log("Bitrate Kontrol Metodu.....DOĞRU");
                            return 1;
                        }
                        else
                        {
                            console.log("Bitrate Kontrol Metodu.....YANLIŞ");
                            return 0;
                        }
            
        }     
      
        module.exports.test_bit_rate = async function(page, set) {
		const input4 = await page.$(BIT_RATE_UP);
                        const inpot4 = await input4.$eval('.form-control' , node => node.value);
                        if(inpot4 == 0.477)
                        {
                            console.log("Bitrate Değeri.....DOĞRU");
                            return 1;
                        }
                        else
                        {
                            console.log("Bitrate Değeri.....YANLIŞ");
                            return 0;
                        }
		
	}
	
	
	 module.exports.test_codding_quality = async function(page, set)
        {
            
           const input3 = await page.$(CODDING_QUAL_UP);
                        const inpot3 = await input3.$eval('.form-control' , node => node.selectedIndex);
                        if(inpot3 == 3)
                        {
                            console.log("Kodlayıcı Kalitesi.....DOĞRU");
                            return 1;
                        }
                        else
                        {
                            console.log("Kodlayıcı Kalitesi.....YANLIŞ");
                            return 0;
                        }
          
        }
	
}());


