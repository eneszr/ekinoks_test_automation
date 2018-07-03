 const puppeteer = require('puppeteer');

var login = require("./login_dome");
var nav = require("./nav_dome");
var cam = require("./camera_dome");
var version = require("./version_dome");
var encodingH = require("./encodingHigh_dome");
var timeSet = require("./time_settings_dome");
var encodingLow = require("./encodingLow_dome");
var resolution = require("./resolation_dome");

let testIt1 = async () => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	await login.loginCamera(page, 'http://10.5.177.164:8080');
        await page.waitFor(2000);
        

        
                        //TEST27
                        console.log(" ");
                        console.log("Control Doc2-27 STARTED");
                        await nav.toDomeEncodingHigh(page);
                        await encodingH.set_intraframe(page, "15");
                        await encodingH.set_bit_con(page, "cbr");
                        await encodingH.set_codding_quality(page, "Yüksek");
                        await encodingH.set_bit_rate(page, "1");
                        await encodingH.apply(page);
                        console.log("OPTIONS SETTED ");   
                     
                        //TEST28
                        console.log(" ");
                        console.log("Control Doc2-28 STARTED");
                        await nav.toDomeEncodingLow(page);
                        await encodingLow.set_intraframe(page, "15");
                        await encodingLow.set_bit_con(page, "cbr");
                        await encodingLow.set_codding_quality(page, "Yüksek");
                        await encodingLow.set_bit_rate(page, "1");
                        await encodingLow.apply(page);
                        console.log("OPTIONS SETTED ");

                        
                        //TEST33
                        console.log(" ");
                        console.log("Test Doc2-33 STARTED");
                        await nav.toDomeEncodingHigh(page);
                        await encodingH.test_intraframe_2(page);
                        await encodingH.test_bit_con_2(page);
                        await encodingH.test_codding_quality_2(page);
                        await encodingH.test_bit_rate_2(page);
                        await encodingH.test_calc_method_2(page);
                        

                        //TEST34
                        console.log(" ");
                        console.log("Test Doc2-34 STARTED");
                        await nav.toDomeEncodingLow(page);
                        await encodingLow.test_intraframe_2(page);
                        await encodingLow.test_bit_con_2(page);
                        await encodingLow.test_bit_rate_2(page);
                        await encodingLow.test_codding_quality_2(page);
                            
                        
                        
                        
                        
                        
        
        //TEST-43
        console.log("");
        console.log("Test Doc2-43 Started");
        await nav.toDomeCamera(page);
        await page.waitFor(2000);
        await cam.turn_to_task_value(page);
        console.log("Test is completed!");
        
        //TEST-44
        console.log("");
        console.log("Test Doc2-44 Started");
        await nav.toDomeCamera(page);
        await page.waitFor(2000);
        await cam.turn_to_task_control(page);
        console.log("Test is completed!");
        
        //TEST-47
        console.log("");
        console.log("Test Doc2-47 Started");
        await nav.toDomeCamera(page);
        await page.waitFor(2000);
        for (let i = 0; i < 9; i++){
        await cam.set_patrol_id(page,i+".");
        await page.waitFor(2000);
        }
        console.log("Test is completed!");
        
        
        //TEST-56
        console.log("");
        console.log("Test Doc2-56 Started");
        await nav.toTimeSettings(page);
        await page.waitFor(2000);
        await timeSet.test_np1_value(page);
        await timeSet.apply(page);
        console.log("Test is completed!");
        
        //TEST-58
        console.log("");
        console.log("Test Doc2-58 Started");
        await nav.toDomeCamera(page);
        await page.waitFor(2000);
        await cam.ir_cut_open(page);
        await cam.lighting_level(page,"manuel");
        console.log("Please bring the camera to a position where you can see it");
        
        var level = ["level0","level1","level2","level3","level4","level5","level6","AUTO"];
        for (let i = 0; i < 8; i++){
        await cam.lighting_level(page,level[i]);
        await page.waitFor(3000);
        }
        console.log("Test is completed!");
        
        //TEST-137
        console.log("");
        console.log("Test Doc2-137 Started");
        await nav.toDomeCamera(page);
        await page.waitFor(2000);
        await cam.turn_left(page);
        await page.waitFor(4000);
        await cam.stop(page);
        console.log("Test is completed!");
        
        //TEST-138
        console.log("");
        console.log("Test Doc2-138 Started");
        //await nav.toDomeCamera(page);
        await page.waitFor(2000);
        await cam.turn_left(page);
        await page.waitFor(4000);
        await cam.turn_right(page);
        console.log("Test is completed!");
        
        //TEST-139
        console.log("");
        console.log("Test Doc2-139 Started");
       // await nav.toDomeCamera(page);
        await page.waitFor(2000);
        await cam.turn_right(page);
        await page.waitFor(4000);
        await cam.stop(page);
        console.log("Test is completed!");
        
        //TEST-140
        console.log("");
        console.log("Test Doc2-140 Started");
       // await nav.toDomeCamera(page);
        await page.waitFor(2000);
        await cam.turn_right(page);
        await page.waitFor(4000);
        await cam.turn_left(page);
        console.log("Test is completed!");
        
        //TEST-143
        console.log("");
        console.log("Test Doc2-143 Started");
        await nav.toDomeCamera(page);
        await page.waitFor(2000);
        await cam.turn_right(page);
        await nav.toWatchCamera(page);
        await page.waitFor(6000);
        await nav.toDomeVersion(page);
        await version.reload(page);
        await page.waitFor(2000);
        await nav.toWatchCamera(page);    
        console.log("Test is completed!");
        
        //TEST-191-193-195
        console.log("");
        await nav.toDomeEncodingHigh(page);
        await page.waitFor(2000);
        await encodingH.traffic_forming(page);
        var list_precision=["Agresif","Orta","Hafif"];
         for (let i = 0; i < 3; i++){
            console.log("Test Doc2-"+(191+i)+" Started");
        await encodingH.frequency(page,"50");
        await encodingH.precision(page,list_precision[i]);
        await encodingH.apply(page);
        console.log("Test is completed!");
        }
        
        //grafik çizimleri yok
        
        


        await page.waitFor(3000000);
	await page.close();
	//await browser.close();
	return 0;
}



testIt1().then((value) => {
	console.log("Testing done " + value); // Success!
});