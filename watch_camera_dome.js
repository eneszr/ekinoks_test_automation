(function(){
    const SELECT_MASK_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(3) > div > div > select';
    const MASK_WIDTH_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(4) > div > div > input';
    const MASK_HEIGHT_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(5) > div > div > input';
    const MASK_UP='#mask_up';
    const MASK_DOWN='#mask_down';
    const MASK_LEFT='#mask_left';
    const MASK_RIGHT='#mask_right';
    const CAM_ZOOM='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(2) > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > p:nth-child(4) > button:nth-child(2)';
    
    
        module.exports.select_mask= async function(page,i) {
            var liste=["lütfen", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];
            await page.click(SELECT_MASK_SELECTOR);
            await page.keyboard.type("lütfen");
            await page.waitFor(2000);
            await page.click(SELECT_MASK_SELECTOR);
            await page.waitFor(2000);
            await page.click(SELECT_MASK_SELECTOR);
            await page.keyboard.type(liste[i]);
           
            
        }
        module.exports.mask_width= async function(page) {
            await page.click(MASK_WIDTH_SELECTOR);
            for (let i = 0; i < 10; i++){await page.keyboard.down('Backspace');await page.keyboard.down('Delete');}
            await page.keyboard.type("5");
        }
        module.exports.mask_height= async function(page) {
            await page.click(MASK_HEIGHT_SELECTOR);
            for (let i = 0; i < 10; i++){await page.keyboard.down('Backspace');await page.keyboard.down('Delete');}
            await page.keyboard.type("5");
        }
        module.exports.mask_orientation= async function(page) {
            await page.click(MASK_UP);
            await page.click(MASK_UP);
            await page.click(MASK_UP);
            await page.click(MASK_LEFT);           
        }
        module.exports.check_show= async function(page){
            const inpot = await page.$eval('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(6) > div > div > label > input' , node => node.checked);
            if(inpot!=1){
            await page.click('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(6) > div > div > label > input'); 
            }
            
        }
        
        module.exports.mask_update= async function(page) {
            await page.click('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(7) > div > div > button');
        }
        module.exports.mask_apply= async function(page) {
            await page.click('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(9) > div > div > button');
            await page.waitForSelector('body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button','visible');
            await page.click('body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button');
        }
    
    
}());