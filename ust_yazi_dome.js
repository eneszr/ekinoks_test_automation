(function() {
    OVERLAY_CHECKBOX_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div > label > input';
    OVERLAY_PARAMETRE_COUNT_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(6) > div > div > select';
    OVERLAY_PARAMETRE1_TYPE_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(7) > div > div > select';
    OVERLAY_APPLY_SELECTOR='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(19) > div > div > button';
    OVERLAY_POPPUP ='body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button';
    
        module.exports.set_checkbox= async function(page){
           // await page.waitFor(2000);
            const inp = page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div' );
            const inpot = inp.$eval('.ng-pristine' , node => node.checked);
            if(inpot!=1)
            {
            await page.click(OVERLAY_CHECKBOX_SELECTOR); 
            }
        }
            
         module.exports.set_parametre_count= async function(page,set){
            await page.click(OVERLAY_PARAMETRE_COUNT_SELECTOR);
            for (let i = 0; i < 10; i++){await page.keyboard.down('Backspace');await page.keyboard.down('Delete');}
            await page.keyboard.type(set);
            await page.waitFor(2000);
        }
        module.exports.set_parametre1_type= async function(page,set){
            var span=page.$(OVERLAY_PARAMETRE1_TYPE_SELECTOR);
            span[0].selectedIndex=2;
            await page.waitFor(2000);
            
        }
         
        module.exports.apply= async function(page){
            await page.click(OVERLAY_APPLY_SELECTOR);
            await page.waitFor(2000);
            await page.click(OVERLAY_POPPUP);
        }
            
}());