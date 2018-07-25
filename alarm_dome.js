(function() {

    const ALARM_PRESET_ID='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(5) > div > div > input';
    const ALARM_APPLY='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(12) > div > div > button';
    const ALARM_POPUP_BUTTON='body > div.bootbox.modal.fade.bootbox-alert.in > div > div > div.modal-footer > button';
    const PPP_GOTO_HOME_CHECKBOX_SELECTOR= 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(6) > div > div > label > input';
   // const ACTIVE_ALARMS='body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div > input';
    
        module.exports.set_preset_id= async function(page,id){
        await page.click(ALARM_PRESET_ID);
            await page.waitFor(2000);
            for (let i = 0; i < 10; i++){await page.keyboard.down('Backspace');}
            await page.keyboard.type(id);
        }
        module.exports.check_turn_location= async function(page,set){
            await page.waitFor(2000);
            const input = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(6) > div > div > label');
            const inpot = await input.$eval('.ng-valid' , node => node.checked);
            if(inpot!=set){
            await page.click(PPP_GOTO_HOME_CHECKBOX_SELECTOR); 
            await page.waitFor(1000);
            }
            
        }
        module.exports.alarm_apply= async function(page){
            await page.waitFor(2000);
            await page.click(ALARM_APPLY);
            await page.waitFor(2000);
            await page.click(ALARM_POPUP_BUTTON);            
        }
        
        /////////////////CONTROL////////////////
        module.exports.alarm_is_active= async function(page){
            await page.waitFor(2000);
            const input = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(8) > div > div');
            const inpot = await input.$eval('.ng-pristine' , node => node.checked);
            if(inpot=='1')
            {  console.log("Checkbox seçili             TRUE"); return [inpot,1];}
            else
            {console.log("Checkbox seçili değil       FALSE"); return [inpot,0];}
        }
        module.exports.active_alarms_control= async function(page,set){
            await page.waitFor(2000);
            const input1 = await page.$('body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(1) > div > div');
            const inpot1 = await input1.$eval('.form-control' , node => node.value);
            if(inpot1 ==set)
                        {
                            console.log("Aktif alarmlar:"+inpot1+"       TRUE");
                            return [inpot1,1];
                        } 
            else
                        {
                            console.log("Aktif alarmlar:"+inpot1+"       FALSE");
                            return [inpot1,0];
                        }
            
        }
    
}());