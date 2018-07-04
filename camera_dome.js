(function(){
    const PPP_BUTTON_LEFT='#autoPL';
    const PPP_BUTTON_RIGHT='#autoPR';
    const PPP_BUTTON_STOP='#autoST';
    const IR_CUT_SELECTOR='#t01 > tbody > tr:nth-child(9) > th';
    const IR_LIGHTING_SELECTOR='#ir_led_state';
    const IR_CUT_APPLY_SELECTOR='#irRow > td:nth-child(2) > p > button';
    const PPP_PATROL_ID='#patrol';
    const PPP_APPLY_SELECTOR='#save_home';
    const PPP_GOTO_HOME_CHECKBOX_SELECTOR='#self_goto_home';
    const PPP_GOTO_HOME_VALUE_SELECTOR='#home_timeout';
    const IR_TAB_SELECTOR = '#t01 > tbody > tr:nth-child(9)';
    const IR_FILTER_MODE = '#ircf_stat';
    const IR_FILTER_THRESHOLD = '#ir_led_state';
    const IR_FILTER_TRANSITION = '#auto_ircf_stat';
    const NEW_SELECT = '#t01 > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(2)';
    
  
    
        module.exports.set_ir_filter_mode = async function(page, set) 
        {
            await page.waitFor(2000);
            await page.click(IR_TAB_SELECTOR); console.log("1");
            await page.waitFor(1000);
            await page.waitForSelector(IR_FILTER_MODE,'visible');console.log("2");
            await page.click(IR_FILTER_MODE);console.log("3");
            await page.keyboard.type(set);
            await page.keyboard.press('Enter');
            
	}
	module.exports.set_ir_filter_transition = async function(page, set)
        {
            await page.waitForSelector(IR_FILTER_TRANSITION,'visible');
            await page.click(IR_FILTER_TRANSITION);
            await page.keyboard.type(set);
            await page.keyboard.press('Enter');
            
        }
        module.exports.set_ir_filter_treshold = async function(page, set)
        {
            await page.waitForSelector(IR_FILTER_THRESHOLD,'visible');
            await page.click(IR_FILTER_THRESHOLD);
            await page.keyboard.type(set);
            await page.keyboard.press('Enter');
          
        }
        module.exports.ir_filter_apply = async function(page) 
        {
            await page.waitForSelector(IR_CUT_APPLY_SELECTOR,'visible');
            await page.click(IR_CUT_APPLY_SELECTOR);
            await page.waitFor(1000);
           
        }
        module.exports.turn_left= async function(page){
            
            await page.click(PPP_BUTTON_LEFT);
            console.log("camera is turning left");
            await page.waitFor(2000);
          
        }
        module.exports.turn_right= async function(page){
            
            await page.click(PPP_BUTTON_RIGHT);
            console.log("camera is turning right");
            await page.waitFor(2000);
          
        }
        module.exports.stop= async function(page){
            
            await page.click(PPP_BUTTON_STOP);
            console.log("camera is stopped");
          
        }
        module.exports.ir_cut_open= async function(page){
            
            await page.click(IR_CUT_SELECTOR);
            await page.waitFor(2000);
          
        }
        module.exports.lighting_level= async function(page,set){

            await page.click(IR_LIGHTING_SELECTOR);
            await page.keyboard.type(set);
            await page.keyboard.type('Enter');
            await page.waitFor(1000);
            await page.click(IR_CUT_APPLY_SELECTOR);
            console.log(set+" applied");
            
        }
        module.exports.set_patrol_id = async function(page, set) {
		await page.click(PPP_PATROL_ID);
                await page.keyboard.type(set);
                await page.keyboard.type('Enter');
                await page.click(PPP_PATROL_ID);
                await page.waitFor(2000);
                console.log("setted "+set+"patrol");
                const inpot = await page.$eval('button#patrol_run' , node => node.style.visibility);
                if(inpot=="visible"){console.log("Patrol run button is active");}
                else console.log("Patrol run button is'nt active");
                await page.waitFor(1000);
		
	}
    	module.exports.check_turn_to_task= async function(page,set){
            await page.waitFor(2000);
            const inpot = await page.$eval('input#self_goto_home' , node => node.checked);
            if(inpot!=set){
            await page.click(PPP_GOTO_HOME_CHECKBOX_SELECTOR); 
            await page.waitFor(1000);
            }
            
        }
        module.exports.set_goto_home= async function(page,set){
            await page.waitFor(2000);
            await page.click(PPP_GOTO_HOME_VALUE_SELECTOR);
            for (let i = 0; i < 10; i++){await page.keyboard.down('Backspace');}
            await page.keyboard.type(set);
            await page.waitFor(2000);
        }
        module.exports.goto_home_apply= async function(page){
             await page.click(PPP_APPLY_SELECTOR);
            await page.waitFor(1000);
        }
        //Turn to task control Doc2-43
        module.exports.turn_to_task_value = async function(page) {
                await page.waitFor(2000);
                const input1 = await page.$('#t01 > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2) > label');
                const inpot1 = await input1.$eval('input#home_timeout' , node => node.value);
                if(inpot1 ==300)
                        {
                            console.log("Turn to task value is       TRUE");
                        } 
                else
                        {
                            console.log("Turn to task value is       FALSE");
                            
                        }
            
	}
	module.exports.turn_to_task_control= async function(page) {
            const inpot = await page.$eval('input#self_goto_home' , node => node.checked);
            if(inpot==1)
                console.log("Turn to task checked      TRUE");
            else 
                console.log("Turn to task checked       FALSE");
        }
        module.exports.test_patrol_preset = async function(page){
            await page.waitForSelector('#patrol_list','visible');
            await page.waitForSelector(NEW_SELECT,'visible');
            var input = "";
            var inpot= "";
            while(inpot == "")
            {
            input = await page.$(NEW_SELECT);
            inpot = await input.$eval('#patrol_list' , node => node.value);
            }
            if(inpot=="3,7")
                console.log("Okunan değer = "+inpot+"  Test Başarılı.");
            else  console.log("Okunan değer = "+inpot+"  Test Başarısız.");
        }
        module.exports.test_patrol_time_range = async function(page){
            await page.waitForSelector('#patrol_interval','visible');
            await page.waitForSelector(NEW_SELECT,'visible');
            var input = "";
            var inpot= "";
            while(inpot == "")
            {
            input = await page.$(NEW_SELECT);
            inpot = await input.$eval('#patrol_interval' , node => node.value);
            }
            if(inpot=="5,10")
                console.log("Okunan değer = "+inpot+"  Test Başarılı.");
            else  console.log("Okunan değer = "+inpot+"  Test Başarısız.");
        }

}());