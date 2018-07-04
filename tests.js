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
var rtsp = require('./rtsp');
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
/////////////////////////////////////


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
async function test_set_res_fps(page,i,res)
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
            console.log("Testing Done " + (i+53));
    }
    else if (res == 2)
    {
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
                case "14" : { 
                    try{ await test_ffmpeg_res("1920","1080","stream1m","14"); }catch (err){ console.log("HATA");} break;}
                case "15" : {await test_ffmpeg_res("640","368","stream2m","14"); break;}
                case "16" : {results = await test_ffmpeg_res("1920","1080","stream1","14"); break;}
                case "17" : {await test_ffmpeg_res("640","368","stream2","14"); break;}
                case "22": {console.log(" ");
                        console.log("Kontrol 22 STARTED");
                        await nav.toEncodingHigh(page,ip);
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
                        await nav.toEncodingLow(page,ip);
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
                        await nav.toResolution(page,ip);
                        await resolution.set_profile(page,"1080");
                        await resolution.set_resolution1(page,"1920 x 1080 (max:30fps");
                        await resolution.set_fps1(page,"10");
                        await resolution.apply(page);
                        console.log("OPTIONS SETTED ");
                    break;
                }
                case "25": {//Kontrol 25
                        console.log(" ");
                        console.log("Control 25 STARTED");
                        await nav.toCamera(page,ip);
                        await camera.set_ir_filter_mode(page,"gece");
                        await camera.set_ir_filter_transition(page,"manu");
                        await camera.ir_filter_apply(page);
                        console.log("OPTIONS SETTED ");
                    break;
                }
                case "28": {// TEST 28
                      console.log(" ");
                      console.log("Test 28 Started");
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
                      console.log("Test 29 Started");
                      await nav.toEncodingLow(page,ip);
                      await encodingLow.test_intraframe(page);
                      await encodingLow.test_bit_con(page);
                      await encodingLow.test_bit_rate(page);
                      await encodingLow.test_codding_quality(page);
                    break;
                }
                case "30": { // TEST 30

                      console.log(" ");  
                      console.log("Test 30 Started");
                      await nav.toResolution(page,ip);
                      await resolution.test_profile(page);
                      await resolution.test_resolution1(page);
                      await resolution.test_fps1(page);
                      await resolution.test_resolution2(page);
                      await resolution.test_fps2(page);
                    break;
                }
                case "31": { //TEST 31
                      console.log("Test 31 Başladı");
                      console.log("Vlc programı açıldıktan sonra 15 dakika görüntüyü izleyin ve görüntüde herhangi bir bozulma varmı kontrol edin. Sonrasında Vlc programını kapatın ve sonucu konsola yazın");
                      var command = 'vlc rtsp://'+ip+'/stream1m';
                      proc =await require('child_process').exec(command);
                      select1 = await question.ask("Görüntüde istenmeyen bozukluklar var mı? e/h");
                      select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                      if ( (select1 == "h" || select1 == "H") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                    
                }
                case "32": { //TEST 32
                      var command = 'vlc rtsp://'+ip+'/stream2m';
                      proc =await require('child_process').exec(command);
                      select1 = await question.ask("Görüntü Geldi mi ? e/h");
                      select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                      if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                      break;
                }
                case "33": { //TEST 33
                      var command = 'vlc rtsp://'+ip+'/stream1';
                      proc =await require('child_process').exec(command);
                      select1 = await question.ask("Görüntü Geldi mi ? e/h");
                      select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                      if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                      break;
                }
                case "34": { //TEST 34
                      var command = 'vlc rtsp://'+ip+'/stream2';
                      proc =await require('child_process').exec(command);
                      select1 = await question.ask("Görüntü Geldi mi ? e/h");
                      select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                      if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız")
                      break;
                }
                
                case "37": {//TEST 37
                      console.log(" ");  
                      console.log("Test 37 Started");
                      await nav.toVersion(page,ip);
                      await version.test_application(page);
                      await version.test_firmware(page);
                    break;
                }
                case "38": {//TEST 38
                      console.log("");
                      console.log("Test 38 Started");
                      await nav.toAlarm(page,ip);
                      await alarm.test_sei_selected(page);
                    break;
                }
                case "39": {//TEST 39
                      console.log("Test 39 Started");
                      await nav.toAlarm(page,ip); 
                      await alarm.set_motion_detector(page,"a");
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
                      console.log("Test 40 Started");
                      await nav.toAlarm(page,ip);
                      var is_active = await alarm.test_alarm_active(page);
                      if(!is_active) await alarm.set_alarm_active(page);
                      await alarm.set_motion_detector("k");
                      await alarm.set_motion_threshold(page, 50);
                      await alarm.set_apply(page);
                      console.log("Kameranın görüntüsünü DEFNE üzerinden izleyin. Kameranın önüne geçerek SEI Alarm Bilgisinin geldiği ve sol üst köşede kırmızı fontlu alarm bilgisinin gelmediğini gözlemleyin");
                      select1 = await question.ask("Kameranın önüne geçildiğinde SEI Alarm bilgisi geldi mi ? e/h");
                      select2 = await question.ask("Sol üst köşede kırmızı fontlu alarm bilgisi geldi mi? e/h");
                       if ( (select2 == "h" || select2 == "H") && (select1 =="e"|| select1=="E"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                    
                }
                case "41": {//TEST 41
                      
                      console.log("");
                      console.log("Test 41 Started");
                      await nav.toCamera(page,ip);
                      await camera.test_ir_filter_mode(page, "0");
                      await camera.test_ir_filter_transition(page, "0");
                    break;
                }
                case "42": {//TEST 42
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
                      console.log("Test 46 Started");
                      await nav.toTime(page,ip);
                      await time.test_ntp_server1(page, "pool.ntp.org");
                    break;
                }
                case "47":{
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
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                      console.log("DEFNE yazılımı üzerinden test yapılan kameranın canlı görüntüsü açılır. Görüntünün oynadığı pencerede herhangi bir noktaya tıklanır ve Yakınlaştırma(Zoom) Tipi değeri Optik Yakınlaştırma olarak seçilir. Bu işlemden sonra mouse yardımı ile zoom in yapılır. Kameranın 3x zoom yapabildiği üst yazı ile gözlemlenerek doğrulanr.");
                      select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi ? e/h");
                      if (select1=="e"||select1=="E")
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                }
                case "49":{
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                      console.log("Kamera web arayüzü üzerinden yeniden başlatılır. Kamera arayüzüne erişim sağlandıktan sonra bu işlem aynı şekilde toplamda 3 sefer tekrarlanır. Daha sonra kameranın canlı görüntüsü VLC üzerinden izlenir ve web arayüzüne giriş yapılır. Bu işlemlerin  sonucunda istenilen işlemlerin sorunsuz bir şekilde yapıldığı gözlemlenerek doğrulanır.");
                      select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi ? e/h");
                      if (select1=="e"||select1=="E")
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                }
                case "50":{
                      await nav.toCamera(page,ip);
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
                case "61": {
                    console.log("Test 61 Started");
                    await nav.toRTSP(page,ip);
                    await rtsp.rtsp_set(page, "Tanımlı kullanıcı", "admin",1);
                    var command = 'vlc rtsp://'+ip+'/stream1';
                    proc =await require('child_process').exec(command)
                    break;
                }
                case "62": {
                    console.log("Test 62 Started");
                    await nav.toRTSP(page,ip);
                    await rtsp.rtsp_set(page, "Tanımlı kullanıcı", "admin",1);
                    var command = 'vlc rtsp://'+ip+'/stream2';
                    proc =await require('child_process').exec(command)
                    break;
                }
                case "63": {
                    console.log("Test 63 Started");
                    await nav.toRTSP(page,ip);
                    await rtsp.rtsp_set_no(page,0);
                    var command = 'vlc rtsp://'+ip+'/stream1';
                    proc =await require('child_process').exec(command)
                    break;
                }
                case "65": {//TEST 65
                      console.log("Test 65 Started");
                      await nav.toAlarm(page,ip); 
                      await alarm.set_motion_detector(page,"a");
                      await alarm.set_motion_threshold(page, 50);
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
                      console.log("Test 66 Started");
                      await nav.toAlarm(page,ip);
                      var is_active = await alarm.test_alarm_active(page);
                      if(!is_active) await alarm.set_alarm_active(page);
                      await alarm.set_motion_detector("k");
                      await alarm.set_apply(page);
                      console.log("Kameranın görüntüsünü DEFNE üzerinden izleyin. Kameranın önüne geçerek SEI Alarm Bilgisinin geldiği ve sol üst köşede kırmızı fontlu alarm bilgisinin gelmediğini gözlemleyin");
                      select1 = await question.ask("Kameranın önüne geçildiğinde SEI Alarm bilgisi geldi mi ? e/h");
                      select2 = await question.ask("Sol üst köşede kırmızı fontlu alarm bilgisi geldi mi? e/h");
                       if ( (select1 == "e" || select1 == "E") && (select2 =="h"|| select2=="H"))
                          console.log("Test Başarılı");
                      else
                          console.log("Test Başarısız");
                    
                }
                default: console.log("Test "+test_number+" blunamadı lütfen tekrar deneyin..");
                
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
                case "15" : {await test_ffmpeg_res("640","368","stream2m","14"); break;}
                case "16" : {results = await test_ffmpeg_res("1920","1080","stream1","14"); break;}
                case "17" : {await test_ffmpeg_res("640","368","stream2","14"); break;}
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
                        console.log("Please bring the camera to a position where you can see it");
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
                case "143": {//TEST-143
                        console.log("");
                        console.log("Test Doc2-143 Started");
                        await nav_dome.toDomeCamera(page,ip);
                        await page.waitFor(2000);
                        await cam.turn_right(page);
                        await nav_dome.toWatchCamera(page,ip);
                        await page.waitFor(6000);
                        await nav_dome.toDomeVersion(page,ip);
                        await version_dome.reload(page);
                        await page.waitFor(2000);
                        await nav_dome.toWatchCamera(page,ip);    
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

