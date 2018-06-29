  (function() {

        const PROFILE_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(1) > div > div > select';
	const CODDER_STREAM_MODE = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(2) > div > div > select';
	const STREAM_RESOLUTION1_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(3) > div > div > select';
        const STREAM_RESOLUTION2_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(5) > div > div > select';
        const STREAM_FPS1_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(4) > div > div > select';
        const STREAM_FPS2_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(6) > div > div > select';
        const APPLY_BUTTON_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(11) > div > div > button';
        const POPUP_SELECTOR = 'body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button'
        
	module.exports.set_profile = async function(page, set) 
        {
            await page.click(PROFILE_SELECTOR);
            await page.keyboard.type(set);
            await page.keyboard.type('Enter');
            
	}
	
	module.exports.set_stream_mode = async function(page, set)
        {
            
            await page.click(CODDER_STREAM_MODE);
            await page.keyboard.type(set);
            await page.keyboard.type('Enter');
            
        }
        
        module.exports.set_resolution1 = async function(page, set)
        {
            
            await page.click(STREAM_RESOLUTION1_SELECTOR);
            await page.keyboard.type(set);
            await page.keyboard.type('Enter');
          
        }
        module.exports.set_resolution2 = async function(page, set)
        {
            
            await page.click(STREAM_RESOLUTION2_SELECTOR);
            await page.keyboard.type(set);
            await page.keyboard.type('Enter');
          
        }
        module.exports.set_fps1 = async function(page, set) 
        {
            await page.click(STREAM_FPS1_SELECTOR);
            await page.keyboard.type(set);
            await page.keyboard.type('Enter');
	}
	module.exports.set_fps2 = async function(page, set) 
        {
            await page.click(STREAM_FPS2_SELECTOR);
            await page.keyboard.type(set);
            await page.keyboard.type('Enter');
	}
	module.exports.apply = async function(page){
            await page.click(APPLY_BUTTON_SELECTOR);
            await page.waitForSelector(POPUP_SELECTOR,'visible');
            await page.click(POPUP_SELECTOR);
            await page.waitFor(1000);
        
        }
        
        
        ///// RESOLUTİON TEST //////////
        
        module.exports.test_profile = async function(page) 
        {
                        const input = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(1) > div > div');
                        const inpot = await input.$eval('.form-control' , node => node.selectedIndex);
                        if(inpot == 1)
                        {
                            console.log("Profile Value is           TRUE");
                        }
                        else
                        {
                            console.log("Profile Value is           FALSE");
                            
                        }
            
	}
	module.exports.test_stream_mode = async function(page)
        {
            
                        const input = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(2) > div > div');
                        const inpot = await input.$eval('.form-control' , node => node.selectedIndex);
                        if(inpot == 3)
                        {
                            console.log("Stream Mode Value is       TRUE");
                        }
                        else
                        {
                            console.log("Stream Mode Value is       FALSE");
                            
                        }
        }
        
        module.exports.test_resolution1 = async function(page)
        {
            
                        const input = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(3) > div > div');
                        const inpot = await input.$eval('.form-control' , node => node.selectedIndex);
                        if(inpot == 1)
                        {
                            console.log("Resolution 1 Value is      TRUE");
                        }
                        else
                        {
                            console.log("Resolution 1 Value is      FALSE");
                            
                        }
          
        }
        
        module.exports.test_fps1 = async function(page) 
        {
                        const input = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(4) > div > div');
                        const inpot = await input.$eval('.form-control' , node => node.selectedIndex);
                        if(inpot == 3)
                        {
                            console.log("FPS 1 Value is             TRUE");
                        }
                        else
                        {
                            console.log("FPS 1 Value is             FALSE");
                            
                        }
	}
	 module.exports.test_resolution2 = async function(page)
        {
            
                        const input = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(5) > div > div');
                        const inpot = await input.$eval('.form-control' , node => node.selectedIndex);
                        if(inpot == 1)
                        {
                            console.log("Resolution 2 Value is      TRUE");
                        }
                        else
                        {
                            console.log("Resolution 2 Value is      FALSE");
                            
                        }
          
        }
        
        module.exports.test_fps2 = async function(page) 
        {
                        const input = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(6) > div > div');
                        const inpot = await input.$eval('.form-control' , node => node.selectedIndex);
                        if(inpot == 3)
                        {
                            console.log("FPS 2 Value is             TRUE");
                        } 
                        else
                        {
                            console.log("FPS 2 Value is             FALSE");
                            
                        }
	}
	
        
	
}());


