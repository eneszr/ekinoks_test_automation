(function(){
    const PPP_BUTTON_LEFT='#autoPL';
    const PPP_BUTTON_RIGHT='#autoPR';
    const PPP_BUTTON_STOP='#autoST';
    const PPP_PATROL_ID='#patrol';
    const PPP_APPLY_SELECTOR='#t01 > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2) > #save_home';
    const PPP_GOTO_HOME_CHECKBOX_SELECTOR='#self_goto_home';
    const PPP_GOTO_HOME_VALUE_SELECTOR='#home_timeout';
    const PPP_PRESET_INDICES_SELECTOR='#preset';
    const PPP_PRESET_NAME_SELECTOR='#presetTag';
    const PPP_PRESET_APPLY_BUTTON_SELECTOR='#button_s';
    const PPP_PATROL_PRESET_RANKING='#patrol_list';
    const PPP_PATROL_TIME_INTERVAL='#patrol_interval';
    const PPP_RUN_BUTTON_SELECTOR='#patrol_run';
    const PPP_PATTERN_ID='#patternTag';
    const PPP_PATTERN_START_BUTTON='#buttonStart';
    const PPP_PATTERN_STOP_BUTTON='#buttonStop';
    const PPP_PATTERN_RUN_BUTTON='#buttonRun';
    const PPP_PATTERN_DELETE_BUTTON='#buttonDelete';
    const PTZ_ZOOM='#t01 > tbody > tr:nth-child(6) > td:nth-child(1) > table > tbody > tr > td:nth-child(1) > p:nth-child(3) > button:nth-child(2)';
    const PTZ_LEFT='#t01 > tbody > tr:nth-child(6) > td:nth-child(1) > table > tbody > tr > td:nth-child(1) > p:nth-child(3) > button:nth-child(1)';
    const PTZ_RIGHT='#t01 > tbody > tr:nth-child(6) > td:nth-child(1) > table > tbody > tr > td:nth-child(1) > p:nth-child(3) > button:nth-child(4)';
    ////////ppp ile başlayanlar preset, patrol ve pattern ayarları////////
    const IR_CUT_SELECTOR='#t01 > tbody > tr:nth-child(9) > th';
    const IR_LIGHTING_SELECTOR='#ir_led_state';
    const IR_CUT_APPLY_SELECTOR='#irRow > td:nth-child(2) > p > button';
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
        ///////////////OTO PAN TESTLERİ
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
        ///////////TEST-58 İÇİN
        module.exports.lighting_level= async function(page,set){

            await page.click(IR_LIGHTING_SELECTOR);
            await page.keyboard.type(set);
            await page.keyboard.type('Enter');
            await page.waitFor(1000);
            await page.click(IR_CUT_APPLY_SELECTOR);
            console.log(set+" applied");
            
        }
        //////////TEST-47 İÇİN
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
	//////////////GÖREVE DÖN,SERBEST SÜRE TANIMI,CHECKBOX İŞARETİ VE DEĞİŞİKLİKLERİ UYGULAMA//////////////////
    	module.exports.check_turn_to_task= async function(page,set){
           // await page.waitFor(2000);
            const inpot = await page.$eval('input#self_goto_home' , node => node.checked);
            if(inpot!=set){
            await page.click(PPP_GOTO_HOME_CHECKBOX_SELECTOR); 
            }
            
        }
        module.exports.set_goto_home= async function(page,set){
            
            await page.click(PPP_GOTO_HOME_VALUE_SELECTOR);
            await page.click(PPP_GOTO_HOME_VALUE_SELECTOR);
            await page.waitFor(6000);
            for (let i = 0; i < 10; i++){await page.keyboard.down('Backspace');await page.keyboard.down('Delete');}
            await page.keyboard.type(set);
            await page.waitFor(2000);
        }
        module.exports.goto_home_apply= async function(page){
            await page.waitForSelector(PPP_APPLY_SELECTOR,'visible');
            await page.waitFor(2000);
            await page.click(PPP_APPLY_SELECTOR);
            await page.waitFor(2000);
        }
        
        //////////////////Preset tanımlama////////////////////////
        module.exports.set_preset_setting= async function(page,set_indice,set_name){
            await page.click(PPP_PRESET_INDICES_SELECTOR);
            await page.waitFor(2000);
            for (let i = 0; i < 20; i++){await page.keyboard.down('Backspace');}
            await page.keyboard.type(set_indice);
            await page.click(PPP_PRESET_NAME_SELECTOR);
            await page.waitFor(2000);
            for (let i = 0; i < 20; i++){await page.keyboard.down('Backspace');}
            await page.keyboard.type(set_name);           
            
        }
        module.exports.preset_setting_apply= async function(page){
            await page.waitFor(2000);
            await page.click(PPP_PRESET_APPLY_BUTTON_SELECTOR);
        }
        ///////////////////Patrol tanımlama/////////////////////////
        module.exports.set_patrol_setting= async function(page,ranking,time_interval){
            await page.click(PPP_PATROL_PRESET_RANKING);
            for (let i = 0; i < 20; i++){await page.keyboard.down('Backspace');}
            await page.keyboard.type(ranking);   
           
            await page.click(PPP_PATROL_TIME_INTERVAL);
            for (let i = 0; i < 20; i++){await page.keyboard.down('Backspace');}
            await page.keyboard.type(time_interval); 
            await page.click(PPP_RUN_BUTTON_SELECTOR);
            
        }
        //////////////Pattern tanımlama-Patterni çalıştırma//////
        module.exports.set_pattern = async function(page){
            await page.click(PPP_PATTERN_ID);
            await page.waitFor(1000);
            for (let i = 0; i < 5; i++){await page.keyboard.down('Backspace');await page.keyboard.down('Delete');}
            await page.keyboard.type("1");
            const inpot1 = await page.$eval('#buttonDelete' , node => node.visibility);
            if(inpot1 != 'visible')
                        {
                            await page.click(PPP_PATTERN_DELETE_BUTTON);
                            await page.waitFor(2000);
                            await page.click(PPP_PATTERN_START_BUTTON);
                            await page.click(PTZ_LEFT,{delay:4000});
                            await page.click(PTZ_RIGHT,{delay:8000});
                            await page.click(PTZ_ZOOM,{delay:4000});
                            await page.click(PPP_PATTERN_STOP_BUTTON); 
                            await page.waitFor(2000);
                        } 
            else
                        {
                            await page.click(PPP_PATTERN_START_BUTTON);
                            await page.click(PTZ_LEFT,{delay:4000});
                            await page.click(PTZ_RIGHT,{delay:8000});
                            await page.click(PTZ_ZOOM,{delay:4000});
                            await page.click(PPP_PATTERN_STOP_BUTTON);  
                            await page.waitFor(2000);
                        }       
        }
        module.exports.pattern_run = async function(page){
            await page.waitFor(2000);
            await page.waitForSelector(PPP_PATTERN_RUN_BUTTON,'visible');
            await page.click(PPP_PATTERN_RUN_BUTTON);
            
            console.log("Desen başlatıldı");
            
        }
        //////PAN ,TILT ,ZOOM
        module.exports.PTZ= async function(page){
            await page.click(PTZ_ZOOM);
            console.log("Kameraya zoom kontrolü gönderildi");
        }
        
        
        /////////////GÖREVE DÖN KONTROLLERİ/////////////////
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
        
        ///////////PRESET,PATROL,PATTERN KONTROLLERİ//////////
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