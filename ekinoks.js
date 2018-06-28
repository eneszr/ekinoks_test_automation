 const puppeteer = require('puppeteer');

var login = require("./login");
var nav = require("./navigate");
var encoding = require("./encoding");
var encodingLow = require("./encodinglow");
var resolution = require("./resolution");
var camera = require("./camera");
var version = require("./version");
var alarm = require("./alarm");
var time = require("./time");
var question = require("./question");
var commander = require('./capture_test');
const fs = require('fs');
const path = require('path');


let testIt = async () => {

    await commander.record("10.5.177.47","stream1","1");
    sonuc = await commander.create_json("10.5.177.47","stream1","1");
    
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	await login.loginCamera(page, 'http://10.5.176.249:8080');
	                       
                       // Kontrol 22
                        console.log(" ");
                        console.log("Kontrol 22 STARTED");
                        await nav.toEncodingHigh(page);
                        await encoding.set_intraframe(page, "15");
			await encoding.set_bit_con(page, "cbr");
                        await encoding.set_codding_quality(page, "orta");
                        await encoding.set_bit_rate(page, "10");
                        await encoding.set_calc_method(page, "tan");
                        await encoding.apply(page);
                        console.log("OPTIONS SETTED ");
                        
                        // Kontrol 23
                        console.log(" ");
                        console.log("Control 23 STARTED");
                        await nav.toEncodingLow(page);
                         encodingLow.set_intraframe(page, "15");
			 encodingLow.set_bit_con(page, "cbr");
                         encodingLow.set_codding_quality(page, "orta");
                         encodingLow.set_bit_rate(page, "0.4");
                        await encodingLow.apply(page);
                        console.log("OPTIONS SETTED ");
                        
                        //Kontrol 24
                        console.log(" ");
                        console.log("Control 24 STARTED");
                        await nav.toResolution(page);
                        await resolution.set_profile(page,"1080");
                        await resolution.set_stream_mode(page,"sadece yayın1");
                        await resolution.set_resolution1(page,"1920 x 1080 (max:30fps");
                        await resolution.set_fps1(page,"10");
                        await resolution.apply(page);
                        console.log("OPTIONS SETTED ");

                        //Kontrol 25
                        console.log(" ");
                        console.log("Control 25 STARTED");
                        await nav.toCamera(page);
                        await camera.set_ir_filter_mode(page,"gece");
                        await camera.set_ir_filter_transition(page,"oto");
                        await camera.ir_filter_apply(page);
                        console.log("OPTIONS SETTED ");
                        
                                              
                      // TEST 28
                      console.log(" ");
                      console.log("Test 28 Started");
                      await nav.toEncodingHigh(page);
                      await encoding.test_intraframe(page);
                      await encoding.test_bit_con(page);
                      await encoding.test_codding_quality(page);
                      await encoding.test_bit_rate(page);
                      await encoding.test_calc_method(page);
                      // TEST 29
                      console.log(" ");
                      console.log("Test 29 Started");
                      await nav.toEncodingLow(page);
                      await encodingLow.test_intraframe(page);
                      await encodingLow.test_bit_con(page);
                      await encodingLow.test_bit_rate(page);
                      await encodingLow.test_codding_quality(page);
                      // TEST 30

                      console.log(" ");  
                      console.log("Test 30 Started");
                      await nav.toResolution(page);
                      await resolution.test_profile(page);
                      await resolution.test_stream_mode(page);  
                      await resolution.test_resolution1(page);
                      await resolution.test_fps1(page);
                      await resolution.test_resolution2(page);
                      await resolution.test_fps2(page);
                        
                    
                        
                      //TEST 37
                      console.log(" ");  
                      console.log("Test 37 Started");
                      await nav.toVersion(page);
                      await version.test_application(page);
                      await version.test_firmware(page);
                 
                      //TEST 38
                      console.log("");
                      console.log("Test 38 Started");
                      await nav.toAlarm(page);
                      await alarm.test_sei_selected(page);
                        
                      
                      
                      //TEST 39
                      //await nav.toALarm(page); 
                      await alarm.set_sei_select(page , 1);
                      await alarm.set_motion_detector(page,"a")
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      //TEST 41
                      
                      console.log("");
                      console.log("Test 41 Started");
                      await nav.toCamera(page);
                      await camera.test_ir_filter_mode(page, "0");
                      await camera.test_ir_filter_transition(page, "0");
 	
                      //TEST 46
                      console.log("");
                      console.log("Test 41 Started");
                      await nav.toTime(page);
                      await time.test_ntp_server1(page, "pool.ntp.org");
 
  
  
  
  
  ///////////////////FURKAN////////////////////
  /////KONTROL 53-54-56-57-58-59-60//////
        var resolution1 = ["1920 x 1080 (Max:30fps)", "1280 x 720 (Max:30fps)", "1280 x 720 (Max:25fps)", "1920 x 1080 (Max:25fps)"];
        var fps1 = ["15", "10", "20", "12.5"];
        var resolution2 = ["640 x 368", "480 x 272", "320 x 180", "640 x 368"];
        var fps2 = ["5", "15", "20", "12.5"];

        for (let i = 0; i < resolution1.length; i++){
            await nav.toResolution(page);
            await resolution.set_stream_mode(page, "Yayın1");
            await resolution.set_resolution1(page, resolution1[i]);  
            await resolution.set_fps1(page, fps1[i]);
            await resolution.apply(page);
            console.log("Testing Done " + (i+53));
        }
        
        for (let i = 0; i < resolution2.length; i++){
            await nav.toResolution(page);
            await resolution.set_stream_mode(page, "Yayın1");
            await resolution.set_resolution2(page, resolution2[i]);    
            await resolution.set_fps2(page, fps2[i]);
            await resolution.apply(page);
            console.log("Testing Done " + (i+57));
        }
        
        //////////DÖKÜMAN 2//////////
    ///////////61-62-63-64-65-66-67-68/////////// 
    
        //61-62-63-64
        for (let i = 0; i < resolution1.length; i++){
            await nav.toResolution(page);
            await resolution.set_stream_mode(page, "Yayın1");
            await resolution.set_resolution1(page, resolution1[i]);
            await resolution.set_fps1(page, fps1[i]);
            await resolution.apply(page);
            console.log("DOM CAM Testing Done " + (i+61));
            }
        //65-66-67-68
        for(let i = 0; i < resolution2.length; i++){
            await nav.toResolution(page);
            await resolution.set_stream_mode(page, "Yayın1");
            await resolution.set_resolution2(page, resolution2[i]);
            await resolution.set_fps2(page, fps2[i]);
            await resolution.apply(page);
            console.log("DOM CAM Testing Done " + (i+65));
        }
                      
                      
                      
                      
                     
                      
                      
        await page.waitFor(3000);
	await page.close();
	await browser.close();
	return 0;
}

testIt().then((value) => {
	console.log("Testing done " + 1); // Success!
});

