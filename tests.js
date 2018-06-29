const puppeteer = require('puppeteer');

var nav = require("./navigate");
var encoding = require("./encoding");
var encodingLow = require("./encodinglow");
var resolution = require("./resolution");
var camera = require("./camera");
var version = require("./version");
var alarm = require("./alarm");
var time = require("./time");
async function dene(page,i,res)
{
        var resolution1 = ["1920 x 1080 (Max:30fps)", "1280 x 720 (Max:30fps)", "1280 x 720 (Max:25fps)", "1920 x 1080 (Max:25fps)"];
        var fps1 = ["15", "10", "20", "12.5"];
        var resolution2 = ["640 x 368", "480 x 272", "320 x 180", "640 x 368"];
        var fps2 = ["5", "15", "20", "12.5"];
    if(res == 1)
    { 
            await nav.toResolution(page);
            await resolution.set_stream_mode(page, "Yayın1");
            await resolution.set_resolution1(page, resolution1[i]);  
            await resolution.set_fps1(page, fps1[i]);
            await resolution.apply(page);
            console.log("Testing Done " + (i+53));
    }
    else if (res == 2)
    {
       await nav.toResolution(page);
            await resolution.set_stream_mode(page, "Yayın1");
            await resolution.set_resolution2(page, resolution2[i]);    
            await resolution.set_fps2(page, fps2[i]);
            await resolution.apply(page);
            console.log("Testing Done " + (i+57));
        
    }
    
}

async function dene2(page,i,res)
{
        var resolution1 = ["1920 x 1080 (Max:30fps)", "1280 x 720 (Max:30fps)", "1280 x 720 (Max:25fps)", "1920 x 1080 (Max:25fps)"];
        var fps1 = ["15", "10", "20", "12.5"];
        var resolution2 = ["640 x 368", "480 x 272", "320 x 180", "640 x 368"];
        var fps2 = ["5", "15", "20", "12.5"];
    if(res == 1)
    { 
            await nav.toResolution(page);
            await resolution.set_stream_mode(page, "Yayın1");
            await resolution.set_resolution1(page, resolution1[i]);
            await resolution.set_fps1(page, fps1[i]);
            await resolution.apply(page);
            console.log("DOM CAM Testing Done " + (i+61));
    }
    else if (res == 2)
    {
       await nav.toResolution(page);
            await resolution.set_stream_mode(page, "Yayın1");
            await resolution.set_resolution2(page, resolution2[i]);
            await resolution.set_fps2(page, fps2[i]);
            await resolution.apply(page);
            console.log("DOM CAM Testing Done " + (i+65));
        
    }
    
}
 
 (function() {
	const LOGIN_USERNAME_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(1) > div > div > input';
	const LOGIN_PASSWORD_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(2) > div > div > input';
	const LOGIN_BUTTON_SELECTOR = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > div > div:nth-child(3) > div > div > button';
	
	module.exports.start_1 = async function(page, test_number) {
	
            switch(test_number){
                case "22": {console.log(" ");
                        console.log("Kontrol 22 STARTED");
                        await nav.toEncodingHigh(page);
                        await encoding.set_intraframe(page, "15");
			await encoding.set_bit_con(page, "cbr");
                        await encoding.set_codding_quality(page, "orta");
                        await encoding.set_bit_rate(page, "10");
                        await encoding.set_calc_method(page, "tan");
                        await encoding.apply(page);
                        console.log("OPTIONS SETTED ");
                    break;
                }
                case "23": {// Kontrol 23
                        console.log(" ");
                        console.log("Control 23 STARTED");
                        await nav.toEncodingLow(page);
                        await encodingLow.set_intraframe(page, "15");
			await encodingLow.set_bit_con(page, "cbr");
                        await encodingLow.set_codding_quality(page, "orta");
                        await encodingLow.set_bit_rate(page, "0.4");
                        await encodingLow.apply(page);
                        console.log("OPTIONS SETTED ");
                    break;
                }
                case "24": {//Kontrol 24
                        console.log(" ");
                        console.log("Control 24 STARTED");
                        await nav.toResolution(page);
                        await resolution.set_profile(page,"1080");
                        await resolution.set_stream_mode(page,"sadece yayın1");
                        await resolution.set_resolution1(page,"1920 x 1080 (max:30fps");
                        await resolution.set_fps1(page,"10");
                        await resolution.apply(page);
                        console.log("OPTIONS SETTED ");
                    break;
                }
                case "25": {//Kontrol 25
                        console.log(" ");
                        console.log("Control 25 STARTED");
                        await nav.toCamera(page);
                        await camera.set_ir_filter_mode(page,"gece");
                        await camera.set_ir_filter_transition(page,"oto");
                        await camera.ir_filter_apply(page);
                        console.log("OPTIONS SETTED ");
                    break;
                }
                case "28": {// TEST 28
                      console.log(" ");
                      console.log("Test 28 Started");
                      await nav.toEncodingHigh(page);
                      await encoding.test_intraframe(page);
                      await encoding.test_bit_con(page);
                      await encoding.test_codding_quality(page);
                      await encoding.test_bit_rate(page);
                      await encoding.test_calc_method(page);
                    break;
                }
                case "29": {// TEST 29
                      console.log(" ");
                      console.log("Test 29 Started");
                      await nav.toEncodingLow(page);
                      await encodingLow.test_intraframe(page);
                      await encodingLow.test_bit_con(page);
                      await encodingLow.test_bit_rate(page);
                      await encodingLow.test_codding_quality(page);
                    break;
                }
                case "30": { // TEST 30

                      console.log(" ");  
                      console.log("Test 30 Started");
                      await nav.toResolution(page);
                      await resolution.test_profile(page);
                      await resolution.test_stream_mode(page);  
                      await resolution.test_resolution1(page);
                      await resolution.test_fps1(page);
                      await resolution.test_resolution2(page);
                      await resolution.test_fps2(page);
                    break;
                }
                case "37": {//TEST 37
                      console.log(" ");  
                      console.log("Test 37 Started");
                      await nav.toVersion(page);
                      await version.test_application(page);
                      await version.test_firmware(page);
                    break;
                }
                case "38": {//TEST 38
                      console.log("");
                      console.log("Test 38 Started");
                      await nav.toAlarm(page);
                      await alarm.test_sei_selected(page);
                    break;
                }
                case "39": {//TEST 39
                      await nav.toAlarm(page); 
                      await alarm.set_sei_select(page , 1);
                      await alarm.set_motion_detector(page,"a");
                    break;
                }
                case "41": {//TEST 41
                      
                      console.log("");
                      console.log("Test 41 Started");
                      await nav.toCamera(page);
                      await camera.test_ir_filter_mode(page, "0");
                      await camera.test_ir_filter_transition(page, "0");
                    break;
                }
                case "46": {//TEST 46
                      console.log("");
                      console.log("Test 46 Started");
                      await nav.toTime(page);
                      await time.test_ntp_server1(page, "pool.ntp.org");
                    break;
                }
                case "53": {await dene(page,0,1);
                    break;
                }
                case "54": {await dene(page,1,1);
                    break;
                }
                case "55": {await dene(page,2,1);
                    break;
                }
                case "56": {await dene(page,3,1);
                    break;
                }
                case "57": {await dene(page,0,2);
                    break;
                }
                case "58": {await dene(page,1,2);
                    break;
                }
                case "59": {await dene(page,2,2);
                    break;
                }
                case "60": {await dene(page,3,2);
                    break;
                }
                default: console.log("Test "+test_number+" blunamadı lütfen tekrar deneyin..");
                
            }
                
	}
	
	module.exports.start_2 = async function(page, test_number) {
            switch(test_number){
                
                case "61": {await dene2(page,0,1);
                    break;
                }
                case "62": {await dene2(page,1,1);
                    break;
                }
                case "63": {await dene2(page,2,1);
                    break;
                }
                case "64": {await dene2(page,3,1);
                    break;
                }
                case "65": {await dene2(page,0,2);
                    break;
                }
                case "66": {await dene2(page,1,2);
                    break;
                }
                case "67": {await dene2(page,2,2);
                    break;
                }
                case "68": {await dene2(page,3,2);
                    break;
                }
                default: await console.log("Test "+test_number+" blunamadı lütfen tekrar deneyin..");
 
                
            }
	
        
        

        
                
	}
	
	
}());

