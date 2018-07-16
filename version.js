  (function() {

        const APPLICATION_SELECTOR_UP = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div';
	const FIRMWARE_SELECTOR_UP= 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(10) > div > div';
	        
        module.exports.test_application = async function(page) 
        {
                        const input = await page.$(APPLICATION_SELECTOR_UP);
                        const inpot = await input.$eval('.form-control' , node => node.value);
                        console.log("APPLICATION VERSION");
                        console.log(inpot);
                        console.log("");
                        return inpot;
            
	}
	module.exports.test_firmware = async function(page) 
        {
                        const input = await page.$(FIRMWARE_SELECTOR_UP);
                        const inpot = await input.$eval('.form-control' , node => node.value);
                        
                        console.log("FIRMWARE VERSION");
                        console.log(inpot);
                        console.log("");
                        return inpot;
            
        }
	
    
}());


 

