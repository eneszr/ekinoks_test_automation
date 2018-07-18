  (function() {
        ///FOR SETS
        const PROFILE_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div > select';
	const STREAM_RESOLUTION1_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(2) > div > div > select';
        const STREAM_RESOLUTION2_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(4) > div > div > select';
        const STREAM_FPS1_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(3) > div > div > select';
        const STREAM_FPS2_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(5) > div > div > select';
        ///FOR TESTS
        const PROFILE_SELECTOR_UP = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div';
	const STREAM_RESOLUTION1_SELECTOR_UP = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(2) > div > div';
        const STREAM_RESOLUTION2_SELECTOR_UP = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(4) > div > div';
        const STREAM_FPS1_SELECTOR_UP = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(3) > div > div';
        const STREAM_FPS2_SELECTOR_UP = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(5) > div > div';
        const APPLY_BUTTON_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(10) > div > div > button';
        const POPUP_SELECTOR = 'body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button'
        
	module.exports.set_profile = async function(page, set) 
        {
            await page.click(PROFILE_SELECTOR);
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
        
        module.exports.test_profile = async function(page,set) 
        {
                        const input = await page.$(PROFILE_SELECTOR_UP);
                        const inpot = await input.$eval('.form-control' , node => node.selectedIndex);
                        text = ["Tanımlı Değil","1080p12.5 H.264  360p12.5 H.264 dual stream,360p12 MJPEG","M-JPEG"];
                        
                        if(inpot == set)
                        {
                            console.log("Profile      Value TRUE  --> "+text[inpot]);
                            return [text[set],text[inpot],1];
                        }
                        else
                        {
                            console.log("Profile      Value FALSE --> "+text[inpot]);
                            return [text[set],text[inpot],0];
                        }
            
	}
	
        module.exports.test_resolution1 = async function(page,set)
        {
            
                        const input = await page.$(STREAM_RESOLUTION1_SELECTOR_UP);
                        const inpot = await input.$eval('.form-control' , node => node.selectedIndex);
                        text = ["Tanımlı Değil","1920x1080 Max:25fps","1920x1080 Max:30fps","1280x720 Max:25fps","1280x720 Max:30fps"];
                     
                        if(inpot == set)
                        {
                            console.log("Resolution 1 Value TRUE  --> "+text[inpot]);
                            return [text[set],text[inpot],1];
                        }
                        else
                        {
                            console.log("Resolution 1 Value FALSE --> "+text[inpot]);
                            return [text[set],text[inpot],0];
                        }
          
        }
        
        module.exports.test_fps1 = async function(page,set) 
        {
                        const input = await page.$(STREAM_FPS1_SELECTOR_UP);
                        const inpot = await input.$eval('.form-control' , node => node.selectedIndex);
                        text = ["Tanımlı Değil","5","10","12.5","15","20","25","30"];
                        
                        if(inpot == set)
                        {
                            console.log("FPS1         Value TRUE  --> "+text[inpot]);
                            return [text[set],text[inpot],1];
                        }
                        else
                        {
                            console.log("FPS1         Value FALSE --> "+text[inpot]);
                            return [text[set],text[inpot],0];
                        }
	}
	 module.exports.test_resolution2 = async function(page,set)
        {
            
                        const input = await page.$(STREAM_RESOLUTION2_SELECTOR_UP);
                        const inpot = await input.$eval('.form-control' , node => node.selectedIndex);
                        text = ["Tanımlı Değil","640x368","480x272","320x180","640x480","480x368","352x288"];
                        
   if(inpot == set)
                        {
                            console.log("Resolution 2 Value TRUE  --> "+text[inpot]);
                            return [text[set],text[inpot],1];
                        }
                        else
                        {
                            console.log("Resolution 2 Value FALSE --> "+text[inpot]);
                            return [text[set],text[inpot],0];
                        }
          
        }
        
        module.exports.test_fps2 = async function(page,set) 
        {
                        const input = await page.$(STREAM_FPS2_SELECTOR_UP);
                        const inpot = await input.$eval('.form-control' , node => node.selectedIndex);
                        text = ["Tanımlı Değil","5","10","12.5","15","20","25","30"];
                        
                        if(inpot == set)
                        {
                            console.log("FPS2         Value TRUE  --> "+text[inpot]);
                            return [text[set],text[inpot],1];
                        } 
                        else
                        {
                            console.log("FPS2         Value FALSE --> "+text[inpot]);
                            return [text[set],text[inpot],0];
                        }
	}
	
        
	
}());


