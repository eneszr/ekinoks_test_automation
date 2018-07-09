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
const fs = require('fs');
var question = require("./question");
var rtsp = require('./rtsp');
var mask = require('./mask');
var ip = '0.0.0.0';
var results;
///////////FOR DOME CAMERAS///////////
var login = require("./login_dome");
var nav_dome = require("./nav_dome");
var cam = require("./camera_dome");
var version_dome = require("./version_dome");
var encodingH = require("./encodingHigh_dome");
var timeSet = require("./time_settings_dome");
var encodingLow_dome= require("./encodingLow_dome");
var ppp=require("./PresetPatrolPatern");
var alarm_dome= require("./alarm_dome");
/////////////////////////////////////
var readline = require('readline');
var answer;
var zaman=0;
var tests = require('./tests');

async function timer(page,n){
    console.clear();
    console.log("Lütfen Bekleyin ("+(n-1)+"sn)...");
    x=n-1;
    if(x != 0){
        setTimeout(function() {timer(page,x)},1000);}
    return;
}

async function test_ffmpeg_res(width_test,height_test,stream,test_num)
{
    await capture_test.record(ip,stream,test_num);
    await capture_test.create_json(ip,stream,test_num);
    coded_width = await capture_test.read_specs("coded_width",test_num);
    coded_height = await capture_test.read_specs("coded_height",test_num);
    avg_frame_rate = await capture_test.read_specs("avg_frame_rate",test_num);//ölçülen kare hızı
    var command = 'vlc rtsp://admin:admin@'+ip+'/stream1';
 proc =await require('child_process').exec(command);
select = await question.ask("Görüntü Geldi mi ? e/h");
    console.log("İstenen çözünürlük = "+width_test+"x"+height_test);
    console.log("Gerçekleşen çözünürlük = "+coded_width+"x"+coded_height);
    
    if (coded_width == width_test && coded_height == height_test)
    { 
        console.log("Çözünürlükler Eşit");
    }
    else console.log("Çözünürlükler Farklı");
    
    if (select=='e') return 1;
    else return 0;
}
async function test_ffmpeg_res_fps(stream,test_num)
{
    await capture_test.record(ip,stream,test_num);
    await capture_test.create_json(ip,stream,test_num);
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
async function test_set_res_fps(page,res,i)
{
        var resolution1 = ["1920 x 1080 (Max:30fps)", "1280 x 720 (Max:30fps)", "1280 x 720 (Max:25fps)", "1920 x 1080 (Max:25fps)"];
        var fps1 = ["15", "10", "20", "12.5"];
        var resolution2 = ["640 x 368", "480 x 272", "320 x 180", "640 x 368"];
        var fps2 = ["5", "15", "20", "12.5"];
    if(res == 1)
    {       console.log("Test "+(i+53)+ " Başladı.");
            await nav.toResolution(page,ip);
            await resolution.set_resolution1(page, resolution1[i]);  
            await resolution.set_fps1(page, fps1[i]);
            await resolution.apply(page);
            console.log("Testing Done " + (i+53));
    }
    else if (res == 2)
    {
            console.log("Test "+(i+57)+ " Başladı.");
            await nav.toResolution(page,ip);
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
            await nav.toResolution(page,ip);
            await resolution.set_resolution1(page, resolution1[i]);
            await resolution.set_fps1(page, fps1[i]);
            await resolution.apply(page);
            console.log("DOM CAM Testing Done " + (i+61));
    }
    else if (res == 2)
    {
       await nav.toResolution(page,ip);
            await resolution.set_resolution2(page, resolution2[i]);
            await resolution.set_fps2(page, fps2[i]);
            await resolution.apply(page);
            console.log("DOM CAM Testing Done " + (i+65));
        
    }
    
    
}
 (function() {
	
	module.exports.start_1 = async function(page, test_number,url) {
	ip = url;
            switch(test_number.toString()){
                case "1": {
                    while(1){
                    var x = await ppp.push_time(page);
                    console.log(x);
                    var xy = await ppp.push_time(page);
                    console.log(xy[0]+":"+xy[1]+":"+xy[2]+"."+xy[3]);}
                    break;
                }
                case "14" : { 
                    try{ await test_ffmpeg_res("1920","1080","stream1m","14"); }catch (err){ console.log("HATA");} break;}
                case "15" : {await test_ffmpeg_res("640","368","stream2m","15"); break;}
                case "16" : {results = await test_ffmpeg_res("1920","1080","stream1","16"); break;}
                case "17" : {await test_ffmpeg_res("640","368","stream2","17"); break;}
                case "21" : {
                    console.log("Test 21 Başladı.");
                    for(var i = 1; i<5; i++){                        
                        await nav.toVersion(page, ip);
                        await nav.toLive(page,ip);
                        await mask.select_mask(page, i);
                        await mask.mask_size(page, "10", "10");
                        await mask.mask_visible(page);
                        //////APPLY/////
                        await mask.mask_refresh(page);
                        await mask.mask_apply(page);
                        await page.waitFor(5000);
                        await mask.mask_popup(page);
                    }
                    
                    for(var i = 1; i<5; i++){
                        await nav.toVersion(page, ip);
                        await nav.toLive(page,ip);
                        await mask.select_mask(page, i);
                       for( let j = 0; j<15; j++){                        
                        if(i == 1){
                            await mask.mask_up(page);
                            await page.waitFor(250);
                            await mask.mask_left(page);
                            await page.waitFor(250);
                        }
                        else if(i == 2){
                            await mask.mask_up(page);
                            await page.waitFor(250);
                            await mask.mask_right(page);
                            await page.waitFor(250);
                        }
                        else if(i == 3){
                            await mask.mask_down(page);
                            await page.waitFor(250);
                            await mask.mask_left(page);
                            await page.waitFor(250);
                        }
                        else if(i == 4){
                            await mask.mask_down(page);
                            await page.waitFor(250);
                            await mask.mask_right(page);
                            await page.waitFor(250);
                        }
                      }
                        await mask.mask_refresh(page);
                    }         
                    break;
                }
                case "22": {console.log(" ");
                        console.log("Test 22 Başladı.");
                        await nav.toEncodingHigh(page,ip);
                        await encoding.set_intraframe(page, "15");
			await encoding.set_bit_con(page, "cbr");
                        await encoding.set_codding_quality(page, "orta");
                        await encoding.set_bit_rate(page, "3");
                        await encoding.set_calc_method(page, "tan");
                        await encoding.apply(page);
                        console.log("Değerler Ayarlandı.");
                    break;
                }
                case "23": {// Kontrol 23
                        console.log(" ");
                        console.log("Test 23 Başladı.");
                        await nav.toEncodingLow(page,ip);
                        await encodingLow.set_intraframe(page, "15");
			await encodingLow.set_bit_con(page, "cbr");
                        await encodingLow.set_codding_quality(page, "orta");
                        await encodingLow.set_bit_rate(page, "0.4");
                        await encodingLow.apply(page);
                        console.log("Değerler Ayarlandı.");
                    break;
                }
                case "24": {//Kontrol 24
                        console.log(" ");
                        console.log("Test 24 Başladı.");
                        await nav.toResolution(page,ip);
                        await resolution.set_profile(page,"1080");
                        await resolution.set_resolution1(page,"1920 x 1080 (max:30fps");
                        await resolution.set_fps1(page,"10");
                        await resolution.apply(page);
                        console.log("Değerler Ayarlandı.");
                    break;
                }
                case "25": {//Kontrol 25
                        console.log(" ");
                        console.log("Test 25 Başladı.");
                        await nav.toCamera(page,ip);
                        await camera.set_ir_filter_mode(page,"gece");
                        await camera.set_ir_filter_transition(page,"Otomatik");
                        await camera.ir_filter_apply(page);
                        console.log("Değerler Ayarlandı.");
                    break;
                }
                case "28": {// TEST 28
                      console.log(" ");
                      console.log("Test 28 Başladı.");
                      /* 
                      await nav.toEncodingHigh(page,ip);
                      await encoding.set_intraframe(page, "12");
                      await encoding.set_bit_con(page, "vbr");
                      await encoding.set_codding_quality(page, "yüksek");
                      await encoding.set_bit_rate(page, "3.338");
                      await encoding.set_calc_method(page, "tan");
                      await encoding.apply(page);
                      console.log("OPTIONS SETTED "); 
                      */
                      await nav.toEncodingHigh(page,ip);
                      await encoding.test_intraframe(page);
                      await encoding.test_bit_con(page);
                      await encoding.test_codding_quality(page);
                      await encoding.test_bit_rate(page);
                      await encoding.test_calc_method(page);
                    break;
                }
                case "29": {// TEST 29
                      console.log(" ");
                      console.log("Test 29 Başladı.");
                      await nav.toEncodingLow(page,ip);
                      await encodingLow.test_intraframe(page);
                      await encodingLow.test_bit_con(page);
                      await encodingLow.test_bit_rate(page);
                      await encodingLow.test_codding_quality(page);
                    break;
                }
                case "30": { // TEST 30

                      console.log(" ");  
                      console.log("Test 30 Başladı.");
                      await nav.toResolution(page,ip);
                      await resolution.test_profile(page);
                      await resolution.test_resolution1(page);
                      await resolution.test_fps1(page);
                      await resolution.test_resolution2(page);
                      await resolution.test_fps2(page);
                    break;
                }
                case "31": { //TEST 31
                      console.log("Test 31 Başladı.");
                      console.log("Vlc programı açıldıktan sonra 15 dakika görüntüyü izleyin ve görüntüde herhangi bir bozulma varmı kontrol edin. Sonrasında Vlc programını kapatın ve sonucu konsola yazın");
                      var command = 'vlc rtsp://'+ip+'/stream1m';
                      proc =await require('child_process').exec(command);
                      select1 = await question.ask("Görüntüde istenmeyen bozukluklar var mı? e/h");
                      select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                      if ( (select1 == "h" || select1 == "H") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                    break;
                    
                }
                case "32": { //TEST 32
                    console.log("Test 32 Başladı.");
                      var command = 'vlc rtsp://'+ip+'/stream2m';
                      proc =await require('child_process').exec(command);
                      console.log("Lütfen VLC programının açılmasını bekleyin.");
                      await page.waitFor(5000);
                      select1 = await question.ask("Görüntü Geldi mi ? e/h");
                      console.log("Lütfen VLC programı üzerinden görüntünün çözünürlüğünün 640*368 olduğunu kontrol edin.");
                      select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                      if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                      break;
                }
                case "33": { //TEST 33
                    console.log("Test 33 Başladı.");
                      var command = 'vlc rtsp://'+ip+'/stream1';
                      proc =await require('child_process').exec(command);
                      console.log("Lütfen VLC programının açılmasını bekleyin.");
                      await page.waitFor(5000);
                      select1 = await question.ask("Görüntü Geldi mi ? e/h");
                      console.log("Lütfen VLC programı üzerinden görüntünün çözünürlüğünün 1920*1080 olduğunu kontrol edin.");
                      select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                      if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                      break;
                }
                case "34": { //TEST 34
                    console.log("Test 34 Başladı.");
                      var command = 'vlc rtsp://'+ip+'/stream2';
                      proc =await require('child_process').exec(command);
                      console.log("Lütfen VLC programının açılmasını bekleyin.");
                      await page.waitFor(5000);
                      select1 = await question.ask("Görüntü Geldi mi ? e/h");
                      console.log("Lütfen VLC programı üzerinden görüntünün çözünürlüğünün 640*368 olduğunu kontrol edin.");
                      select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                      if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                      break;
                }
                
                case "37": {//TEST 37
                      console.log(" ");  
                      console.log("Test 37 Başladı.");
                      await nav.toVersion(page,ip);
                      await version.test_application(page);
                      await version.test_firmware(page);
                    break;
                }
                case "38": {//TEST 38
                      console.log("");
                      console.log("Test 38 Başladı.");
                      await nav.toAlarm(page,ip);
                      await alarm.test_sei_selected(page);
                    break;
                }
                case "39": {//TEST 39
                      console.log("Test 39 Başladı.");
                      await nav.toAlarm(page,ip); 
                      await alarm.set_motion_detector(page,"Açık"); 
                      await alarm.set_motion_threshold(page, "50");
                      await alarm.set_apply(page);
                      console.log("Kameranın görüntüsünü DEFNE üzerinden izleyin. Kameranın önüne geçerek SEI Alarm Bilgisinin geldiği ve sol üst köşede kırmızı fontlu alarm bilgisinin gelmediğini gözlemleyin");
                      select1 = await question.ask("Kameranın önüne geçildiğinde SEI Alarm bilgisi geldi mi ? e/h");
                      select2 = await question.ask("Sol üst köşede kırmızı fontlu alarm bilgisi geldi mi? e/h");
                       if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                    break;
                }
                case "40":{//TEST 40
                                     console.log("Test 40 Başladı.");
                      await nav.toAlarm(page,ip);
                      var is_active = await alarm.test_alarm_active(page); 
                      if(!is_active) await alarm.set_alarm_active(page); 
                      await alarm.set_motion_detector(page, "Kapalı"); 
                      await alarm.set_apply(page); 
                      console.log("Kameranın görüntüsünü DEFNE üzerinden izleyin. Kameranın önüne geçerek SEI Alarm Bilgisinin geldiği ve sol üst köşede kırmızı fontlu alarm bilgisinin gelmediğini gözlemleyin");
                      select1 = await question.ask("Kameranın önüne geçildiğinde SEI Alarm bilgisi geldi mi ? e/h");
                      select2 = await question.ask("Sol üst köşede kırmızı fontlu alarm bilgisi geldi mi? e/h");
                       if ( (select2 == "h" || select2 == "H") && (select1 =="e"|| select1=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                    break;
                    
                }
                case "41": {//TEST 41
                      
                      console.log("");
                      console.log("Test 41 Başladı.");
                      await nav.toCamera(page,ip);
                      await camera.test_ir_filter_mode(page, "0");
                      await camera.test_ir_filter_transition(page, "0");
                    break;
                }
                case "42": {//TEST 42
                      console.log("Test 42 Başladı.");
                      await nav.toCamera(page,ip);
                      await camera.set_ir_filter_mode(page,"oto");
                      await camera.ir_filter_apply(page);
                      await nav.toResolution(page,ip);
                      var command = 'vlc rtsp://'+ip+'/stream1';
                      proc =await require('child_process').exec(command);
                      select1 = await question.ask("Kamera gündüz modunda mı ? e/h");
                      console.log("Lütfen kameranızın merceğini bir cisimle kapatın...");
                      console.log("Vlc programı üzerinden kamera modunu kontrol edin...");
                      select2 = await question.ask("Kamera gece modunda mı ? e/h");
                      console.log("Lütfen kameranızın merceğinin önündeki cismi kaldırın...");
                      console.log("Vlc programı üzerinden kamera modunu kontrol edin...");
                      select3 = await question.ask("Kamera gündüz modunda mı ? e/h");
                      await nav.toCamera(page,ip);
                      await camera.set_ir_filter_mode(page,"manuel");
                      await camera.ir_filter_apply(page);
                      if ((select1 == "e" || select1 == "E")&&(select2 == "e" || select2 == "E")&&(select3 == "e" || select3 == "E"))
                          console.log("Test 42 Başarılı");
                      else
                          console.log("Test 42 Başarısız");
                      break;
                }
                case "43": {//TEST 43
                     console.log("Test 43 Başladı.");
                      await nav.toVersion(page, ip);
                      await page.waitFor(1000);
                      await nav.toLive(page,ip);
                      console.log("Lütfen Chrome uygulaması üzerinden kamera görüntüsünün gelip gelmediğine bakın ...");
                      select1 = await question.ask("Görüntü geldi mi ? e/h");
                      if (select1=="e"||select1=="E")
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                      break;
                                         
                }
                case "44":{
                      console.log("Test 44 Başladı.");
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                      console.log("Kameranın gücü kesilir ve bir süre beklendikten sonra tekrar verilir.  Kameranın canlı görüntüsü izlenmeye başladıktan bir süre sonra yine kameranın gücü kesilir bir süre beklenir. Ardından kameranın gücü tekrar verilir. Bu işlem aynı şekilde 1 kez daha tekrarlanır. Toplamda 3 sefer bu işlem yapıldıktan sonra kameranın canlı görüntüsü VLC üzerinden izlenir ve web arayüzüne giriş yapılır. Web arayüzüne giriş yapılabildiği, görüntü çekilebildiği ve görüntüde maskelerin olması gereken yerlede görüldüğü test edilerek doğrulanır.");
                      select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi? e/h");
                      if (select1=="e"||select1=="E")
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                      break;
                }
                case "45":{
                      console.log("Test 45 Başladı.");
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                      console.log("Kamera web arayüzü üzerinden yeniden başlatılır. Kamera arayüzüne erişim sağlandıktan sonra bu işlem aynı şekilde toplamda 3 sefer tekrarlanır. Daha sonra kameranın canlı görüntüsü VLC üzerinden izlenir ve web arayüzüne giriş yapılır. Bu işlemlerin  sonucunda istenilen işlemlerin sorunsuz bir şekilde yapıldığı gözlemlenerek doğrulanır.");
                      select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi ? e/h");
                      if (select1=="e"||select1=="E")
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                      break;
                }
                case "46": {//TEST 46
                      console.log("");
                      console.log("Test 46 Başladı.");
                      await nav.toTime(page,ip);
                      await time.test_ntp_server1(page, "pool.ntp.org");
                    break;
                }
                case "47":{
                      console.log("Test 47 Başladı.");
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                      console.log("Test bilgisayarından kameranın 1.stream adresi kullanılarak(rtsp://<KameraIPAdresi>/stream1) VLC üzerinden 5 adet unicast görüntü oynatılır. 5 adet unicast görüntü çekilirken görüntüde herhangi bir takılma, mozaiklenme, bozulma olmadığı gözlemlenerek kameradan istenilen çözünürlük ve fps değerinde en az 5 adet unicast yayın akışı başlatılabildiği doğrulanır.");
                      select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi ? e/h");
                      if (select1=="e"||select1=="E")
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                      break;
                    
                }
                case "48":{
                      console.log("Test 48 Başladı.");
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                      console.log("DEFNE yazılımı üzerinden test yapılan kameranın canlı görüntüsü açılır. Görüntünün oynadığı pencerede herhangi bir noktaya tıklanır ve Yakınlaştırma(Zoom) Tipi değeri Optik Yakınlaştırma olarak seçilir. Bu işlemden sonra mouse yardımı ile zoom in yapılır. Kameranın 3x zoom yapabildiği üst yazı ile gözlemlenerek doğrulanr.");
                      select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi ? e/h");
                      if (select1=="e"||select1=="E")
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                      break;
                }
                case "49":{
                      console.log("Test 49 Başladı.");
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                      console.log("Kamera web arayüzü üzerinden yeniden başlatılır. Kamera arayüzüne erişim sağlandıktan sonra bu işlem aynı şekilde toplamda 3 sefer tekrarlanır. Daha sonra kameranın canlı görüntüsü VLC üzerinden izlenir ve web arayüzüne giriş yapılır. Bu işlemlerin  sonucunda istenilen işlemlerin sorunsuz bir şekilde yapıldığı gözlemlenerek doğrulanır.");
                      select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi ? e/h");
                      if (select1=="e"||select1=="E")
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                      break;
                }
                case "50":{
                      console.log("Test 50 Başladı.");
                      console.log("VLC şimdi açılacak. Lütfen görüntüyü 20 saniye izleyin ve sonra console ekranına geri dönün.");
                      await nav.toCamera(page,ip);
                      await camera.focus_one_shot(page);
                      var command = 'vlc rtsp://'+ip+'/stream1';
                      proc =await require('child_process').exec(command);
                      await page.waitFor(9000);
                      await camera.focus_plus(page);
                      select1 = await question.ask("Kameranın focus ayarında bir değişiklik var mı ? e/h");
                      if (select1=="e"||select1=="E")
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                      break;
                }
                case "51":{
                    console.log("Test 51 Başladı.");
                      console.log("VLC şimdi açılacak. Lütfen görüntüyü 20 saniye izleyin ve sonra console ekranına geri dönün.");
                      await nav.toCamera(page,ip);
                      var command = 'vlc rtsp://'+ip+'/stream1';
                      proc =await require('child_process').exec(command);
                      await page.waitFor(9000);
                      await camera.focus_minus(page);
                      select1 = await question.ask("Kameranın focus ayarında bir değişiklik var mı ? e/h");
                      if (select1=="e"||select1=="E")
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                      break;
                }
                case "52":{
                    console.log("Test 52 Başladı.");
                      console.log("VLC şimdi açılacak. Lütfen görüntüyü 20 saniye izleyin ve sonra console ekranına geri dönün.");
                      await nav.toCamera(page,ip);
                      var command = 'vlc rtsp://'+ip+'/stream1';
                      proc =await require('child_process').exec(command);
                      await page.waitFor(9000);
                      await camera.focus_one_shot(page);
                      select1 = await question.ask("Kameranın focus ayarı düzeldi mi ? e/h");
                      if (select1=="e"||select1=="E")
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                      break;
                }
                case "53": {await test_set_res_fps(page,1,0);
                    await test_ffmpeg_res_fps("stream1",53);
                    break;
                }
                case "54": {await test_set_res_fps(page,1,1);
                    await test_ffmpeg_res_fps("stream1",54);
                    break;
                }
                case "55": {await test_set_res_fps(page,1,2);
                    await test_ffmpeg_res_fps("stream1",55);
                    break;
                }
                case "56": {await test_set_res_fps(page,1,3);
                    await test_ffmpeg_res_fps("stream1",56);
                    break;
                }
                case "57": {await test_set_res_fps(page,2,0);
                    await test_ffmpeg_res_fps("stream2",57);
                    break;
                }
                case "58": {await test_set_res_fps(page,2,1);
                    await test_ffmpeg_res_fps("stream2",58);
                    break;
                }
                case "59": {await test_set_res_fps(page,2,2);
                    await test_ffmpeg_res_fps("stream2",59);
                    break;
                }
                case "60": {await test_set_res_fps(page,2,3);
                    await test_ffmpeg_res_fps("stream2",60);
                    break;
                }
                case "61": {
                    console.log("Test 61 Başladı.");
                    await nav.toRTSP(page,ip);
                    await rtsp.rtsp_set(page, "Tanımlı kullanıcı", "admin",1);
                    console.log("Lütfen VLC'den yayının açılmasını bekleyin. Yayın açıldıktan sonra gelen 'RTSP kimlik doğrulaması' ekranında  kullanıcı adı:'admin' ve parola:'admin' olarak girilerek 'Ok' butonuna tıklayın.");
                    await page.waitFor(4000);
                    var command = 'vlc rtsp://'+ip+'/stream1';
                    proc =await require('child_process').exec(command)
                    await page.waitFor(3000);
                    select1 = await question.ask("RTSP kimlik doğrulama ekranı geldi mi? e/h");
                    select2 = await question.ask("Yayın geldi mi? e/h");
                      if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                    break;
                }
                case "62": {
                    console.log("Test 62 Başladı.");
                    await nav.toRTSP(page,ip);
                    await rtsp.rtsp_set(page, "Tanımlı kullanıcı", "admin",1);
                    console.log("Lütfen VLC'den yayının açılmasını bekleyin. Yayın açıldıktan sonra gelen 'RTSP kimlik doğrulaması' ekranında  kullanıcı adı:'admin' ve parola:'admin' olarak girilerek 'Ok' butonuna tıklayın.");
                    await page.waitFor(4000);
                    var command = 'vlc rtsp://'+ip+'/stream2';
                    proc =await require('child_process').exec(command)
                    await page.waitFor(3000);
                    select1 = await question.ask("RTSP kimlik doğrulama ekranı geldi mi? e/h");
                    select2 = await question.ask("Yayın geldi mi? e/h");
                      if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                    break;
                }
                case "63": {
                    console.log("Test 63 Başladı.");
                    await nav.toRTSP(page,ip);
                    await rtsp.rtsp_set_no(page,0);
                    var command = 'vlc rtsp://'+ip+'/stream1';
                    proc =await require('child_process').exec(command)
                    select1 = await question.ask("RTSP kimlik doğrulama ekranı geldi mi? e/h");
                    select2 = await question.ask("Yayın geldi mi? e/h");
                      if ( (select1 == "h" || select1 == "H") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                    break;
                }
                case "65": {//TEST 65
                      console.log("Test 65 Başladı.");
                      await nav.toAlarm(page,ip); 
                      await alarm.set_motion_detector(page,"a");
                      await alarm.set_motion_threshold(page, "50");
                      await alarm.set_apply(page);
                      console.log("Kameranın görüntüsünü DEFNE üzerinden izleyin. Kameranın önüne geçerek SEI Alarm Bilgisinin geldiği ve sol üst köşede kırmızı fontlu alarm bilgisinin gelmediğini gözlemleyin");
                      select1 = await question.ask("Kameranın önüne geçildiğinde SEI Alarm bilgisi geldi mi ? e/h");
                      select2 = await question.ask("Sol üst köşede kırmızı fontlu alarm bilgisi geldi mi? e/h");
                       if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                    break;
                }
                case "66":{//TEST 66
                      console.log("Test 66 Başladı.");
                      await nav.toAlarm(page,ip);
                      var is_active = await alarm.test_alarm_active(page); 
                      if(!is_active) await alarm.set_alarm_active(page);
                      await alarm.set_motion_detector(page, "k");
                      await alarm.set_apply(page);
                      console.log("Kameranın görüntüsünü DEFNE üzerinden izleyin. Kameranın önüne geçerek SEI Alarm Bilgisinin geldiği ve sol üst köşede kırmızı fontlu alarm bilgisinin gelmediğini gözlemleyin");
                      select1 = await question.ask("Kameranın önüne geçildiğinde SEI Alarm bilgisi geldi mi ? e/h");
                      select2 = await question.ask("Sol üst köşede kırmızı fontlu alarm bilgisi geldi mi? e/h");
                       if ( (select1 == "e" || select1 == "E") && (select2 =="h"|| select2=="H"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                      break;
                    
                }
                case "69":{//TEST 69
                      console.log("Test 69 Başladı.");
                      await nav.toVersion(page, ip);
                      await nav.toLive(page,ip);
                      console.log("Test 21'de oluşturulan 4 adet maskenin canlı izlemede görüldüğü ve konumlarının aynı kaldığını gözlemleyin");
                      select1 = await question.ask("4 adet maske görüldü mü? e/h");
                      select2 = await question.ask("Maskelerin konumları aynı mı? e/h");
                       if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                    break;
                }
                   case "70":{//TEST 70
                      console.log("Test 70 Başladı.");
                      await nav.toVersion(page, ip);
                      await nav.toLive(page,ip);
                      console.log("Tanımlanmış maskelerden bir tanesi 'Maske ID' sekmesinden seçilir ve yönlendirme yapılır. Yönlendirme yapıldıktan sonra(maske sol, maske sağ, maske yukarı, maske aşağı) genişlik ve yükseklik değiştirilip 'Maskeyi güncelle' butonuna basılır. Bu durumda maskenin yeni özellikleri aldığı ve güncellendiği gözlemlenerek doğrulanır. Kamera yeniden başlatılır ve görüntü geldiğinde güncellenen maskenin yeni yerinde olduğu gözlemlenir.");
                      select1 = await question.ask("Ayarlarında değişiklik yapılan maske yeni özellikleri aldı mı? e/h");
                      select2 = await question.ask("Kamera yeniden başlatıldıktan ve görüntü geldikten sonra güncellenen maske son konumunu korudu mu? e/h");
                       if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                    break;
                }
                case "71" : {
                    console.log("Test 71 Başladı.");
                    console.log("Lütfen maskelerin oluşturulmasını bekleyiniz.");
                    for(var i = 5; i<11; i++){                        
                        await nav.toVersion(page, ip);
                        await nav.toLive(page,ip);
                        await mask.select_mask(page, i);
                        await mask.mask_size(page, "10", "10");
                        await mask.mask_visible(page);
                        //////APPLY/////
                        await mask.mask_refresh(page);
                        await mask.mask_apply(page);
                        await page.waitFor(5000);
                        await mask.mask_popup(page);
                    }
                    
                    for(var i = 5; i<11; i++){
                        await nav.toVersion(page, ip);
                        await nav.toLive(page,ip);
                        await mask.select_mask(page, i);
                       for( let j = 0; j<40; j++){                        
                        if(i == 5){
                            await mask.mask_up(page);
                            await page.waitFor(250);
                        }
                        else if(i == 6){
                            await mask.mask_down(page);
                            await page.waitFor(250);
                        }
                        else if(i == 7){
                            await mask.mask_left(page);
                            await page.waitFor(250);
                        }
                        else if(i == 8){
                            await mask.mask_right(page);
                            await page.waitFor(250);
                        }
                        else if(i == 9){
                            await mask.mask_down(page);
                            await page.waitFor(250);
                            await mask.mask_right(page);
                            await page.waitFor(250);
                        }
                        else if(i == 10){
                            await mask.mask_up(page);
                            await page.waitFor(250);
                            await mask.mask_left(page);
                            await page.waitFor(250);
                        }
                      }
                        
                    } 
                    await mask.mask_refresh(page);
                        console.log("Maskeler oluşturuldu ve konumlandırıldı.");
                        console.log("Lütfen web arayüzünden oluşturulan maskeleri kontrol ediniz.");
                        select1 = await question.ask("8 adet maske tespit edildi mi? e/h");
                        console.log("Lütfen web arayüzünden 'Canlı İzleme' sekmesinden zoom değerlerini değiştirerek oluşturulan 9. ve 10. maskenin geldiğini gözlemleyerek kontrol ediniz.");
                        select2 = await question.ask("10 adet maske tespit edildi mi? e/h");
                        if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                        else
                          console.log("Test Başarısız");
                    break;
                }
                default: console.log("Test "+test_number+" bulunamadı lütfen tekrar deneyin..");
                
            }
                
	}
	
	////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////DOKUMAN_2__TESTLERİ////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////

	module.exports.start_2 = async function(page, test_number,url) {
            ip = url;
            switch(test_number){
                case "14" : { 
                    try{ await test_ffmpeg_res("1920","1080","stream1m","14"); }catch (err){ console.log("HATA");} break;}
                case "15" : {await test_ffmpeg_res("640","368","stream2m","15"); break;}
                case "16" : {results = await test_ffmpeg_res("1920","1080","stream1","16"); break;}
                case "17" : {await test_ffmpeg_res("640","368","stream2","17"); break;}
                case "21":{
                        console.log("Test Doc2-33 STARTED");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        var list1=["3","7"];
                        var list2=["preset3","preset7"];
                        for(let i=0;i<2;i++){
                        preset_location = await question.ask(list1[i]+". preset konumunu Pan,Tilt,Zoom Ayarları bölümündeki kontrol butonlarını kullanarak seçip Enter tuşuna basın...");
                        await cam.set_preset_setting(page,list1[i],list2[i]);
                        await cam.preset_setting_apply(page);}
                        console.log("Presetler başarıyla kaydedildi");
                        
                        cam.set_patrol_setting(page,"3,7","5,10");
                        await page.waitFor(2000);
                        console.log("Kameranın hareketini izleyin. 3 ve 7 numaralı indislere gidip sırasıyla 5 ve 10 saniye kalarak desene devam ettiğini gözlemleyin.");
                        select1 = await question.ask("Kamera belirtilen zaman aralığı içerisinde girilen presetlere gidip ve orada belirlenen süre kadar bekledi mi ? e/h");
                        if ( select1 == "e" || select1 == "E")
                          console.log("Test Başarılı");
                        else
                          console.log("Test Başarısız");
                        
                    break;
                }
                case "22": {
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        preset_location = await question.ask("Alarmın preset konumunu Pan,Tilt,Zoom Ayarları bölümündeki kontrol butonlarını kullanarak seçip Enter tuşuna basın...");
                        await cam.set_preset_setting(page,"1","alarm");
                        await cam.preset_setting_apply(page);
                        console.log("Alarm konumu başarıyla kaydedildi");
                        await nav_dome.toDomeAlarm(page,ip);
                        await alarm_dome.set_preset_id(page,"1");
                        await alarm_dome.check_turn_location(page,1);
                        await alarm_dome.alarm_apply(page);
                        console.log("OPTIONS SETTED ");
                    break;
                }
                case "23": {//TEST23
                        console.log(" ");
                        console.log("Control Doc2-23 STARTED");
                        await nav_dome.toDomeCamera(page,ip);
                        await cam.check_turn_to_task(page,"0");
                        await cam.set_goto_home(page,"100")
                        await cam.goto_home_apply(page);
                        console.log("OPTIONS SETTED ");   
                    break;
                    
                }
                
                case "27": {//TEST27
                        console.log(" ");
                        console.log("Control Doc2-27 STARTED");
                        await nav_dome.toDomeEncodingHigh(page,ip);
                        await encodingH.set_intraframe(page, "15");
                        await encodingH.set_bit_con(page, "cbr");
                        await encodingH.set_codding_quality(page, "Yüksek");
                        await encodingH.set_calc_met(page, "Tanımlı");
                        await encodingH.apply(page);
                        console.log("OPTIONS SETTED ");   
                    break;
                    
                }
                case "28": {//TEST28
                        console.log(" ");
                        console.log("Control Doc2-28 STARTED");
                        await nav_dome.toDomeEncodingLow(page,ip);
                        await encodingLow_dome.set_intraframe(page, "15");
                        await encodingLow_dome.set_bit_con(page, "cbr");
                        await encodingLow_dome.set_codding_quality(page, "Yüksek");
                        await encodingLow_dome.set_bit_rate(page, "1");
                        await encodingLow_dome.apply(page);
                        console.log("OPTIONS SETTED ");
                    break;
                    
                }
               /* case "29": {//TEST29
                        console.log(" ");
                        console.log("Control Doc2-29 STARTED");
                        await nav_dome.toResolution(page,ip);
                        await resolution_dome.set_stream_mode(page,"sadece yayın1");
                        await resolution_dome.set_resolution1(page,"1280 x 720 (max:30fps");
                        await resolution_dome.set_fps1(page,"10");
                        await resolution_dome.apply(page);
                        console.log("OPTIONS SETTED ");
                    break;
                    
                }*///statik kamera için
                case "30": {
                        console.log("Test Doc2-33 STARTED");
                        await nav_dome.toDomeCamera(page,ip);
                        await cam.set_ir_filter_mode(page,"gece");
                        await cam.set_ir_filter_transition(page,"manuel");
                        await cam.set_ir_filter_treshold(page,"manuel");
                        await cam.ir_filter_apply(page);
                        console.log("OPTIONS SETTED ");
                        break;
                }
                case "33": {//TEST33
                        console.log(" ");
                        console.log("Test Doc2-33 STARTED");
                        await nav_dome.toDomeEncodingHigh(page,ip);
                        await encodingH.test_intraframe_2(page);
                        await encodingH.test_bit_con_2(page);
                        await encodingH.test_codding_quality_2(page);
                        await encodingH.test_bit_rate_2(page);
                        await encodingH.test_calc_method_2(page);
                    break;
                    
                }
                case "34": {//TEST34
                        console.log(" ");
                        console.log("Test Doc2-34 STARTED");
                        await nav_dome.toDomeEncodingLow(page,ip);
                        await encodingLow_dome.test_intraframe_2(page);
                        await encodingLow_dome.test_bit_con_2(page);
                        await encodingLow_dome.test_bit_rate_2(page);
                        await encodingLow_dome.test_codding_quality_2(page);
                    break;
                    
                }
               /* case "35": {//TEST35
                        console.log(" ");  
                        console.log("Test Doc2-35 STARTED");
                        await nav_dome.toResolution(page,ip);
                        await resolution_dome.test_profile_2(page);
                        await resolution_dome.test_stream_mode_2(page);  
                        await resolution_dome.test_resolution1_2(page);
                        await resolution_dome.test_fps1_2(page);
                        await resolution_dome.test_resolution2_2(page);
                        await resolution_dome.test_fps2_2(page);
                    break;
                    
                } *////statik kamera için  
                case "36": { //TEST 36
                      console.log("Test 36 Başladı");
                      console.log("Vlc programı açıldıktan sonra 15 dakika görüntüyü izleyin ve görüntüde herhangi bir bozulma varmı kontrol edin. Sonrasında Vlc programını kapatın ve sonucu konsola yazın");
                      var command = 'vlc rtsp://admin:admin@'+ip+'/stream1m';
                      proc =await require('child_process').exec(command);
                      select1 = await question.ask("Görüntüde istenmeyen bozukluklar var mı? e/h");
                      select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                      if ( (select1 == "h" || select1 == "H") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                    
                }
                case "37": { //TEST 37
                      var command = 'vlc rtsp://admin:admin@'+ip+'/stream2m';
                      proc =await require('child_process').exec(command);
                      select1 = await question.ask("Görüntü Geldi mi ? e/h");
                      select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                      if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                      break;
                }
                case "38": { //TEST 38
                      var command = 'vlc rtsp://admin:admin@'+ip+'/stream1';
                      proc =await require('child_process').exec(command);
                      select1 = await question.ask("Görüntü Geldi mi ? e/h");
                      select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                      if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                      break;
                }
                case "39": { //TEST 39
                      var command = 'vlc rtsp://admin:admin@'+ip+'/stream2';
                      proc =await require('child_process').exec(command);
                      select1 = await question.ask("Görüntü Geldi mi ? e/h");
                      select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                      if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                      break;
                }
                case "42": {//TEST 42
                      console.log(" ");  
                      console.log("Test 42 Started");
                      await nav.toVersion(page,ip);
                      await version.test_application(page);
                      await version.test_firmware(page);
                    break;
                }
                case "43": { //TEST-43
                        console.log("");
                        console.log("Test Doc2-43 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.turn_to_task_value(page);
                        console.log("Test is completed!");
                    break;
                    
                }
                case "44": {//TEST-44
                        console.log("");
                        console.log("Test Doc2-44 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.turn_to_task_control(page);
                        console.log("Test is completed!");
                    break;
                    
                }   
                case "45": {
                        console.log("Test Doc2-45 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await cam.test_patrol_preset(page);
                        console.log("Test is completed!");
                        break;

                }
                case "46": {
                        console.log("Test Doc2-46 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await cam.test_patrol_time_range(page);
                        console.log("Test is completed!");
                        break;
                }
                case "47": {//TEST-47
                        console.log("");
                        console.log("Test Doc2-47 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        for (let i = 0; i < 9; i++){
                        await cam.set_patrol_id(page,i+".");
                        await page.waitFor(2000);
                        }
                        console.log("Test is completed!");
                    break;
                    
                }
                case "50":{
                        console.log("Test Doc2-50 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await cam.test_ir_filter_mode(page,"0");
                        await cam.test_ir_filter_transition(page,"1");
                        await cam.test_ir_filter_treshold(page,"8");
                        console.log("Test is completed!");
                        break;
                }
                case "56": {//TEST-56
                        console.log("");
                        console.log("Test Doc2-56 Started");
                        await nav_dome.toTimeSettings(page,ip);
                        await page.waitFor(2000);
                        await timeSet.test_np1_value(page);
                        await timeSet.apply(page);
                        console.log("Test is completed!");
                    break;
                    
                }
                case "58": {//TEST-58
                        console.log("");
                        console.log("Test Doc2-58 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.ir_cut_open(page);
                        await cam.lighting_level(page,"manuel");
                        console.log("Lütfen kameranın merceğini görebileceğiniz bir konuma getirin ");
                        var results = [];
                        var level = ["level0","level1","level2","level3","level4","level5","level6","AUTO"];
                        for (let i = 0; i < 8; i++){
                        await cam.lighting_level(page,level[i]);
                        await page.waitFor(3000);
                        select1 = await question.ask("IR led yanıyor mu ? e/h");
                            if (select1=="e"||select1=="E")
                                results[i] = 1;
                            else
                                results[i] = 0;
                      
                        }
                        console.log("Test is completed!");
                    break;
                    
                }
                case "61": {await test_set_res_fps_DOM(page,0,1);
                    await test_ffmpeg_res_fps('stream1',61);
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
                case "69":{
                        console.log("");
                        console.log("Test Doc2-69 Started");
                        await nav_dome.toRTSP(page,ip);
                        rtsp.rtsp_set(page,"tanımlı","admin",1);
                        console.log("OPTIONS SETTED");
                        capture_test.watch_rtsp(ip,"stream1",1);
                        console.log("Test is completed!");
                    break;
                }
                case "70":{
                        console.log("");
                        console.log("Test Doc2-70 Started");
                        await nav_dome.toRTSP(page,ip);
                        rtsp.rtsp_set(page,"tanımlı","admin",1);
                        console.log("OPTIONS SETTED");
                        capture_test.watch_rtsp(ip,"stream2",1);
                        console.log("Test is completed!");
                    break;
                }
                case "71":{
                        console.log("");
                        console.log("Test Doc2-71 Started");
                        await nav_dome.toRTSP(page,ip);
                        rtsp.rtsp_set_no(page,0);
                        console.log("OPTIONS SETTED");
                        capture_test.watch_rtsp(ip,"stream1",0);
                        console.log("Test is completed!");
                    break;
                }
                case "75":{
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                      console.log("Kamera sabit bir noktaya bakarken kameranın gücü kesilir. Güç kapalı iken kameranın baktığı açı ve kameranın konumu değiştirilir. Kameraya tekrar güç verildiğinde güç kesilmeden önceki konumuna döndüğü ve o noktaya bakmaya başladığı gözlemlenerek doğrulanır.");
                      select1 = await question.ask("Kamera gücü kesilmeden önceki konumuna döndü mü? e/h");
                      if (select1=="e"||select1=="E")
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                    break;
                }
                case "77":{//77-78
                        console.log("");
                        console.log("Control Doc2-77 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_goto_home(page,"50");
                        await cam.check_turn_to_task(page,"1");
                        await cam.goto_home_apply(page);
                        await cam.set_pattern(page); 
                        await cam.pattern_run(page);
                        console.log("Lütfen kamerayı bir süre gözlemleyiniz..");
                        select1 = await question.ask("Kamera deseni gerçekleştiriyor mu? e/h");
                        if(select1=="e"||select1=="E")
                        {
                            await cam.PTZ(page);
                            var command=child_process.execSync("date +%T");
                            console.log("Son müdehale saati:"+command);
                            select3 = await question.ask("Kameranın hareketi durdu mu? e/h");
                            if(select3=="e"||select3=="E")
                            {                        
                                await timer(page,50);
                                await page.waitFor(50000);
                                select2 = await question.ask("Kamera bu süre sonunda desene devam etti mi? e/h");
                                if (select2=="e"||select2=="E"){
                                    var command1=child_process.execSync("date +%T");
                                    console.log("Desene yeniden başlama saati:"+command1);
                                    console.log("Test Başarılı");}
                                else
                                    console.log("Test Başarısız");
                            }
                            else
                                console.log("Test Başarısız");
                            
                        }
                        else
                            console.log("Test Başarısız");
                        console.log("Test is completed!");
                    
                    break;
                }
                case "79":{
                        console.log("");
                        console.log("Control Doc2-79 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_pattern(page); 
                        await cam.pattern_run(page);
                        await nav_dome.toDomeVersion(page,ip);
                        await version_dome.reload(page);
                        console.log("Lütfen kameranın açılmasını bekleyin....");
                        select = await question.ask("Kamera açıldıktan sonra desene devam etti mi? e/h");
                        if (select=="e"||select=="E")
                            console.log("Test Başarılı");
                        else
                            console.log("Test Başarısız");
                    
                    break;
                }
                case "80":{
                        console.log("");
                        console.log("Control Doc2-80 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_pattern(page); 
                        await cam.pattern_run(page);
                        console.log("Lütfen aşağıdaki testi uygulayın. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                        console.log("Kamera desene devam ederken kameranın gücü kesilir. Bir süre(15 - 20 sn) beklendikten sonra kameranın gücü tekrardan verilir. Kamera açıldıktan sonra daha önce yapmakta olduğu işe devam ettiği kameranın hareketi gözlemlenerek doğrulanır.");
                        select = await question.ask("Kamera açıldıktan sonra desene devam etti mi? e/h");
                        if (select=="e"||select=="E")
                            console.log("Test Başarılı");
                        else
                            console.log("Test Başarısız");
                    
                    break;
                }
                case "81":{//81,82,83
                        var results= new Array();
                        var times= new Array();
                        console.log("");
                        console.log("Control Doc2-81 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_goto_home(page,"50");
                        await cam.check_turn_to_task(page,"1");
                        await cam.goto_home_apply(page);
                        await cam.set_pattern(page); ///daha önce kaydettiğimiz bir deseni çalıştırıyoruz. Bu kod için pattern_id:1
                        await cam.pattern_run(page);
                        select1 = await question.ask("Kamera deseni gerçekleştiriyor mu? e/h");
                        if(select1=="e"||select1=="E"){
                            select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                            times[0]=child_process.execSync("date +%T");
                            console.log("Alarm başlama saati:"+times[0]);
                            select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                            if(select2=="e"||select2=="E")
                                results[0]=1;
                            else
                                results[0]=0;
                            select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                            if(select3=="e"||select3=="E")
                                results[1]=1;
                            else
                                results[1]=0;
                            await timer(page,50);
                            await page.waitFor(50000);
                            select4 = await question.ask("Kamera daha önce yaptığı desene devam etti mi? e/h");
                            if(select4=="e"||select4=="E")
                            {
                                results[2]=1;
                                times[2]= child_process.execSync("date +%T");
                                console.log("Otopan hareketine yeniden başlama saati:"+times[2]);
                            }
                            else
                                results[2]=0;
                         
                        }
                        else
                            console.log("Test Başarısız");
                        console.log("Test is completed!");
                        
                    break;
                }
                case "84":{//84-94 arası
                        var results= new Array();
                        var times_bitis= new Array();
                        var times_basla= new Array();
                        var time_desen_devam;
                        console.log("");
                        console.log("Control Doc2-84 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_goto_home(page,"50");
                        await cam.check_turn_to_task(page,"1");
                        await cam.goto_home_apply(page);
                        await cam.set_pattern(page); ///daha önce kaydettiğimiz bir deseni çalıştırıyoruz. Bu kod için pattern_id:1
                        await cam.pattern_run(page);
                        select1 = await question.ask("Kamera deseni gerçekleştiriyor mu? e/h");
                        if(select1=="e"||select1=="E"){
                            for(var i=0 ; i<5 ; i++){
                            select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                            times_basla[i]=child_process.execSync("date +%T");
                            console.log((i+1)+". Alarm başlama saati:"+times_basla[i]);
                            await page.waitFor(10000);
                            select_2 =  await question.ask("Kabloyu yeniden takıp Enter tuşuna basın");
                            times_bitis[i]=child_process.execSync("date +%T");
                            console.log((i+1)+". Alarm bitiş saati:"+times_bitis[i]);
                            await page.waitFor(10000);}
                            select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                            if(select2=="e"||select2=="E")
                                results[0]=1;
                            else
                                results[0]=0;
                            select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                            if(select3=="e"||select3=="E")
                                results[1]=1;
                            else
                                results[1]=0;
                            await timer(page,50);
                            await page.waitFor(50000);
                            select4 = await question.ask("Kamera daha önce yaptığı desene devam etti mi? e/h");
                            if(select4=="e"||select4=="E")
                            {
                                results[2]=1;
                                time_desen_devam= child_process.execSync("date +%T");
                                console.log("Desene yeniden başlama saati:"+time_desen_devam);
                            }
                            else
                                results[2]=0;
                            
                        }
                        else
                            console.log("Test Başarısız");
                        console.log("Test is completed!");
                        
                    break;
                }
                case "95":{//95-98 arası
                        var results= new Array();
                        var times= new Array();
                        console.log("");
                        console.log("Control Doc2-95 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_goto_home(page,"50");
                        await cam.check_turn_to_task(page,"1");
                        await cam.goto_home_apply(page);
                        await cam.set_pattern(page); ///daha önce kaydettiğimiz bir deseni çalıştırıyoruz. Bu kod için pattern_id:1
                        await cam.pattern_run(page);
                        select1 = await question.ask("Kamera deseni gerçekleştiriyor mu? e/h");
                        if(select1=="e"||select1=="E"){
                            select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                            times[0]=child_process.execSync("date +%T");
                            console.log("Alarm başlama saati:"+times[0]);
                            select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                            if(select2=="e"||select2=="E")
                                results[0]=1;
                            else
                                results[0]=0;
                            select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                            if(select3=="e"||select3=="E")
                                results[1]=1;
                            else
                                results[1]=0;
                            await cam.PTZ(page);
                            times[2]=child_process.execSync("date +%T");
                            console.log("Kullanıcı müdehale saati:"+times[2]);
                            await timer(page,100);
                            await page.waitFor(100000);
                            select4 = await question.ask("Kamera kullanıcının bıraktığı konumda kalmaya devam etti mi? e/h");
                            times[3]=child_process.execSync("date +%T");
                            console.log("Hareket olmadığının en son kontrol edildiği saat:"+times[3]);
                            if(select4=="e"||select4=="E")
                                results[2]=1;
                            else
                                results[2]=0;
                        }
                        else
                            console.log("Test Başarısız");
                        console.log("Test is completed!");
                    break;
                }
                case "99":{//99-101 arası
                        var results= new Array();
                        var times= new Array();
                        console.log("");
                        console.log("Control Doc2-99 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_goto_home(page,"50");
                        await cam.check_turn_to_task(page,"0");
                        await cam.goto_home_apply(page);
                        await cam.set_pattern(page); ///daha önce kaydettiğimiz bir deseni çalıştırıyoruz. Bu kod için pattern_id:1
                        await cam.pattern_run(page);
                        select1 = await question.ask("Kamera deseni gerçekleştiriyor mu? e/h");
                        if(select1=="e"||select1=="E"){
                            select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                            times[0]=child_process.execSync("date +%T");
                            console.log("Alarm başlama saati:"+times[0]);
                            select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                            if(select2=="e"||select2=="E")
                                results[0]=1;
                            else
                                results[0]=0;
                        
                            select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                            if(select3=="e"||select3=="E")
                                results[1]=1;
                            else
                                results[1]=0;
                            await timer(page,100);
                            await page.waitFor(100000);
                            
                            select4 = await question.ask("Kamera preset konumda kalmaya devam etti mi? e/h");
                            times[3]=child_process.execSync("date +%T");
                            console.log("Hareket olmadığının en son kontrol edildiği saat:"+times[3]);
                            if(select4=="e"||select4=="E")
                                results[2]=1;
                            else
                                results[2]=0;
                        }
                        else
                            console.log("Test Başarısız");
                        console.log("Test is completed!");
                    break;
                }
                case "102":{//102-105
                        var results= new Array();
                        var times= new Array();
                        console.log("");
                        console.log("Control Doc2-99 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_goto_home(page,"50");
                        await cam.check_turn_to_task(page,"0");
                        await cam.goto_home_apply(page);
                        await cam.set_pattern(page); ///daha önce kaydettiğimiz bir deseni çalıştırıyoruz. Bu kod için pattern_id:1
                        await cam.pattern_run(page);
                        select1 = await question.ask("Kamera deseni gerçekleştiriyor mu? e/h");
                        if(select1=="e"||select1=="E"){
                            select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                            times[0]=child_process.execSync("date +%T");
                            console.log("Alarm başlama saati:"+times[0]);
                            select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                            if(select2=="e"||select2=="E")
                                results[0]=1;
                            else
                                results[0]=0;
                        
                            select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                            if(select3=="e"||select3=="E")
                                results[1]=1;
                            else
                                results[1]=0;
                            await cam.PTZ(page);
                            times[2]=child_process.execSync("date +%T");
                            console.log("Kullanıcı müdehale saati:"+times[2]);
                            await timer(page,100);
                            await page.waitFor(100000);
                            select4 = await question.ask("Kamera kullanıcının bıraktığı konumda kalmaya devam etti mi? e/h");
                            times[3]=child_process.execSync("date +%T");
                            console.log("Hareket olmadığının en son kontrol edildiği saat:"+times[3]);
                            if(select4=="e"||select4=="E")
                                results[2]=1;
                            else
                                results[2]=0;
                        }
                        else
                            console.log("Test Başarısız");
                        console.log("Test is completed!");
                    break;
                }
                case "107":{
                        await nav_dome.toDomeCamera(page,ip);
                        await ppp.set_preset(page);
                        await ppp.set_patrol(page);
                        await ppp.goto_home(page,1,"70");
                        await ppp.run_patrol(page);
                        await page.waitFor(9000);
                        await ppp.turn_left_right(page,"r");
                        console.log("Sayaç başlatıldı kamera patrole dönünce enter'a basın");
                        await ppp.time_pass(page);
                        await ppp.break_patrol(page);
                        console.log("Test done.");
                        
                        break;
                }
                case "111":{
                    var times = new Array();
                        await nav_dome.toDomeCamera(page,ip);
                        await ppp.set_preset(page);
                        await ppp.set_patrol(page);
                        await ppp.goto_home(page,1,"70");
                        await ppp.run_patrol(page);
                        console.log("Patrol başlatıldı lütfen DEFNE yazılımınızı çalıştırın...");
                        console.log("Lütfen saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkartarak alarm oluşturunuz...");
                        console.log("Lütfen alarmı oluşturduğunuzda 'ENTER'a basın");
                        times[0] = await ppp.push_time(page);
                        console.log("Lütfen alarm bittiğinde 'ENTER'a basın");
                        times[1] = await ppp.push_time(page);
                        console.log("Lütfen patrol tekrar başladığında 'ENTER'a basın");
                        times[1] = await ppp.push_time(page);
                        await ppp.break_patrol(page);
                        select1 = await question.ask("Alarm başlatıldığından kamera Alarm Preset'ine yöneldi mi? e/h");
                            if (select1=="e"||select1=="E")
                                results[i] = 1;
                            else
                                results[i] = 0;
                        select1 = await question.ask("Alarm varolduğu süre boyunca DEFNE yazılımında alarm bilgisi mevcutmuydu? e/h");
                            if (select1=="e"||select1=="E")
                                results[i] = 1;
                            else
                                results[i] = 0;
                        
                        
                }
                case "114":{
                        var times = new Array();
                        await nav_dome.toDomeCamera(page,ip);
                        await ppp.set_preset(page);
                        await ppp.set_patrol(page);
                        await ppp.goto_home(page,1,"70");
                        await ppp.run_patrol(page);
                        console.log("Patrol başlatıldı lütfen DEFNE yazılımınızı çalıştırın...");
                        console.log("Lütfen saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkartarak alarm oluşturunuz...");
                        for(let i=0;i<5;i++)
                        {
                        console.log("Lütfen"+i+"'nci alarmı oluşturduğunuzda 'ENTER'a basın");
                        times[i,0] = await ppp.push_time(page);
                        console.log("Lütfen alarm bittiğinde 'ENTER'a basın.. İki işlem arasında en az 10 saniye süre olması gerekmektedir... ");
                        times[i,1] = await ppp.push_time(page);
                        }
                        console.log("Lütfen patrol tekrar başladığında 'ENTER'a basın");
                        times[1] = await ppp.push_time(page);
                        await ppp.break_patrol(page);
                        select1 = await question.ask("Alarm başlatıldığından kamera Alarm Preset'ine yöneldi mi? e/h");
                            if (select1=="e"||select1=="E")
                                results[i] = 1;
                            else
                                results[i] = 0;
                        select1 = await question.ask("Alarm varolduğu süre boyunca DEFNE yazılımında alarm bilgisi mevcutmuydu? e/h");
                            if (select1=="e"||select1=="E")
                                results[i] = 1;
                            else
                                results[i] = 0;
                        
                        
                }
                case "125" : {
                    var times = new Array();
                    await nav_dome.toDomeCamera(page,ip);
                        await ppp.set_preset(page);
                        await ppp.set_patrol(page);
                        await ppp.goto_home(page,1,"70");
                        await ppp.run_patrol(page);
                        console.log("Patrol başlatıldı lütfen DEFNE yazılımınızı çalıştırın...");
                        console.log("Lütfen saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkartarak alarm oluşturunuz...");
                        console.log("Lütfen alarmı oluşturduğunuzda 'ENTER'a basın");
                        times[0] = await ppp.push_time(page);
                        await page.waitFor(7000);
                        await ppp.go_position(page,"3000","7500","6000");
                        times[2] = await ppp.get_time(); 
                        console.log("140sn bekleyin")
                        for(let i=140;i>0;i--)
                        {
                            await page.waitFor(1000);
                            console.log("Kalan Süre:"+i+"sn   Lütfen Bekleyin");
                        }
                        times[3] = await ppp.push_time(page);
                        select1 = await question.ask("Alarm başlatıldığından kamera Alarm Preset'ine yöneldi mi? e/h");
                            if (select1=="e"||select1=="E")
                                results[i] = 1;
                            else
                                results[i] = 0;
                        select2 = await question.ask("140 sn bekledikten sonra kamera patrole devam etti mi? e/h");
                            if (select1=="e"||select1=="E")
                                results[i] = 1;
                            else
                                results[i] = 0;
                        break;
                }
                case "129" : {
                    var times = new Array();
                    await nav_dome.toDomeCamera(page,ip);
                        await ppp.set_preset(page);
                        await ppp.set_patrol(page);
                        await ppp.goto_home(page,0,"70");
                        await ppp.run_patrol(page);
                        console.log("Patrol başlatıldı lütfen DEFNE yazılımınızı çalıştırın...");
                        console.log("Lütfen saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkartarak alarm oluşturunuz...");
                        console.log("Lütfen alarmı oluşturduğunuzda 'ENTER'a basın");
                        times[0] = await ppp.push_time(page);
                        console.log("140sn bekleyin")
                        for(let i=140;i>0;i--)
                        {
                            await page.waitFor(1000);
                            console.log("Kalan Süre:"+i+"sn   Lütfen Bekleyin");
                        }
                        times[2] = await ppp.get_time(page);
                        select1 = await question.ask("Alarm başlatıldığından kamera Alarm Preset'ine yöneldi mi? e/h");
                            if (select1=="e"||select1=="E")
                                results[i] = 1;
                            else
                                results[i] = 0;
                        select2 = await question.ask("140 sn bekledikten sonra kamera patrole devam etti mi? e/h");
                            if (select1=="e"||select1=="E")
                                results[i] = 1;
                            else
                                results[i] = 0;
                        break;
                
                    }
                case "132" : {
                    var times = new Array();
                    await nav_dome.toDomeCamera(page,ip);
                        await ppp.set_preset(page);
                        await ppp.set_patrol(page);
                        await ppp.goto_home(page,0,"70");
                        await ppp.run_patrol(page);
                        console.log("Patrol başlatıldı lütfen DEFNE yazılımınızı çalıştırın...");
                        console.log("Lütfen saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkartarak alarm oluşturunuz...");
                        console.log("Lütfen alarmı oluşturduğunuzda 'ENTER'a basın");
                        times[0] = await ppp.push_time(page);
                        await page.waitFor(7000);
                        await ppp.go_position(page,"3000","7500","6000");
                        times[2] = await ppp.get_time(); 
                        console.log("140sn bekleyin")
                        for(let i=140;i>0;i--)
                        {
                            await page.waitFor(1000);
                            console.log("Kalan Süre:"+i+"sn   Lütfen Bekleyin");
                        }
                        times[3] = await ppp.push_time(page);
                        select1 = await question.ask("Alarm başlatıldığından kamera Alarm Preset'ine yöneldi mi? e/h");
                            if (select1=="e"||select1=="E")
                                results[0] = 1;
                            else
                                results[0] = 0;
                        select2 = await question.ask("140 sn bekledikten sonra kamera patrole devam etti mi? e/h");
                            if (select1=="e"||select1=="E")
                                results[1] = 1;
                            else
                                results[2] = 0;
                    
                    break;
                }
                case "137": {//TEST-137
                        console.log("");
                        console.log("Test Doc2-137 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.turn_left(page);
                        await page.waitFor(4000);
                        await cam.stop(page);
                        console.log("Test is completed!");
                    break;
                    
                }
                case "138": {//TEST-138
                        console.log("");
                        console.log("Test Doc2-138 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.turn_left(page);
                        await page.waitFor(4000);
                        await cam.turn_right(page);
                        console.log("Test is completed!");
                    break;
                    
                }
                case "139": {//TEST-139
                        console.log("");
                        console.log("Test Doc2-139 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.turn_right(page);
                        await page.waitFor(4000);
                        await cam.stop(page);
                        console.log("Test is completed!");
                    break;
                    
                }
                case "140": {//TEST-140
                        console.log("");
                        console.log("Test Doc2-140 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.turn_right(page);
                        await page.waitFor(4000);
                        await cam.turn_left(page);
                        console.log("Test is completed!");
                    break;
                    
                }
                case "141":{//141-142
                        var results= new Array();
                        console.log("");
                        console.log("Control Doc2-141 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_goto_home(page,"30");
                        await cam.check_turn_to_task(page,"1");
                        await cam.goto_home_apply(page);
                        await cam.turn_left();
                        select = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
                        if(select=="e"||select=="E")
                        {
                            await cam.PTZ(page);
                            var command=child_process.execSync("date +%T");
                            console.log("Son müdehale saati:"+command);
                            select3 = await question.ask("Kameranın hareketi durdu mu? e/h");
                            if(select3=="e"||select3=="E")
                                results[0]=1;
                            else
                                results[0]=0;                     
                            await timer(page,50);
                            await page.waitFor(50000);
                            select2 = await question.ask("Kamera süre sonunda oto pan hareketine devam etti mi? e/h");
                            if (select2=="e"||select2=="E"){
                                results[1]=1;
                                var command1=child_process.execSync("date +%T");
                                console.log("Otopan hareketine yeniden başlama saati:"+command1);
                            }
                            else
                                results[1]=0;
                        }
                        else
                            console.log("Test Başarısız");
                        console.log("Test is completed!");
                    break;
                }
                
               case "143": {//TEST-143
                        console.log("");
                        console.log("Test Doc2-143 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.turn_right(page);
                        await page.waitFor(6000);
                        await nav_dome.toDomeVersion(page,ip);
                        await version_dome.reload(page);
                        console.log("Lütfen kameranın açılmasını bekleyin....");
                        select = await question.ask("Kamera açıldıktan sonra otopan hareketine devam etti mi? e/h");
                        if (select=="e"||select=="E")
                            console.log("Test Başarılı");
                        else
                            console.log("Test Başarısız");
                    break;
                    
                }
                case "144":{
                        console.log("");
                        console.log("Control Doc2-144 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.turn_right(page);
                        await page.waitFor(6000);
                        console.log("Lütfen aşağıdaki testi uygulayın. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                        console.log("Kamera otopana devam kameranın gücü kesilir. Bir süre(15 - 20 sn) beklendikten sonra kameranın gücü tekrardan verilir. Kamera açıldıktan sonra daha önce yapmakta olduğu işe devam ettiği kameranın hareketi gözlemlenerek doğrulanır.");
                        select = await question.ask("Kamera açıldıktan sonra otopan hareketine devam etti mi? e/h");
                        if (select=="e"||select=="E")
                            console.log("Test Başarılı");
                        else
                            console.log("Test Başarısız");
                    
                    break;
                }
                case "145":{//145,146,147
                        var times= new Array();
                        var results= new Array();
                        console.log("");
                        console.log("Control Doc2-145 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_goto_home(page,"30");
                        await cam.check_turn_to_task(page,"1");
                        await cam.goto_home_apply(page);
                        await cam.turn_left();
                        select = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
                        if(select=="e"||select=="E"){
                            select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve otopan hareketi devam ederken kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                            times[0]=child_process.execSync("date +%T");
                            console.log("Alarm başlama saati:"+times[0]);
                            select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                            if(select2=="e"||select2=="E")
                                results[0]=1;
                            else
                                results[0]=0;
                            select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                            if(select3=="e"||select3=="E")
                                results[1]=1;
                            else
                                results[1]=0;
                            await timer(page,30);
                            await page.waitFor(30000);
                            select4 = await question.ask("Kamera başta girilen yönde otopan hareketine devam etti mi? e/h");
                            if(select4=="e"||select4=="E")
                            {
                                results[2]=1;
                                times[2]= child_process.execSync("date +%T");
                                console.log("Otopan hareketine yeniden başlama saati:"+times[2]);
                            }
                            else
                                results[2]=0;
                            
                        }
                        else
                            console.log("Test Başarısız");
                        console.log("Test is completed!");
                    break;
                }
                case "148":{//148-158 arası
                        var times_basla= new Array();
                        var times_bitis = new Array();
                        var time_otopan_devam;
                        var results= new Array();
                        console.log("");
                        console.log("Control Doc2-148 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_goto_home(page,"30");
                        await cam.check_turn_to_task(page,"1");
                        await cam.goto_home_apply(page);
                        await cam.turn_left();
                        select = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
                        if(select=="e"||select=="E"){
                            for(var i=0 ; i<5 ; i++){
                            select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve otopan hareketi devam ederken kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                            times_basla[i]=child_process.execSync("date +%T");
                            console.log((i+1)+". Alarm başlama saati:"+times_basla[i]);
                            await page.waitFor(10000);
                            select_2 =  await question.ask("Kabloyu yeniden takıp Enter tuşuna basın");
                            times_bitis[i]=child_process.execSync("date +%T");
                            console.log((i+1)+". Alarm bitiş saati:"+times_bitis[i]);
                            await page.waitFor(10000);}
                            select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                            if(select3=="e"||select3=="E")
                                results[0]=1;
                            else
                                results[0]=0;
                            await timer(page,30);
                            await page.waitFor(30000);
                            select4 = await question.ask("Kamera başta girilen yönde otopan hareketine devam etti mi? e/h");
                            if(select4=="e"||select4=="E")
                            {
                                results[1]=1;
                                time_otopan_devam= child_process.execSync("date +%T");
                                console.log("Otopan hareketine yeniden başlama saati:"+time_otopan_devam);
                            }
                            else
                                results[1]=0;
                        }
                        else
                            console.log("Test Başarısız");
                        console.log("Test is completed!");
                    break;
                }
                
                case "159":{//159-162 arası
                        var times= new Array();
                        var results= new Array();
                        console.log("");
                        console.log("Control Doc2-159 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_goto_home(page,"30");
                        await cam.check_turn_to_task(page,"1");
                        await cam.goto_home_apply(page);
                        await cam.turn_left();
                        select = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
                        if(select=="e"||select=="E"){
                            select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve otopan hareketi devam ederken kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                            times[0]=child_process.execSync("date +%T");
                            console.log("Alarm başlama saati:"+times[0]);
                            select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                            if(select2=="e"||select2=="E")
                                results[0]=1;
                            else
                                results[0]=0;
                            select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                            if(select3=="e"||select3=="E")
                                results[1]=1;
                            else
                                results[1]=0;
                            await cam.PTZ(page);
                            times[2]=child_process.execSync("date +%T");
                            console.log("Kullanıcı müdehale saati:"+times[2]);
                            await timer(page,60);
                            await page.waitFor(60000);
                            select4 = await question.ask("Kamera kullanıcının bıraktığı konumda kalmaya devam etti mi? e/h");
                            times[3]=child_process.execSync("date +%T");
                            console.log("Hareket olmadığının en son kontrol edildiği saat:"+times[3]);
                            if(select4=="e"||select4=="E")
                                results[2]=1;
                            else
                                results[2]=0;
                            
                        }
                        else
                            console.log("Test Başarısız");
                        console.log("Test is completed!");
                    break;
                }
                case "163":{//163-165 arası
                        var times= new Array();
                        var results= new Array();
                        console.log("");
                        console.log("Control Doc2-163 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_goto_home(page,"30");
                        await cam.check_turn_to_task(page,"0");
                        await cam.goto_home_apply(page);
                        await cam.turn_left();
                        select = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
                        if(select=="e"||select=="E"){
                            select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve otopan hareketi devam ederken kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                            times[0]=child_process.execSync("date +%T");
                            console.log("Alarm başlama saati:"+times[0]);
                            select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                            if(select2=="e"||select2=="E")
                                results[0]=1;
                            else
                                results[0]=0;
                        
                            select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                            if(select3=="e"||select3=="E")
                                results[1]=1;
                            else
                                results[1]=0;
                            await timer(page,60);
                            await page.waitFor(60000);
                            
                            select4 = await question.ask("Kamera preset konumda kalmaya devam etti mi? e/h");
                            times[3]=child_process.execSync("date +%T");
                            console.log("Hareket olmadığının en son kontrol edildiği saat:"+times[3]);
                            if(select4=="e"||select4=="E")
                                results[2]=1;
                            else
                                results[2]=0;
                        }
                        else
                            console.log("Test Başarısız");
                        console.log("Test is completed!");
                    break;
                }
                case "166":{//166-169
                        var times= new Array();
                        var results= new Array();
                        console.log("");
                        console.log("Control Doc2-166 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_goto_home(page,"30");
                        await cam.check_turn_to_task(page,"0");
                        await cam.goto_home_apply(page);
                        await cam.turn_left();
                        select = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
                        if(select=="e"||select=="E"){
                            select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve otopan hareketi devam ederken kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                            times[0]=child_process.execSync("date +%T");
                            console.log("Alarm başlama saati:"+times[0]);
                            select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                            if(select2=="e"||select2=="E")
                                results[0]=1;
                            else
                                results[0]=0;
                        
                            select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                            if(select3=="e"||select3=="E")
                                results[1]=1;
                            else
                                results[1]=0;
                            await cam.PTZ(page);
                            times[2]=child_process.execSync("date +%T");
                            console.log("Kullanıcı müdehale saati:"+times[2]);
                            await timer(page,60);
                            await page.waitFor(60000);
                            select4 = await question.ask("Kamera kullanıcının bıraktığı konumda kalmaya devam etti mi? e/h");
                            times[3]=child_process.execSync("date +%T");
                            console.log("Hareket olmadığının en son kontrol edildiği saat:"+times[3]);
                            if(select4=="e"||select4=="E")
                                results[2]=1;
                            else
                                results[2]=0;
                        }
                        else
                            console.log("Test Başarısız");
                        console.log("Test is completed!");
                    break;
                    
                }
                case "171":{
                        console.log("");
                        console.log("Control Doc2-171 Started");
                        await nav_dome.toDomeAlarm(page,ip);
                        select = await question.ask("Saha dolabının kapağının kapanış/açılış durumunu simüle etmek için hareketli kameraya takılı olan konektörü çıkarıp devam etmek için Enter tuşuna basınız.");
                        page.reload();
                        await login.loginCamera(page, 'http://10.5.177.164:8080');
                        await nav_dome.toDomeAlarm(page,ip);  
                        await alarm_dome.alarm_is_active(page);
                        await alarm_dome.active_alarms_control(page,"alarm1 input");
                        console.log("Test is completed!");
                        
                    break;
                }
               //////////172-173 ALARM SEKMESİ HAREKET TESPİTİ (yok)
                case "174":{//174-176 arası
                        var times= new Array();
                        var results= new Array();
                        console.log("");
                        console.log("Control Doc2-174 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.set_goto_home(page,"40");
                        await cam.check_turn_to_task(page,"1");
                        await cam.goto_home_apply(page);
                        select = await question.ask("Saha dolabının kapağının kapanış/açılış durumunu simüle etmek için hareketli kameraya takılı olan konektörü çıkarıp  Enter tuşuna basınız.");
                        times[0]=child_process.execSync("date +%T");
                        console.log("Alarm başlama saati:"+times[0]);
                        select1 = await question.ask("Kamera tanımlanan presete gitti mi? e/h");
                        if(select1=="e"||select1=="E")
                            results[0]=1;
                        else
                            results[0]=0;
                        
                        await timer(page,80);
                        await page.waitFor(80000);
                        select2 = await question.ask("Kamera hala preset noktasına bakmaya devam ediyor mu? e/h");
                        if(select2=="e"||select2=="E")
                            results[1]=1;
                        else
                            results[1]=0;
                        select3 = await question.ask("Kameraya konnektörü geri takıp  Enter tuşuna basınız.");
                        times[1]=child_process.execSync("date +%T");
                        console.log("Alarm bitiş saati:"+times[1]);
                        await timer(page,40);
                        await page.waitFor(40000);
                        select4 = await question.ask("Kamera alarm oluşturulmadan önceki hareketine devam ediyor mu? e/h");
                        times[2]=child_process.execSync("date +%T");
                        console.log("Harekete devam etme saati:"+times[2]);
                        if(select4=="e"||select4=="E")
                            results[2]=1;
                        else
                            results[2]=0;
                        
                        console.log("Test is completed!");
                    break;
                }
                
                case "191": {//TEST-191
                        console.log("");
                        await nav_dome.toDomeEncodingHigh(page,ip);
                        await page.waitFor(2000);
                        await encodingH.traffic_forming(page);
                        console.log("Test Doc2-191 Started");
                        await encodingH.frequency(page,"50");
                        await encodingH.precision(page,"Agresif");
                        await encodingH.apply(page);
                        console.log("Test is completed!");
                        //grafik çizimleri yok
                    break;
                    
                }
                case "193": {//TEST-193
                        console.log("");
                        await nav_dome.toDomeEncodingHigh(page,ip);
                        await page.waitFor(2000);
                        await encodingH.traffic_forming(page);
                        console.log("Test Doc2-193 Started");
                        await encodingH.frequency(page,"50");
                        await encodingH.precision(page,"Orta");
                        await encodingH.apply(page);
                        console.log("Test is completed!");
                        //grafik çizimleri yok
                    break;
                    
                }
                case "195": {//TEST-195
                        console.log("");
                        await nav_dome.toDomeEncodingHigh(page,ip);
                        await page.waitFor(2000);
                        await encodingH.traffic_forming(page);
                        console.log("Test Doc2-195 Started");
                        await encodingH.frequency(page,"50");
                        await encodingH.precision(page,"Hafif");
                        await encodingH.apply(page);
                        console.log("Test is completed!");
                        //grafik çizimleri yok
                    break;
                    
                }
                default: await console.log("Test "+test_number+" blunamadı lütfen tekrar deneyin..");
 
                
            }
            
	
        
        

        
                
	}
	
	
}());

