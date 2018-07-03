(function(){
    const PPP_BUTTON_LEFT='#autoPL';
    const PPP_BUTTON_RIGHT='#autoPR';
    const PPP_BUTTON_STOP='#autoST';
    const IR_CUT_SELECTOR='#t01 > tbody > tr:nth-child(9) > th';
    const IR_LIGHTING_SELECTOR='#ir_led_state';
    const IR_CUT_APPLY_SELECTOR='#irRow > td:nth-child(2) > p > button';
    const PPP_PATROL_ID='#patrol';
    

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
                const input = await page.$('button#patrol_run');
                const inpot = await page.$eval('button#patrol_run' , node => node.style.visibility);
                if(inpot=="visible"){console.log("Patrol run button is active");}
                else console.log("Patrol run button is'nt active");
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
           // const input = await page.$('#self_goto_home');
            const inpot = await page.$eval('input#self_goto_home' , node => node.checked);
            if(inpot==1)
                console.log("Turn to task checked      TRUE");
            else 
                console.log("Turn to task checked       FALSE");
        }
    

}());