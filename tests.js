var url = "10.5.177.47";
const puppeteer = require('puppeteer');
var nav = require("./navigate");
var encoding = require("./encoding");
var encodingLow = require("./encodinglow");
var resolution = require("./resolution");
var camera = require("./camera");
var version = require("./version");
var alarm = require("./alarm");
var time = require("./time");
var capture_test = require('./capture_test');
const child_process = require("child_process");
var question = require("./question");



async function test_ffmpeg_res(width_test,height_test,stream,test_num)
{
    await capture_test.record(url,stream,test_num);
    await capture_test.create_json(url,stream,test_num);
    coded_width = await capture_test.read_specs("coded_width",test_num);
    coded_height = await capture_test.read_specs("coded_height",test_num);
    avg_frame_rate = await capture_test.read_specs("avg_frame_rate",test_num);//ölçülen kare hızı
    console.log("İstenen çözünürlük = "+width_test+"x"+height_test);
    console.log("Gerçekleşen çözünürlük = "+coded_width+"x"+coded_height);
    
    if (coded_width == width_test && coded_height == height_test)
    { 
        console.log("Çözünürlükler Eşit");
    }
    else console.log("Çözünürlükler Farklı");
}



async function test_ffmpeg_res_fps(stream,test_num)
{
    await capture_test.record(url,stream,test_num);
    await capture_test.create_json(url,stream,test_num);
    width = await capture_test.read_specs("width",test_num); //istenen yükseklik
    height = await capture_test.read_specs("height",test_num); //istenen genişlik
    coded_width = await capture_test.read_specs("coded_width",test_num); //gerçekleşen yükseklik
    coded_height = await capture_test.read_specs("coded_height",test_num); //gerçekleşen genişlik
    r_frame_rate = await capture_test.read_specs("r_frame_rate",test_num);//istenen kare hızı
    avg_frame_rate = await capture_test.read_specs("avg_frame_rate",test_num);//gerçekleşen kare hızı
    console.log("İstenen çözünürlük = "+width+"x"+height);
    console.log("Gerçekleşen çözünürlük = "+coded_width+"x"+coded_height);
    
    if (coded_width == width && coded_height == height)
    { 
        console.log("Çözünürlükler Eşit");
    }
    else console.log("Çözünürlükler Farklı");

    console.log("İstenen kare hızı = "+r_frame_rate);
    console.log("Gerçekleşen kare hızı = "+avg_frame_rate);
    
    if (avg_frame_rate == r_frame_rate )
    { 
        console.log("Kare Hızı Eşit");
    }
    else console.log("Kare Hızı Farklı");
}


async function test_set_res_fps(page,i,res)
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

async function test_set_res_fps_DOM(page,i,res)
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
	
	module.exports.start_1 = async function(page, test_number) {
	
            switch(test_number){
                case "14" : {await test_ffmpeg_res("1920","1080","stream1m","14"); break;}
                case "15" : {await test_ffmpeg_res("640","368","stream2m","14"); break;}
                case "16" : {await test_ffmpeg_res("1920","1080","stream1","14"); break;}
                case "17" : {await test_ffmpeg_res("640","368","stream2","14"); break;}
                
                
                
                
                
                
                
                
                
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
                case "32": {
                    var command = 'vlc rtsp://'+url+'/stream1';
 proc =await require('child_process').exec(command);
select = await question.ask("Görüntü Geldi mi ? e/h");
break;
                    //await page.waitFor(5000);
                    //command = "sudo killall vlc"
                    //await capture_test.write(command);
                    
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
                case "53": {await test_set_res_fps(page,0,1);
                    await test_ffmpeg_res_fps("stream1",53);
                    break;
                }
                case "54": {await test_set_res_fps(page,1,1);
                    await test_ffmpeg_res_fps("stream1",54);
                    break;
                }
                case "55": {await test_set_res_fps(page,2,1);
                    await test_ffmpeg_res_fps("stream1",55);
                    break;
                }
                case "56": {await test_set_res_fps(page,3,1);
                    await test_ffmpeg_res_fps("stream1",56);
                    break;
                }
                case "57": {await test_set_res_fps(page,0,2);
                    await test_ffmpeg_res_fps("stream2",57);
                    break;
                }
                case "58": {await test_set_res_fps(page,1,2);
                    await test_ffmpeg_res_fps("stream2",58);
                    break;
                }
                case "59": {await test_set_res_fps(page,2,2);
                    await test_ffmpeg_res_fps("stream2",59);
                    break;
                }
                case "60": {await test_set_res_fps(page,3,2);
                    await test_ffmpeg_res_fps("stream2",60);
                    break;
                }
                default: console.log("Test "+test_number+" blunamadı lütfen tekrar deneyin..");
                
            }
                
	}
	
	module.exports.start_2 = async function(page, test_number) {
            switch(test_number){
                
                case "61": {await test_set_res_fps_DOM(page,0,1);
                    break;
                }
                case "62": {await test_set_res_fps_DOM(page,1,1);
                    break;
                }
                case "63": {await test_set_res_fps_DOM(page,2,1);
                    break;
                }
                case "64": {await test_set_res_fps_DOM(page,3,1);
                    break;
                }
                case "65": {await test_set_res_fps_DOM(page,0,2);
                    break;
                }
                case "66": {await test_set_res_fps_DOM(page,1,2);
                    break;
                }
                case "67": {await test_set_res_fps_DOM(page,2,2);
                    break;
                }
                case "68": {await test_set_res_fps_DOM(page,3,2);
                    break;
                }
                default: await console.log("Test "+test_number+" blunamadı lütfen tekrar deneyin..");
 
                
            }
	
        
        

        
                
	}
	
	
}());

