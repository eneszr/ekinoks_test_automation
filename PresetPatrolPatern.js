var readline = require('readline');

(function() {
        const PRESET_INDEX_SELECTOR = '#preset';
        const PRESET_NAME_SELECTOR = '#presetTag';
        const PRESET_SAVE_SELECTOR = '#button_s';
        const PRESET_DELETE_SELECTOR = '#button_d';
        const PRESET_GO_SELECTOR = '#button_g';
        const PRESET_GOTO_HOME_CHECKBOX_SELECTOR = '#self_goto_home';
        const PRESET_GOTO_HOME_SELECTOR = '#home_timeout';
        const PATROL_NAME_SELECTOR = '#patrol';
        const PATROL_PRESET_LIST = '#patrol_list';
        const PATROL_TIME_RANGE_SELECTOR = '#patrol_interval';
        const PATROL_RUN_SELECTOR = '#patrol_run';
        const PATROL_STOP_SELECTOR = '#patrol_stop';
        const PATROL_SAVE_SELECTOR ='#patrol_save';
        const PATROL_DELETE_SELECTOR = '#patrol_delete';
        const DOM_HORIZONTAL_SELECTOR = '#set_h_pos';
        const DOM_VERTICAL_SELECTOR = '#set_v_pos';
        const DOM_ZOOM_SELECTOR = '#set_zoom';
        const DOM_APPLY_LOCATION_SELECTOR = '#t01 > tbody > tr:nth-child(7) > td:nth-child(2) > button';
        const PTZ_RIGHT_SELECTOR = '#t01 > tbody > tr:nth-child(6) > td:nth-child(1) > table > tbody > tr > td:nth-child(1) > p:nth-child(3) > button:nth-child(4)';
        const PRESET_GOTO_HOME_CHECKBOX_SELECTOR_UP = '#t01 > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2)';
        const PRESET_GOTO_HOME_SAVE_BUTTON = '#t01 > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2) > #save_home';
        
        module.exports.set_preset= async function(page){
            var horizontal = ["0","24000","12000"];
            var vertical = ["9000","0","4500"];
            for(let clear=0; clear<3; clear++)
            {   await page.waitFor(1000);
                await page.click(PRESET_INDEX_SELECTOR);
                                await page.waitFor(1500);

                for (let i = 0; i < 10; i++)
                await page.keyboard.down('Backspace');
                await page.keyboard.type(clear.toString());
                await page.keyboard.press('Enter');
                await page.waitFor(1500);
                await page.click(PRESET_DELETE_SELECTOR);
                
            }
            console.log("Presets Deleted");
            for(let index = 0; index<3; index++)
                
            {   
                ////YATAY KONUMU GİR
                await page.click(DOM_HORIZONTAL_SELECTOR);
                await page.waitFor(1000);
                for (let i = 0; i < 10; i++)
                    await page.keyboard.down('Backspace');
                await page.keyboard.type(horizontal[index]);
                ////DIKEY KONUMU GIR
                await page.click(DOM_VERTICAL_SELECTOR);
                await page.waitFor(1000);
                for (let i = 0; i < 10; i++)
                    await page.keyboard.down('Backspace');
                await page.keyboard.type(vertical[index]);
                await page.waitFor(1000);
                ////KONUMA GIT
                await page.click(DOM_APPLY_LOCATION_SELECTOR);
                await page.waitFor(5000);
                ////KONUMU PRESET'E KAYDET
                await page.click(PRESET_INDEX_SELECTOR);
                for (let i = 0; i < 10; i++)
                await page.keyboard.down('Backspace');
                await page.keyboard.type(index.toString());
                await page.waitFor(1000);
                await page.click(PRESET_NAME_SELECTOR);
                for (let i = 0; i < 10; i++)
                await page.keyboard.down('Backspace');
                await page.keyboard.type(index.toString());
                await page.waitFor(1000);
                await page.click(PRESET_SAVE_SELECTOR);
                await page.waitFor(2000);
                console.log("durum"+index);
            }
        }
         module.exports.set_patrol= async function(page){
            await page.click(PATROL_NAME_SELECTOR);
            await page.keyboard.type("0");
            await page.keyboard.press('Enter');
            await page.waitFor(1000);
            await page.click(PATROL_PRESET_LIST);
            for (let i = 0; i < 10; i++)
                await page.keyboard.down('Backspace');
            await page.keyboard.type("0,1,2");
            await page.click(PATROL_TIME_RANGE_SELECTOR);
            for (let i = 0; i < 10; i++)
                await page.keyboard.down('Backspace');
            await page.keyboard.type("3,3,3");
            await page.click(PATROL_SAVE_SELECTOR);

        }
        module.exports.time_pass = async function(page){
    var zaman=0;
    var wait =1;
    var interval = setInterval(function(){zaman++;},10);
    const rl = readline.createInterface({input: process.stdin,output: process.stdout});
    rl.on("line",function(){console.log("Sayaç durduruldu"+zaman/100+"sn");});
    process.stdin.on("keypress",function(){
        clearInterval(interval);
        wait= !wait;
      });
    while(wait) await page.waitFor(10);
        return zaman/100;    
        }
        module.exports.push_time = async function(page)
        {   var date;
            var hour;
            var data = new Array();
            var wait =1;
            const rl = readline.createInterface({input: process.stdin,output: process.stdout});
            await process.stdin.on("keypress",function(){
             date = new Date();
             data[0] = date.getHours();
             data[1] = date.getMinutes();
             data[2] = date.getSeconds();
             data[3] = date.getMilliseconds();
             wait= !wait;

      });
        while(wait) await page.waitFor(10);
            await rl.close();
            return data;
    
        }
        
        module.exports.goto_home= async function(page,set,value)
        {
            const input1 = await page.$(PRESET_GOTO_HOME_CHECKBOX_SELECTOR_UP);
            const inpot1 = await input1.$eval('#self_goto_home' , node => node.checked);
            if (inpot1 != set)
            await page.click(PRESET_GOTO_HOME_CHECKBOX_SELECTOR);
            await page.click(PRESET_GOTO_HOME_SELECTOR);
            for (let i = 0; i < 10; i++)
                await page.keyboard.down('Backspace');
            await page.keyboard.type(value.toString());
            await page.click(PRESET_GOTO_HOME_SAVE_BUTTON);
            await page.waitFor(2000);
        }
        module.exports.break_patrol= async function(page)
        {
            await page.click(PATROL_STOP_SELECTOR);
        }
         module.exports.run_patrol= async function(page)
        {
            await page.click(PATROL_RUN_SELECTOR);
        }
        module.exports.turn_left_right= async function(page,direction)
        {
            if(direction=="r")
            await page.click(PTZ_RIGHT_SELECTOR,{delay:2000});
                
        }
        module.exports.go_position = async function(page,vertical,horizontal,zoom)
        {
            ////YATAY KONUMU GİR
                await page.click(DOM_HORIZONTAL_SELECTOR);
                await page.waitFor(1000);
                for (let i = 0; i < 10; i++)
                    await page.keyboard.down('Backspace');
                await page.keyboard.type(horizontal);
                ////DIKEY KONUMU GIR
                await page.click(DOM_VERTICAL_SELECTOR);
                await page.waitFor(1000);
                for (let i = 0; i < 10; i++)
                    await page.keyboard.down('Backspace');
                await page.keyboard.type(vertical);
                await page.waitFor(1000);
                ////ZOOM GİR
                await page.click(DOM_ZOOM_SELECTOR);
                await page.waitFor(1000);
                for (let i = 0; i < 10; i++)
                    await page.keyboard.down('Backspace');
                await page.keyboard.type(zoom);
                await page.waitFor(1000);
                ////KONUMA GIT
                await page.click(DOM_APPLY_LOCATION_SELECTOR);
                await page.waitFor(5000);
            
        }
        module.exports.get_time = async function()
        {    var data = new Array();
             date = new Date();
             data[0] = date.getHours();
             data[1] = date.getMinutes();
             data[2] = date.getSeconds();
             data[3] = date.getMilliseconds(); 
             return data;
    
            
        }
              
	
}());