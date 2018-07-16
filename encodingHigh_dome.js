(function() {
    const TRAFFIC_FORMING_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(8) > div > div > label';    
    const TRAFFIC_PRECISION_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(10) > div > div > select';
    const TARFFIC_FREQUENCY_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(12) > div > div > input';
    const APPLY_BUTTON_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(17) > div > div > button';
    const POPUP_BUTTON_SELECTOR='body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button'; 
    const IFRAME_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div > input';
    const BIT_CON_MET = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(2) > div > div > select';
    const CODDING_QUAL = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(3) > div > div > select';
    const BIT_RATE = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(6) > div > div > input';
    const CALC_METHOD = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(4) > div > div > select';
    
        module.exports.traffic_forming= async function(page){
            await page.waitFor(1000);
            const input = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(8) > div > div');
            const inpot = await input.$eval('.ng-valid' , node => node.checked);
            if(inpot==0){
            await page.click(TRAFFIC_FORMING_SELECTOR);  }
            await page.waitFor(1000);
            
        }
         module.exports.precision= async function(page,set){
            await page.click(TRAFFIC_PRECISION_SELECTOR);
            await page.keyboard.type(set);
            await page.keyboard.type('Enter');
            await page.waitFor(2000);
          
        }
    
    
        module.exports.frequency= async function(page,set){
            
            await page.click(TARFFIC_FREQUENCY_SELECTOR);
            for (let i = 0; i < 10; i++)
			await page.keyboard.down('Backspace');
		await page.keyboard.type(set);
            await page.waitFor(2000);
          
        }
        
        module.exports.apply= async function(page){
            
            await page.click(APPLY_BUTTON_SELECTOR);
            await page.waitFor(2000);
            await page.click(POPUP_BUTTON_SELECTOR);
          
        }
        
        
        
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
            await page.keyboard.type('Enter');
            
        }
        
        module.exports.set_codding_quality = async function(page, set)
        {
            
            await page.click(CODDING_QUAL);
            await page.keyboard.type(set);
            await page.keyboard.type('Enter');
          
        }
        
        module.exports.set_bit_rate = async function(page, set) {
		await page.click(BIT_RATE);
		for (let i = 0; i < 20; i++)
                await page.keyboard.down('Backspace');
                await page.keyboard.type(set);
		
	}
	module.exports.set_calc_met = async function(page, set) {
            await page.click(CALC_METHOD);
            await page.keyboard.type(set);
            await page.keyboard.type('Enter');
		
	}

	
	module.exports.apply = async function(page){
            await page.click(APPLY_BUTTON_SELECTOR);
            await page.waitForSelector(POPUP_BUTTON_SELECTOR,'visible');
            await page.click(POPUP_BUTTON_SELECTOR);
            await page.waitFor(1000);
  
        }
        
        /////////////// TEST FUNCTIONS FOR Doc2-33 ///////////////////
        module.exports.test_intraframe_2 = async function(page) {
                        const input1 = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div');
                        const inpot1 = await input1.$eval('.form-control' , node => node.value);
                        if(inpot1 == 12)
                        {
                            console.log("Okunan Intraframe değeri "+inpot1+"        TRUE");
                            return ['12',inpot1,1];
                        }
                        else
                        {
                            console.log("Okunan Intraframe değeri "+inpot1+"        FALSE");
                            return ['12',inpot1,0];
                        }
            
	}
	module.exports.test_bit_con_2 = async function(page, set)
        {
            
            const input2 = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(2) > div > div');
                        const inpot2 = await input2.$eval('.form-control' , node => node.selectedIndex);
                        var text = '';
                        if(inpot2 == 0) text = 'Tanımlanmamış';
                        else if(inpot2 == 1) text = 'CBR'; 
                        else if(inpot2 == 2) text = 'VBR';
 
                        if(inpot2 == 2)
                        {
                            console.log("Okunan Bit kontrol metodu "+text+"       TRUE");
                            return ['VBR',text,1];
                        }
                        else
                        {
                            console.log("Okunan Bit kontrol metodu "+text+"       FALSE");
                            return ['VBR',text,0];
                            
                        }
            
        }
        
        module.exports.test_codding_quality_2 = async function(page, set)
        {
            
           const input3 = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(3) > div > div');
                        const inpot3 = await input3.$eval('.form-control' , node => node.selectedIndex);
                         var text = '';
                        if(inpot3 == 0) text = 'Tanımlanmamış';
                        else if(inpot3 == 1) text = 'TEMEL'; 
                        else if(inpot3 == 2) text = 'ORTA';
                        else if(inpot3 == 3) text = 'YÜKSEK';

                        if(inpot3 == 2)
                        {
                            console.log("Okunan Kodlayıcı kalitesi "+text+"  TRUE");
                            return ['ORTA',text,1];
                        }
                        else
                        {
                            console.log("Okunan Kodlayıcı kalitesi "+text+"  FALSE");
                            return ['ORTA',text,0];
                            
                        }
          
        }
        
       
	module.exports.test_calc_method_2 = async function(page, set) {
		const input5 = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(4) > div > div');
                        const inpot5 = await input5.$eval('.form-control' , node => node.selectedIndex);
                         var text = '';
                        if(inpot5 == 0) text = 'Tanımlanmamış';
                        else if(inpot5 == 1) text = 'Tanımlı bitrate değerine göre'; 
                        else if(inpot5 == 2) text = 'Görüntü kalitesine göre';
                       
                        if(inpot5 == 2)
                        {
                            console.log("Bitrate Hesaplama Metodu "+text+" TRUE");
                             await page.waitFor(2000);
                            const input6 = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(5) > div > div');
                            const inpot6 = await input6.$eval('.form-control' , node => node.selectedIndex);
                             var text2 = '';
                        if(inpot6 == 0) text2 = 'Tanımlanmamış';
                        else if(inpot6 == 1) text2 = '25'; 
                        else if(inpot6 == 2) text2 = '50';
                        else if(inpot6 == 3) text2 = '75';
                        else if(inpot6 == 4) text2 = '100';
                            if(inpot6 == 3)
                            {
                                console.log("Okunan Video kalite yüzdesi "+text2+" TRUE");
                                return ['Görüntü kalitesine göre',text,1,'75',text2,1];
                            }
                            else
                            {
                            console.log("Okunan Video kalite yüzdesi "+text2+" FALSE");
                            return ['Görüntü kalitesine göre',text,1,'75',text2,0];
                            }
                            
                        }
                        else
                        {
                            console.log("Okunan Bitrate Hesaplama Metodu "+text+" FALSE");
                             await page.waitFor(2000);
                            return ['Görüntü kalitesine göre',text,0,'75','undefined',0];
                            
                        }
		
	}
	
	
	 module.exports.test_bit_rate_2 = async function(page, set) {
		const input4 = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(6) > div > div');
                        const inpot4 = await input4.$eval('.form-control' , node => node.value);
                        if(inpot4 == 3.46)
                        {
                            console.log("Okunan Bit Rate "+inpot4+"          TRUE");
                            return [3.46,inpot4,1];
                        }
                        else
                        {
                            console.log("Okunan Bit Rate "+inpot4+"        FALSE");
                            return [3.46,inpot4,0];
                            
                        }
		
	}
	
}());