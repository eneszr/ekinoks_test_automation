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
var mask = require('./mask');
var login_static = require('./login.js') 
var ip = '0.0.0.0';
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
var watch_camera= require("./watch_camera_dome");
/////////////////////////////////////
var tests = require('./tests');
var result = require('./result.js');
const {camera_restart} = require('./ping.js')
const file_exist= require("./file_exist");


async function timer(page,n){
    console.clear();
    console.log("Lütfen Bekleyin ("+(n-1)+"sn)...");
    x=n-1;
    if(x != 0){
setTimeout(function() {timer(page,x)},1000);}
    return;
}

async function to_float(count)
{
    var splitted = await count.split("/");
    result_float = splitted[0]/splitted[1];
    return result_float;
}
async function test_ffmpeg_res(width_test,height_test,stream,test_num,document_no)
{   console.log("Kamera kaydı alınıyor..")
    await capture_test.record(ip,stream,test_num);
    console.log("Video özellikleri için json dosyası oluşturuluyor..");
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
        if(select=='e'||select=='E') await result.write(test_num," BAŞARILI    Görüntü geldi , Çözünürlükler eşit    İstenen Çözünürlük="+width_test+"x"+height_test+"  Gerçekleşen çözünürlük ="+coded_width+"x"+coded_height,document_no);
        else await result.write(test_num," BAŞARISIZ    Görüntü gelmedi ",document_no);
    }
    else {console.log("Çözünürlükler Farklı");
        if(select=='e'||select=='E') await result.write(test_num," BAŞARISIZ    Görüntü geldi , Çözünürlükler eşit değil    İstenen Çözünürlük="+width_test+"x"+height_test+"  Gerçekleşen çözünürlük ="+coded_width+"x"+coded_height,document_no);
        else await result.write(test_num," BAŞARISIZ    Görüntü gelmedi ",document_no);
    }
    if (select=='e') return 1;
    else return 0;
}
async function test_ffmpeg_res_fps(stream,test_num,document_no)
{
    var temp_val = 1;
    console.log("Görüntü kaydediliyor..")
    await capture_test.record(ip,stream,test_num);
    console.log("Kodlayıcı/Çözücü Bilgileri alınıyor ..")
    await capture_test.create_json(ip,stream,test_num);
    width = await capture_test.read_specs("width",test_num); //istenen yükseklik
    height = await capture_test.read_specs("height",test_num); //istenen genişlik
    coded_width = await capture_test.read_specs("coded_width",test_num); //gerçekleşen yükseklik
    coded_height = await capture_test.read_specs("coded_height",test_num); //gerçekleşen genişlik
    r_frame_rate = await capture_test.read_specs("r_frame_rate",test_num);//istenen kare hızı
    r_frame_rate =await to_float(r_frame_rate);
    avg_frame_rate = await capture_test.read_specs("avg_frame_rate",test_num);//gerçekleşen kare hızı
    avg_frame_rate =await to_float(avg_frame_rate);
    console.log("");
    console.log("İstenen çözünürlük = "+width+"x"+height);
    console.log("Gerçekleşen çözünürlük = "+coded_width+"x"+coded_height);
    if (coded_width == width && coded_height == height)
    {
        temp_val = temp_val &&1;
        console.log("Çözünürlükler Eşit");
    }
    else {console.log("Çözünürlükler Farklı");
        temp_val = temp_val &&0;
    }
    console.log("");
    console.log("İstenen kare hızı = "+r_frame_rate);
    console.log("Gerçekleşen kare hızı = "+avg_frame_rate);
    if (avg_frame_rate == r_frame_rate )
    {
        temp_val = temp_val &&1;
        console.log("Kare Hızı Eşit");
    }
    else {console.log("Kare Hızı Farklı");
        temp_val = temp_val &&0;
    }
    if (temp_val) await result.write(test_num," BAŞARILI   İstenen kare hızı = "+r_frame_rate+" Gerçekleşen kare hızı = "+avg_frame_rate+" İstenen çözünürlük = "+width+"x"+height+" Gerçekleşen çözünürlük = "+coded_width+"x"+coded_height,document_no);
    else await result.write(test_num," BAŞARISIZ   İstenen kare hızı = "+r_frame_rate+" Gerçekleşen kare hızı = "+avg_frame_rate+" İstenen çözünürlük = "+width+"x"+height+" Gerçekleşen çözünürlük = "+coded_width+"x"+coded_height,document_no);
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
            await camera_restart(page,ip);
            console.log((i+53) + ". Testin konfigürasyon ayarları yapıldı. Karşılaştırma yapılıyor...");
    }
    else if (res == 2)
    {
            console.log("Test "+(i+57)+ " Başladı.");
            await nav.toResolution(page,ip);
            await resolution.set_resolution2(page, resolution2[i]);    
            await resolution.set_fps2(page, fps2[i]);
            await resolution.apply(page);
            await camera_restart(page,ip);
            console.log((i+57) + ". Testin konfigürasyon ayarları yapıldı. Karşılaştırma yapılıyor...");
        
    }
    
}
async function test_set_res_fps_DOM(page,i,res,ip)
{
    var resolution1 = ["1920 x 1080 (Max:30fps)", "1280 x 720 (Max:30fps)", "1280 x 720 (Max:25fps)", "1920 x 1080 (Max:25fps)"];
    var fps1 = ["15", "10", "20", "12.5"];
    var resolution2 = ["640 x 368", "480 x 272", "320 x 180", "640 x 368"];
    var fps2 = ["5", "15", "20", "12.5"];
    console.log("Ayarlar set ediliyor..")
    if(res == 1)
    {
        await nav.toResolution(page,ip);
        await resolution.set_resolution1(page, resolution1[i]);
        await resolution.set_fps1(page, fps1[i]);
        await resolution.apply(page);
        console.log("Ayarlar set edildi. Kamera yeniden başlatılıyor." );
    }
    else if (res == 2)
    {
        await nav.toResolution(page,ip);
        await resolution.set_resolution2(page, resolution2[i]);
        await resolution.set_fps2(page, fps2[i]);
        await resolution.apply(page);
        console.log("Ayarlar set edildi. Kamera yeniden başlatılıyor." );
    }
    await camera_restart(page,ip);
}
(function() {
    module.exports.start_1 = async function(page, test_number,url) {
	ip = url;
            switch(test_number.toString()){
                
                case "14" : { 
                    try{ await test_ffmpeg_res("1920","1080","stream1m","14",1); }catch (err){ console.log("HATA");} break;}
                case "15" : {await test_ffmpeg_res("640","368","stream2m","15",1); break;}
                case "16" : {await test_ffmpeg_res("1920","1080","stream1","16",1); break;}
                case "17" : {await test_ffmpeg_res("640","368","stream2","17",1); break;}
                case "21" : {
                    console.log("Test 21 Başladı.");
                    for(var i = 1; i<5; i++){                        
                        await nav.toVersion(page, ip);
                        await nav.toLive(page,ip);
                        await mask.select_mask(page, i);
                        await mask.mask_size(page, "10", "10");
                        var is_active = await mask.test_mask_active(page); 
                        if(!is_active) await mask.mask_visible(page);
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
                    console.log("4 adet maske oluşturuldu ve konumlandırıldı.");
                    await result.write("21", "4 adet maske oluşturuldu ve konumlandırıldı.",1);
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
                        await camera_restart(page,ip);
                        console.log("Konfigürasyon ayarları yapıldı.");
                        await result.write("22", "Konfigürasyon ayarları yapıldı.",1);
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
                        await camera_restart(page,ip);
                        console.log("Konfigürasyon ayarları yapıldı.");
                        await result.write("23", "Konfigürasyon ayarları yapıldı.",1);
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
                        await camera_restart(page,ip);
                        console.log("Konfigürasyon ayarları yapıldı.");
                        await result.write("24", "Konfigürasyon ayarları yapıldı.",1);
                    break;
                }
                case "25": {//Kontrol 25
                        console.log(" ");
                        console.log("Test 25 Başladı.");
                        await nav.toCamera(page,ip);
                        await camera.set_ir_filter_mode(page,"gece");
                        await camera.set_ir_filter_transition(page,"Otomatik");
                        await camera.ir_filter_apply(page);
                        console.log("Konfigürasyon ayarları yapıldı.");
                        await result.write("25", "Konfigürasyon ayarları yapıldı.",1);
                    break;
                }
                case "28": {// TEST 28
                      console.log(" ");
                      console.log("Test 28 Başladı.");
                      await nav.toEncodingHigh(page,ip);
                      await encoding.set_intraframe(page, "12");
                      await encoding.set_bit_con(page, "vbr");
                      await encoding.set_codding_quality(page, "yüksek");
                      await encoding.set_bit_rate(page, "3.338");
                      await encoding.set_calc_method(page, "tan");
                      await encoding.apply(page);
                      console.log("Değerler Ayarlandı.");
                      console.log("Yapılan Konfigürasyon Ayarları:");
                      await nav.toEncodingHigh(page,ip); 
                      var initframe = await encoding.test_intraframe(page); 
                      var bitcon = await encoding.test_bit_con(page); 
                      var quality = await encoding.test_codding_quality(page); 
                      var bitrate = await encoding.test_bit_rate(page); 
                      var method = await encoding.test_calc_method(page);
                      if((initframe == 1) && (bitcon == 1) && (quality == 1) && (bitrate == 1) && (method == 1))
                        {
                            console.log("Konfigürasyon Ayarları Doğru.");
                            await result.write("28", "Test Başarılı. Konfigürasyon Ayarları Doğru.",1);
                        }
                      else
                        {
                            console.log("Konfigürasyon Ayarları Yanlış.");
                            await result.write("28", "Test Başarısız. Konfigürasyon Ayarları Yanlış.",1);
                        }
                        break;
                }
                case "29": {// TEST 29
                      console.log(" ");
                      console.log("Test 29 Başladı.");
                      /*await encodingLow.set_intraframe(page, "12");
                      await encodingLow.set_bit_con(page, "VBR");
                      await encodingLow.set_calc_method(page, "Tanımlı");
                      await encodingLow.set_bit_rate(page, "0,477");
                      await encodingLow.apply(page);
                      console.log("Değerler Ayarlandı.");*/
                      console.log("Yapılan konfigürasyon ayarları:");
                      await nav.toEncodingLow(page,ip);
                      var initframe = await encodingLow.test_intraframe(page);
                      var bitcon = await encodingLow.test_bit_con(page);
                      var bitrate = await encodingLow.test_bit_rate(page);
                      var quality = await encodingLow.test_codding_quality(page);
                      if((initframe == 1) && (bitcon == 1) && (quality == 1) && (bitrate == 1))
                        {
                            console.log("Konfigürasyon Ayarları Doğru.");
                            await result.write("29", "Test Başarılı. Konfigürasyon Ayarları Doğru.",1);
                        }
                      else
                        {
                            console.log("Konfigürasyon Ayarları Yanlış.");
                            await result.write("29", "Test Başarısız. Konfigürasyon Ayarları Yanlış.",1);
                        }
                        break;
                }
                case "30": { // TEST 30
                      console.log(" ");  
                      console.log("Test 30 Başladı.");
                      await resolution.set_profile(page, "1080");
                      await resolution.set_resolution1(page, "1920 x 1080 (Max:25fps)");
                      await resolution.set_resolution2(page, "640 x 368");
                      await resolution.set_fps1(page, "12.5");
                      await resolution.set_fps2(page, "12.5");
                      await resolution.apply(page);
                      console.log("Değerler Ayarlandı.");
                      console.log("Yapılan konfigürasyon ayarları:");
                      await nav.toResolution(page,ip);
                      var profile = await resolution.test_profile(page);
                      var res1 = await resolution.test_resolution1(page);
                      var fps1 = await resolution.test_fps1(page);
                      var res2 = await resolution.test_resolution2(page);
                      var fps2 = await resolution.test_fps2(page);
                      if((profile == 1) && (res1 == 1) && (fps1 == 1) && (res2 == 1) && (fps2 == 1))
                        {
                            console.log("Konfigürasyon Ayarları Doğru.");
                            await result.write("30", "Test Başarılı. Konfigürasyon Ayarları Doğru.",1);
                        }
                      else
                        {
                            console.log("Konfigürasyon Ayarları Yanlış.");
                            await result.write("30", "Test Başarısız. Konfigürasyon Ayarları Yanlış.",1);
                        }
                        break;
                }
                case "31": { //TEST 31
                      console.log("Test 31 Başladı.");
                      console.log("Vlc programı açıldıktan sonra 15 dakika görüntüyü izleyin ve görüntüde herhangi bir bozulma varmı kontrol edin. Sonrasında Vlc programını kapatın ve sonucu konsola yazın");
                      var command = 'vlc rtsp://'+ip+'/stream1m';
                      proc =await require('child_process').exec(command);
                      select1 = await question.ask("Görüntüde istenmeyen bozukluklar var mı? e/h");
                      await test_ffmpeg_res_fps("stream1m",31);
                      console.log("Lütfen VLC programı üzerinden görüntünün çözünürlüğünün 1920*1080 olduğunu kontrol edin.");
                      select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                      if ( (select1 == "h" || select1 == "H") && (select2 =="e"|| select2=="E"))
                      {
                          console.log("Test Başarılı");
                          await result.write("31", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("31", "Test Başarısız",1);
                      }    
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
                      {
                          console.log("Test Başarılı");
                          await result.write("32", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("32", "Test Başarısız",1);
                      }
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
                      {
                          console.log("Test Başarılı");
                          await result.write("33", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("33", "Test Başarısız",1);
                      }
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
                      {
                          console.log("Test Başarılı");
                          await result.write("34", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("34", "Test Başarısız",1);
                      }
                      break;
                }
                case "35": { //TEST 35
                      console.log("Test 35 Başladı.");
                      console.log("Lütfen VLC üzerinden yayının gelmesini bekleyiniz.");
                      console.log("Yayında sol üstte görülen üst yazının yeni yazılım yüklenmeden önceki ile aynı olduğu ve saatin güncel saati göstermeye devam ettiğini   gözlemleyiniz.");
                      await page.waitFor(5000);
                      var command = 'vlc rtsp://'+ip+'/stream1';
                      proc =await require('child_process').exec(command);
                      await page.waitFor(5000);
                      select1 = await question.ask("Görüntü Geldi mi ? e/h");
                      select2 = await question.ask("Üst yazı ve saat bilgisi güncel mi? e/h");
                      if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                      {
                          console.log("Test Başarılı");
                          await result.write("35", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("35", "Test Başarısız",1);
                      }
                      break;
                }
                case "36": { //TEST 36
                      console.log("Test 36 Başladı.");
                      console.log("Kameranın web arayüzüne geçerek 'Canlı izleme' seklesinden Z+ ve Z- butonları ile Zoom in ve Zoom out işlemleri yapınız. Zoom in ve zoom out işlemlerini yaparken zamandan sonra zoom değerinin yazıldığı ve değiştiği üst yazı gözlemlerek zoom değerinin gösterilebildiğini doğrulayınız.");
                      await page.waitFor(5000);
                      select1 = await question.ask("Zoom işlemi başarılı bir şekilde yapılabildi mi? e/h");
                      select2 = await question.ask("Zoom işlemi yapılırken üst yazıda saatten sonra zoom değerleri yazıldı mı? e/h");
                      if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                      {
                          console.log("Test Başarılı");
                          await result.write("36", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("36", "Test Başarısız",1);
                      }
                      break;
                }
                
                case "37": {//TEST 37
                      console.log(" ");  
                      console.log("Test 37 Başladı.");
                      console.log("'Uygulama versiyonu' ve 'Firmware sürümü' değerlerinin başlangıçta girilen konfigürasyon bilgileri ile aynı olduğu gözlemleyerek  yazılım sürümünü doğrulayınız.");
                      await nav.toVersion(page,ip);
                      await version.test_application(page);
                      await version.test_firmware(page);
                      select1 = await question.ask("'Uygulama versiyonu' ve 'Firmware sürümü' değerleri başlangıçtaki değerler ile aynı mı? e/h");
                      if ( select1 == "e" || select1 == "E")
                      {
                          console.log("Test Başarılı");
                          await result.write("37", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("37", "Test Başarısız",1);
                      }
                      break;
                }
                case "38": {//TEST 38
                      console.log("");
                      console.log("Test 38 Başladı.");
                      await nav.toAlarm(page,ip);
                      var sei = await alarm.test_sei_selected(page);
                      if (sei == 1)
                      {
                          console.log("Test Başarılı");
                          await result.write("38", "Test Başarılı",1);  
                      }    
                      else if (sei == 0)
                      {
                          console.log("Test Başarısız")
                          await result.write("38", "Test Başarısız",1);
                      }
                      break;
                }
                case "39": {//TEST 39
                      console.log("Test 39 Başladı.");
                      await nav.toAlarm(page,ip); 
                      await alarm.set_motion_detector(page,"Açık"); 
                      await alarm.set_motion_treshold(page, "50");
                      await alarm.set_apply(page);
                      await camera_restart(page,ip);
                      console.log("Kameranın görüntüsünü DEFNE üzerinden izleyin. Kameranın önüne geçerek SEI Alarm Bilgisinin sol üst köşede kırmızı fontlu yazı olarak geldiği gözlemlenerek adım doğrulanır.");
                      select1 = await question.ask("Kameranın önüne geçildiğinde SEI Alarm Bilgisinin sol üst köşede kırmızı fontlu yazı olarak geldi mi? e/h");
                       if (select1 == "e" || select1 == "E")
                      {
                          console.log("Test Başarılı");
                          await result.write("39", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("39", "Test Başarısız",1);
                      }
                      break;
                }
                case "40":{//TEST 40
                      console.log("Test 40 Başladı.");
                      await nav.toAlarm(page,ip);
                      var is_active = await alarm.test_alarm_active(page); 
                      if(!is_active) await alarm.set_alarm_active(page); 
                      await alarm.set_motion_detector(page, "Kapalı"); 
                      await alarm.set_apply(page); 
                      await camera_restart(page,ip);
                      console.log("Kameranın görüntüsünü DEFNE üzerinden izleyin. Kameranın önüne geçerek SEI Alarm Bilgisinin GELDİĞİNİ ve sol üst köşede kırmızı fontlu alarm bilgisinin GELMEDİĞİNİ gözlemleyin.");
                      select1 = await question.ask("Kameranın önüne geçildiğinde SEI Alarm bilgisi geldi mi ? e/h");
                      select2 = await question.ask("Sol üst köşede kırmızı fontlu alarm bilgisi geldi mi? e/h");
                       if ( (select2 == "h" || select2 == "H") && (select1 =="e"|| select1=="E"))
                       {
                          console.log("Test Başarılı");
                          await result.write("40", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("40", "Test Başarısız",1);
                      }
                      break;
                    
                }
                case "41": {//TEST 41
                      
                      console.log("");
                      console.log("Test 41 Başladı.");
                      await nav.toCamera(page,ip);
                      var ir_mode = await camera.test_ir_filter_mode(page, "0");
                      var ir_transition = await camera.test_ir_filter_transition(page, "0");
                      if ((ir_mode == 1) && (ir_transition == 1))
                      {
                          console.log("Test Başarılı");
                          await result.write("41", "Test Başarılı",1);  
                      }    
                      else if ((ir_mode != 1) && (ir_transition == 1))
                      {
                          console.log("Test Başarısız")
                          await result.write("41", "Test Başarısız",1);
                      }
                      else if ((ir_mode == 1) && (ir_transition != 1))
                      {
                          console.log("Test Başarısız")
                          await result.write("41", "Test Başarısız",1);
                      }
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
                      {
                          console.log("Test Başarılı");
                          await result.write("42", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("42", "Test Başarısız",1);
                      }
                      break;
                }
                case "43": {//TEST 43
                     console.log("Test 43 Başladı.");
                      await nav.toVersion(page, ip);
                      await page.waitFor(1000);
                      await nav.toLive(page,ip);
                      console.log("Lütfen web arayüzü üzerinden kamera görüntüsünün gelip gelmediğine bakın ...");
                      select1 = await question.ask("Görüntü geldi mi ? e/h");
                      if (select1=="e"||select1=="E")
                      {
                          console.log("Test Başarılı");
                          await result.write("43", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("43", "Test Başarısız",1);
                      }
                      break;
                             
                                         
                }
                case "44":{
                      console.log("Test 44 Başladı.");
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                      console.log("Kameranın gücü kesilir ve bir süre beklendikten sonra tekrar verilir.  Kameranın canlı görüntüsü izlenmeye başladıktan bir süre sonra yine kameranın gücü kesilir bir süre beklenir. Ardından kameranın gücü tekrar verilir. Bu işlem aynı şekilde 1 kez daha tekrarlanır. Toplamda 3 sefer bu işlem yapıldıktan sonra kameranın canlı görüntüsü VLC üzerinden izlenir ve web arayüzüne giriş yapılır. Web arayüzüne giriş yapılabildiği, görüntü çekilebildiği ve görüntüde maskelerin olması gereken yerlede görüldüğü test edilerek doğrulanır.");
                      select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi? e/h");
                      if (select1=="e"||select1=="E")
                      {
                          console.log("Test Başarılı");
                          await result.write("44", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("44", "Test Başarısız",1);
                      }
                      break;
                }
                case "45":{
                      console.log("Test 45 Başladı.");
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                      console.log("Kamera web arayüzü üzerinden yeniden başlatılır. Kamera arayüzüne erişim sağlandıktan sonra bu işlem aynı şekilde toplamda 3 sefer tekrarlanır. Daha sonra kameranın canlı görüntüsü VLC üzerinden izlenir ve web arayüzüne giriş yapılır. Bu işlemlerin  sonucunda istenilen işlemlerin sorunsuz bir şekilde yapıldığı gözlemlenerek doğrulanır.");
                      select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi ? e/h");
                      if (select1=="e"||select1=="E")
                      {
                          console.log("Test Başarılı");
                          await result.write("45", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("45", "Test Başarısız",1);
                      }
                      break;
                }
                case "46": {//TEST 46
                      console.log("");
                      console.log("Test 46 Başladı.");
                      await nav.toTime(page,ip);
                      select = await time.test_ntp_server1(page, "pool.ntp.org");
                      await result.write("46", "Uygulandı"+select,1); 
                    break;
                }
                case "47":{
                      console.log("Test 47 Başladı.");
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                      console.log("Test bilgisayarından kameranın 1.stream adresi kullanılarak(rtsp://<KameraIPAdresi>/stream1) VLC üzerinden 5 adet unicast görüntü oynatılır. 5 adet unicast görüntü çekilirken görüntüde herhangi bir takılma, mozaiklenme, bozulma olmadığı gözlemlenerek kameradan istenilen çözünürlük ve fps değerinde en az 5 adet unicast yayın akışı başlatılabildiği doğrulanır.");
                      select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi ? e/h");
                      if (select1=="e"||select1=="E")
                      {
                          console.log("Test Başarılı");
                          await result.write("47", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("47", "Test Başarısız",1);
                      }
                      break;
                    
                }
                case "48":{
                      console.log("Test 48 Başladı.");
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                      console.log("DEFNE yazılımı üzerinden test yapılan kameranın canlı görüntüsü açılır. Görüntünün oynadığı pencerede herhangi bir noktaya tıklanır ve Yakınlaştırma(Zoom) Tipi değeri Optik Yakınlaştırma olarak seçilir. Bu işlemden sonra mouse yardımı ile zoom in yapılır. Kameranın 3x zoom yapabildiği üst yazı ile gözlemlenerek doğrulanr.");
                      select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi ? e/h");
                      if (select1=="e"||select1=="E")
                      {
                          console.log("Test Başarılı");
                          await result.write("48", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("48", "Test Başarısız",1);
                      }
                      break;
                }
                case "49":{
                      console.log("Test 49 Başladı.");
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                      console.log("Kamera web arayüzü üzerinden yeniden başlatılır. Kamera arayüzüne erişim sağlandıktan sonra bu işlem aynı şekilde toplamda 3 sefer tekrarlanır. Daha sonra kameranın canlı görüntüsü VLC üzerinden izlenir ve web arayüzüne giriş yapılır. Bu işlemlerin  sonucunda istenilen işlemlerin sorunsuz bir şekilde yapıldığı gözlemlenerek doğrulanır.");
                      select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi ? e/h");
                      if (select1=="e"||select1=="E")
                      {
                          console.log("Test Başarılı");
                          await result.write("49", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("49", "Test Başarısız",1);
                      }
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
                      select1 = await question.ask("Görüntünün uzağa odaklama yaptığı ve görüntünün bozulmaya başladığı gözlemlendi mi? e/h");
                      if (select1=="e"||select1=="E")
                      {
                          console.log("Test Başarılı");
                          await result.write("50", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("50", "Test Başarısız",1);
                      }
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
                      select1 = await question.ask("Görüntünün yakına odaklama yaptığı önce görüntünün uzağa focuslu olduğu için düzelmeye başladığı ve daha sonra daha da yakına zoom yapmaya çalıştığında görüntünün bozulmaya başladığı gözlemlendi mi? e/h");
                      if (select1=="e"||select1=="E")
                      {
                          console.log("Test Başarılı");
                          await result.write("51", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("51", "Test Başarısız",1);
                      }
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
                      select1 = await question.ask("Kameranın focus yaptığı ve görünütünün düzeldiği gözlemlendi mi? e/h");
                      if (select1=="e"||select1=="E")
                      {
                          console.log("Test Başarılı");
                          await result.write("52", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("52", "Test Başarısız",1);
                      }
                      break;
                }
                case "53": {await test_set_res_fps(page,1,0);
                    await test_ffmpeg_res_fps("stream1",53,1);
                    break;
                }
                case "54": {await test_set_res_fps(page,1,1);
                    await test_ffmpeg_res_fps("stream1",54,1);
                    break;
                }
                case "55": {await test_set_res_fps(page,1,2);
                    await test_ffmpeg_res_fps("stream1",55,1);
                    break;
                }
                case "56": {await test_set_res_fps(page,1,3);
                    await test_ffmpeg_res_fps("stream1",56,1);
                    break;
                }
                case "57": {await test_set_res_fps(page,2,0);
                    await test_ffmpeg_res_fps("stream2",57,1);
                    break;
                }
                case "58": {await test_set_res_fps(page,2,1);
                    await test_ffmpeg_res_fps("stream2",58,1);
                    break;
                }
                case "59": {await test_set_res_fps(page,2,2);
                    await test_ffmpeg_res_fps("stream2",59,1);
                    break;
                }
                case "60": {await test_set_res_fps(page,2,3);
                    await test_ffmpeg_res_fps("stream2",60,1);
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
                      {
                          console.log("Test Başarılı");
                          await result.write("61", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("61", "Test Başarısız",1);
                      }
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
                      {
                          console.log("Test Başarılı");
                          await result.write("62", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("62", "Test Başarısız",1);
                      }
                      break;
                }
                case "63": {
                    console.log("Test 63 Başladı.");
                    await nav.toRTSP(page,ip);
                    await rtsp.rtsp_set_no(page,0);
                    var command = 'vlc rtsp://'+ip+'/stream1';
                    proc =await require('child_process').exec(command)
                    console.log("Lütfen VLC programının açılmasını bekleyin.\n\n");
                    await page.waitFor(5000);
                    select1 = await question.ask("RTSP kimlik doğrulama ekranı geldi mi? e/h");
                    select2 = await question.ask("Yayın geldi mi? e/h");
                      if ( (select1 == "h" || select1 == "H") && (select2 =="e"|| select2=="E"))
                      {
                          console.log("Test Başarılı");
                          await result.write("63", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("63", "Test Başarısız",1);
                      }
                      break;
                }
                case "65": {//TEST 65
                      console.log("Test 65 Başladı.");
                      await nav.toAlarm(page,ip); 
                      await alarm.set_motion_detector(page,"a");
                      await alarm.set_motion_treshold(page, "50",1);
                      await alarm.set_apply(page);
                      await camera_restart(page,ip);
                      console.log("Kameranın görüntüsünü DEFNE üzerinden izleyin. Kameranın önüne geçerek SEI Alarm Bilgisinin geldiği ve sol üst köşede kırmızı fontlu alarm bilgisinin gelmediğini gözlemleyin");
                      select1 = await question.ask("Kameranın önüne geçildiğinde SEI Alarm bilgisi geldi mi ? e/h");
                      select2 = await question.ask("Sol üst köşede kırmızı fontlu alarm bilgisi geldi mi? e/h");
                       if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                       {
                          console.log("Test Başarılı");
                          await result.write("65", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("65", "Test Başarısız",1);
                      }
                      break;
                }
                case "66":{//TEST 66
                      console.log("Test 66 Başladı.");
                      await nav.toAlarm(page,ip);
                      var is_active = await alarm.test_alarm_active(page); 
                      if(!is_active) await alarm.set_alarm_active(page);
                      await alarm.set_motion_detector(page, "k");
                      await alarm.set_apply(page);
                      await camera_restart(page,ip);
                      console.log("Kameranın görüntüsünü DEFNE üzerinden izleyin. Kameranın önüne geçerek SEI Alarm Bilgisinin geldiği ve sol üst köşede kırmızı fontlu alarm bilgisinin gelmediğini gözlemleyin");
                      select1 = await question.ask("Kameranın önüne geçildiğinde SEI Alarm bilgisi geldi mi ? e/h");
                      select2 = await question.ask("Sol üst köşede kırmızı fontlu alarm bilgisi geldi mi? e/h");
                       if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                      {
                          console.log("Test Başarılı");
                          await result.write("66", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("66", "Test Başarısız",1);
                      }
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
                       {
                          console.log("Test Başarılı");
                          await result.write("69", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("69", "Test Başarısız",1);
                      }
                      break;
                }
                   case "70":{//TEST 70
                      console.log("Test 70 Başladı.");
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın\n");
                      await nav.toVersion(page, ip);
                      await nav.toLive(page,ip);
                      console.log("Tanımlanmış maskelerden bir tanesi 'Maske ID' sekmesinden seçilir ve yönlendirme yapılır. Yönlendirme yapıldıktan sonra(maske sol, maske sağ, maske yukarı, maske aşağı) genişlik ve yükseklik değiştirilip 'Maskeyi güncelle' butonuna basılır. Bu durumda maskenin yeni özellikleri aldığı ve güncellendiği gözlemlenerek doğrulanır. Kamera yeniden başlatılır ve görüntü geldiğinde güncellenen maskenin yeni yerinde olduğu gözlemlenir.");
                      select1 = await question.ask("Ayarlarında değişiklik yapılan maske yeni özellikleri aldı mı? e/h");
                      select2 = await question.ask("Kamera yeniden başlatıldıktan ve görüntü geldikten sonra güncellenen maske son konumunu korudu mu? e/h");
                       if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                      {
                          console.log("Test Başarılı");
                          await result.write("70", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("70", "Test Başarısız",1);
                      }
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
                        var is_active = await mask.test_mask_active(page); 
                        if(!is_active) await mask.mask_visible(page);
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
                        {
                          console.log("Test Başarılı");
                          await result.write("71", "Test Başarılı",1);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("71", "Test Başarısız",1);
                      }
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
    try{ await test_ffmpeg_res("1920","1080","stream1m","14",2); }catch (err){ console.log("HATA");} break;}
            case "15" : {try{await test_ffmpeg_res("640","368","stream2m","15",2);}catch (err){ console.log("HATA");} break;}
            case "16" : {try{await test_ffmpeg_res("1920","1080","stream1","16",2);}catch (err){ console.log("HATA");} break;}
            case "17" : {try{await test_ffmpeg_res("640","368","stream2","17",2);}catch (err){ console.log("HATA");} break;}
            case "21":{
                console.log("TEY-2_ver06 Test-21 STARTED");
                await nav_dome.toDomeCamera(page,ip);
                await page.waitFor(2000);
                await ppp.set_preset_3_7(page);
                console.log("Presetler başarıyla kaydedildi");
                await cam.set_patrol_setting(page,"3,7","5,10");
                await page.waitFor(2000);
                console.log("Kameranın hareketini izleyin. 3 ve 7 numaralı indislere gidip sırasıyla 5 ve 10 saniye kalarak desene devam ettiğini gözlemleyin.");
                select1 = await question.ask("Kamera belirtilen zaman aralığı içerisinde girilen presetlere gidip ve orada belirlenen süre kadar bekledi mi ? e/h");
                if ( select1 == "e" || select1 == "E")
                {console.log("Test Başarılı");
                    await result.write("21"," BAŞARILI",2);
                }
                else
                { console.log("Test Başarısız");
                    await result.write("21"," BAŞARISIZ",2);
                }
                await cam.patrol_stop(page);
                break;
            }
            case "22": {
                await nav_dome.toDomeCamera(page,ip);
                await page.waitFor(2000);
                await ppp.set_preset_1(page);
                console.log("Alarm konumu başarıyla kaydedildi");
                await nav_dome.toDomeAlarm(page,ip);
                await alarm_dome.set_preset_id(page,"1");
                await alarm_dome.check_turn_location(page,1);
                await alarm_dome.alarm_apply(page);
                console.log("Alarm sekmesine alarm preseti kaydedildi");
                await camera_restart(page,ip);
                await result.write("22"," UYGULANDI    Ayarlar kaydedildi",2);
                console.log("OPTIONS SETTED ");
                break;
            }
            case "23": {//TEST23
                console.log(" ");
                console.log("TEY-2_ver06 Test-23 STARTED");
                await nav_dome.toDomeCamera(page,ip);
                await cam.set_goto_home(page,"100");
                await cam.check_turn_to_task(page,"0");
                await cam.goto_home_apply(page);
                await result.write("23"," UYGULANDI    Ayarlar kaydedildi",2);
                console.log("OPTIONS SETTED ");
                break;
            }
            case "24":{
                console.log(" ");
                        console.log("Test 24 Başladı.");
                        await nav.toResolution(page,ip);
                        await resolution.set_profile(page,"1080");
                        await resolution.set_resolution1(page,"1920 x 1080 (max:30fps");
                        await resolution.set_fps1(page,"10");
                        await resolution.apply(page);
                        console.log("Konfigürasyon ayarları yapıldı.");
                        await result.write("24", "Konfigürasyon ayarları yapıldı.",2);
                    break;
            }
          case "26" : {
                    console.log("Test 26 Başladı.");
                    for(var i = 1; i<5; i++){                        
                        await nav_dome.toDomeVersion(page, ip);
                        await nav_dome.toWatchCamera(page,ip);
                        await mask.select_mask(page, i);
                        console.log("Maske "+ i + " oluşturuluyor.");
                        await mask.mask_size(page, "10", "10");
                        var is_active = await mask.test_mask_active(page); 
                        if(!is_active) await mask.mask_visible(page);
                        //////APPLY/////
                        await mask.mask_refresh(page);
                        await mask.mask_apply(page);
                        await page.waitFor(5000);
                        await mask.mask_popup(page);
                    }
                    
                    for(var i = 1; i<5; i++){
                        await nav_dome.toDomeVersion(page, ip);
                        await nav_dome.toWatchCamera(page,ip);
                        console.log("Maske "+ i + " konumlandırılıyor.");
                        await mask.select_mask(page, i);
                       for( let j = 0; j<10; j++){                        
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
                    console.log("4 adet maske oluşturuldu ve konumlandırıldı.");
                    await result.write("26", "4 adet maske oluşturuldu ve konumlandırıldı.",2);
                    break;
                }
            case "27": {//TEST27
                console.log(" ");
                console.log("TEY-2_ver06 Test-27 STARTED");
                await nav_dome.toDomeEncodingHigh(page,ip);
                await encodingH.set_intraframe(page, "15");
                console.log("Intraframe aralığı(kare) = '15' ayarlandı.");
                await encodingH.set_bit_con(page, "cbr");
                console.log("Bitrate kontrol metodu = 'CBR' ayarlandı. ");
                await encodingH.set_codding_quality(page, "Yüksek");
                console.log("Profil = Yüksek ayarlandı. ");
                await encodingH.set_calc_met(page, "Tanımlı");
                console.log("Hedef bitrate hesaplama metodu = 'Tanımlı Bitrate değerine Göre' ayarlandı ");
                await encodingH.apply(page);
                await result.write("27"," UYGULANDI    Ayarlar kaydedildi",2);
                await camera_restart(page,ip);
                console.log("OPTIONS SETTED ");
                break;
            }
            case "28": {//TEST28
                console.log(" ");
                console.log("TEY-2_ver06 Test-28 STARTED");
                await nav_dome.toDomeEncodingLow(page,ip);
                await encodingLow_dome.set_intraframe(page, "15");
                await encodingLow_dome.set_bit_con(page, "cbr");
                await encodingLow_dome.set_codding_quality(page, "Yüksek");
                await encodingLow_dome.calculation_method(page,"tanımlı");
                await encodingLow_dome.set_bit_rate(page, "1");
                await encodingLow_dome.apply(page);
                await result.write("28","UYGULANDI    Ayarlar kaydedildi",2);
                await camera_restart(page,ip);
                console.log("OPTIONS SETTED ");
                break;
            }
           /* case "29": {//TEST29
                console.log(" ");
                console.log("TEY-2_ver06 Test-29 STARTED");
                await nav.toResolution(page,ip);
                await resolution.set_resolution1(page,"1280 x 720 (max:30fps");
                await resolution.set_fps1(page,"10");
                await resolution.apply(page);
                await result.write("29"+" UYGULANDI    Ayarlar kaydedildi",2);
                await camera_restart(page,ip);
                console.log("OPTIONS SETTED ");
                break;
            }*/
            case "30": {
                console.log("TEY-2_ver06 Test-30 STARTED");
                await nav_dome.toDomeCamera(page,ip);
                await cam.set_ir_filter_mode(page,"gece");
                console.log("IR-Cut Filtre Modu = 'Gece' ayarlandı. ");
                await cam.set_ir_filter_transition(page,"manuel");
                console.log("IR-Cut Filtre Geçişi = 'MANUEL' ayarlandı. ");
                await cam.set_ir_filter_treshold(page,"manuel");
                console.log("IR Aydınlatma = 'MANUEL' ayarlandı. ");
                await cam.ir_filter_apply(page);
                await result.write("30"," UYGULANDI    Ayarlar kaydedildi",2);
                console.log("OPTIONS SETTED ");
                break;
            }
            case "33": {//TEST33
                console.log(" ");
                console.log("TEY-2_ver06 Test-33 STARTED");
                await nav_dome.toDomeEncodingHigh(page,ip);
                var a0= await encodingH.test_intraframe_2(page);
                var a1= await encodingH.test_bit_con_2(page);
                var a2= await encodingH.test_codding_quality_2(page);
                var a3= await encodingH.test_bit_rate_2(page);
                var a4= await encodingH.test_calc_method_2(page);
                if(a0[2] && a1[2] && a2[2] && a3[2] && a4[2] && a4[5])
                await result.write("33","BAŞARILI   Intraframe = "+a0[1]+"  Bit kontrol metodu = "+a1[1]+"  Kodlayıcı kalitesi = "+a2[1]+"  Bitrate = "+a3[1]+"  Bitrate hesaplama metodu = "+a4[1]+"  Video kalite yüzdesi = "+a4[4],2);
                else
                await result.write("33","BAŞARISIZ   Intraframe = "+a0[1]+"  Bit kontrol metodu = "+a1[1]+"  Kodlayıcı kalitesi = "+a2[1]+"  Bitrate = "+a3[1]+"  Bitrate hesaplama metodu = "+a4[1]+"  Video kalite yüzdesi = "+a4[4],2);
                break;
            }
            case "34": {//TEST34
                console.log(" ");
                console.log("TEY-2_ver06 Test-34 STARTED");
                await nav_dome.toDomeEncodingLow(page,ip);
                a0 = await encodingLow_dome.test_intraframe_2(page);
                a1 = await encodingLow_dome.test_bit_con_2(page);
                a3 = await encodingLow_dome.test_bit_rate_2(page);
                a2 = await encodingLow_dome.test_codding_quality_2(page);
                if(a0[2] && a1[2] && a2[2] && a3[2])
                await result.write("34","BAŞARILI   Intraframe = "+a0[1]+"  Bit kontrol metodu = "+a1[1]+"  Kodlayıcı kalitesi = "+a2[1]+"  Bitrate = "+a3[1],2);
                else
                await result.write("34","BAŞARISIZ   Intraframe = "+a0[1]+"  Bit kontrol metodu = "+a1[1]+"  Kodlayıcı kalitesi = "+a2[1]+"  Bitrate = "+a3[1],2);
                break;
            }
             case "35": {//TEST35
                console.log(" ");
                console.log("TEY-2_ver06 Test-35 STARTED");
                await nav.toResolution(page,ip);
                temp_val0 = await resolution.test_profile(page,1);
                temp_val1 = await resolution.test_resolution1(page,1);
                temp_val2 = await resolution.test_fps1(page,3);
                temp_val3 = await resolution.test_resolution2(page,1);
                temp_val4 = await resolution.test_fps2(page,3);
                if(temp_val0[2] && temp_val1[2] && temp_val2[2] && temp_val3[2] && temp_val4[2])
                    await result.write("35","BAŞARILI Profil ="+temp_val0[1]+" Yayın1 Çözünürlük ="+temp_val1[1]+" FPS1 ="+temp_val2[1]+" Yayın2 Çözünürlük ="+temp_val3[1]+" FPS2 ="+temp_val4[1],2);
                else
                    await result.write("35","BAŞARISIZ Profil ="+temp_val0[1]+" Yayın1 Çözünürlük ="+temp_val1[1]+" FPS1 ="+temp_val2[1]+" Yayın2 Çözünürlük ="+temp_val3[1]+" FPS2 ="+temp_val4[1],2);
                break;
            } 
            case "36": { //TEST 36
                console.log("Test 36 Başladı");
                console.log("Vlc programı açıldıktan sonra 15 dakika görüntüyü izleyin ve görüntüde herhangi bir bozulma varmı kontrol edin. Sonrasında Vlc programını kapatın ve sonucu konsola yazın");
                console.log("Stream1m için canlı yayın açılıyor..")
                var command = 'vlc rtsp://admin:admin@'+ip+'/stream1m';
                proc =await require('child_process').exec(command);
                select0 = await question.ask("Görüntü Geldi mi? e/h");
                if (select0 == "e" || select0 == "E")
                {
                    select1 = await question.ask("Görüntüde istenmeyen bozukluklar var mı? e/h");
                    if (select1 == "h" || select1 == "H")
                    {
                        console.log("Vlc üzerinden çözünürlüğü kontrol edin.. İstenen çözünürlük 1920*1080")
                    select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                    if (select2 =="e"|| select2=="E")
                    {    console.log("Test Başarılı");
                    await result.write("36"," BAŞARILI Görüntüde bozulmalar yok ve istenen çözünürlükte",2);}
                    else
                    {await result.write("36"," BAŞARISIZ    Görüntünün çözünürlüğü yanlış.",2);
                    console.log("Test Başarısız")}
                    }
                    else
                    { await result.write("36"," BAŞARISIZ    Görüntüde bozulmalar var.",2);
                        console.log("Test başarısız Görüntüde bozulmalar var.")
                    }
                }
                else
                {await result.write("36"," BAŞARISIZ     Görüntü gelmiyor.",2);
                console.log("Test Başarısız Görüntü gelmiyor.")}
                
                break;
            }
            case "37": { //TEST 37
                console.log("Stream2m için canlı yayın açılıyor..")
                var command = 'vlc rtsp://admin:admin@'+ip+'/stream2m';
                proc =await require('child_process').exec(command);
                select1 = await question.ask("Görüntü Geldi mi ? e/h");
                if (select1=="e" || select1=="E"){
                console.log("Vlc üzerinden çözünürlüğü kontrol edin.. İstenen çözünürlük 640x368")
                select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                {  console.log("Test Başarılı");
                await result.write("37"," BAŞARILI    Görüntü çözünürlüğü doğru.",2);}
                else
                { console.log("Test Başarısız")
                await result.write("37"," BAŞARISIZ    Görüntünün çözünürlüğü yanlış.",2);}
                    
                }
                else 
                    await result.write("37"," BAŞARISIZ    Görüntü gelmiyor.",2);
                break;
            }
            case "38": { //TEST 38
                console.log("Stream1 için canlı yayın açılıyor..")
                var command = 'vlc rtsp://admin:admin@'+ip+'/stream1';
                proc =await require('child_process').exec(command);
                select1 = await question.ask("Görüntü Geldi mi ? e/h");
                if (select1=="e" || select1=="E"){
                console.log("Vlc üzerinden çözünürlüğü kontrol edin.. İstenen çözünürlük 640x368")
                select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                {  console.log("Test Başarılı");
                await result.write("38"," BAŞARILI    Görüntü çözünürlüğü doğru.",2);}
                else
                { console.log("Test Başarısız")
                await result.write("38"," BAŞARISIZ    Görüntünün çözünürlüğü yanlış.",2);}
                    
                }
                else 
                    await result.write("38"," BAŞARISIZ    Görüntü gelmiyor.",2);
                break;
            }
            case "39": { //TEST 39
                console.log("Stream2 için canlı yayın açılıyor..")
                var command = 'vlc rtsp://admin:admin@'+ip+'/stream2';
                proc =await require('child_process').exec(command);
                select1 = await question.ask("Görüntü Geldi mi ? e/h");
                if (select1=="e" || select1=="E"){
                console.log("Vlc üzerinden çözünürlüğü kontrol edin.. İstenen çözünürlük 640x368")
                select2 = await question.ask("Görüntü istenen çözünürlükte mi ? e/h");
                if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                {  console.log("Test Başarılı");
                await result.write("39"," BAŞARILI    Görüntü çözünürlüğü doğru.",2);}
                else
                { console.log("Test Başarısız")
                await result.write("39"," BAŞARISIZ    Görüntünün çözünürlüğü yanlış.",2);}
                
                }
                else 
                    await result.write("39"," BAŞARISIZ    Görüntü gelmiyor.",2);
                break;
            }
            case "42": {//TEST 42
                console.log(" ");
                console.log("TEY-2_ver06 Test-42 Başladı");
                await nav.toVersion(page,ip);
                var application = await version.test_application(page);
                var firmware = await version.test_firmware(page);
                select = await question.ask("Değerler başlangıçta girilen konfigrasyon ayarları ile aynı mı ? e/h");
                if (select == "e" || select1 == "E")
                {  console.log("Test Başarılı");
                await result.write("42"," BAŞARILI    Konfigrasyon ayarları doğru.",2);}
                else
                { console.log("Test Başarısız")
                await result.write("42"," BAŞARISIZ    Konfigrasyon ayarları yanlış. Yazılım sürümü="+firmware+"  Uygulama sürümü = "+application,2);}
                
                
               
                break;
            }
            case "43": { //TEST-43
                console.log("");
                console.log("TEY-2_ver06 Test-43 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                console.log("Göreve dön süresi kontrol ediliyor.")
                await page.waitFor(2000);
                var task_val = await cam.turn_to_task_value(page,300);
                if(task_val[2])
                await result.write("43"," BAŞARILI    İstenen göreve dön süresi="+task_val[0]+"  Gerçekleşen göreve dön süresi = "+task_val[1],2);
                else
                await result.write("43"," BAŞARISIZ    İstenen göreve dön süresi="+task_val[0]+"  Gerçekleşen göreve dön süresi = "+task_val[1],2);
                console.log("Test is completed!");
                break;
            }
            case "44": {//TEST-44
                console.log("");
                console.log("TEY-2_ver06 Test-44 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                console.log("Göreve Dön tiki kontrol ediliyor.")
                await page.waitFor(2000);
                await cam.turn_to_task_control(page);
                console.log("Test is completed!");
                break;
            }
            case "45": {
                console.log("TEY-2_ver06 Test-45 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                console.log("Patrol Preset Sıralaması kontrol ediliyor..")
                await cam.test_patrol_preset(page);
                console.log("Test is completed!");
                break;
            }
            case "46": {
                console.log("TEY-2_ver06 Test-46 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                console.log("Patrol zaman aralığı kontrol ediliyor..")
                await cam.test_patrol_time_range(page);
                console.log("Test is completed!");
                break;
            }
            case "47": {//TEST-47
                console.log("");
                var run_active = 1;
                console.log("TEY-2_ver06 Test-47 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                await page.waitFor(2000);
                for (let i = 0; i < 9; i++){
                    run_active = run_active && await cam.set_pattern_id(page,i);
                    await page.waitFor(2000);
                }
                if(run_active) await result.write("47"," BAŞARILI     Tüm patternlerin koş butonu aktif",2);
                    else await result.write("47"," BAŞARISIZ     Patternlerden en az birinin koş butonu aktif değil",2);
                console.log("Test is completed!");
                break;
            }
            case "50":{//TEST-50
                console.log("");
                console.log("Test Doc2-50 Started");
                await nav_dome.toDomeCamera(page,ip);
                await cam.ir_cut_open(page);
                await page.waitFor(4000);
                var temp_val0 = await cam.ir_cut_light_test(page,"AUTO");
                var temp_val1 = await cam.ir_cut_filtre_mode_test(page,"Gündüz");
                var temp_val2 = await cam.ir_cut_filtre_transition_test(page,"Otomatik");
                console.log("Test is completed!");
                if(temp_val0[2] && temp_val1[2] && temp_val2[2])
                await result.write("50"," BAŞARILI IR Aydınlatma = "+temp_val0[1]+"   IR Cut Filtre Modu = "+temp_val1[1]+"   IR-Cut Filtre Geçişi = "+temp_val2[1],2);
                else await result.write("50"," BAŞARISIZ IR Aydınlatma = "+temp_val0[1]+"   IR Cut Filtre Modu = "+temp_val1[1]+"   IR-Cut Filtre Geçişi = "+temp_val2[1],2);
                break;
            }
            case "51": {//TEST51
                console.log(" ");
                console.log("Control Doc2-51 STARTED");
                await nav_dome.toDomeCamera(page,ip);
                await page.waitFor(2000);
                await cam.set_goto_home(page,"50");
                await cam.check_turn_to_task(page,"0");
                await cam.goto_home_apply(page);
                console.log("OPTIONS SETTED ");
                page.reload();
                await login.loginCamera(page, ip);
                await nav_dome.toDomeCamera(page,ip);
                await page.waitFor(4000);
                var task_val = await cam.turn_to_task_value(page,"50");
                if(task_val[2])
                await result.write("51"," BAŞARILI    İstenen göreve dön süresi="+task_val[0]+"  Gerçekleşen göreve dön süresi = "+task_val[1],2);
                else
                await result.write("51"," BAŞARISIZ   İstenen göreve dön süresi="+task_val[0]+"  Gerçekleşen göreve dön süresi = "+task_val[1],2);
                console.log("Test is completed!");
                break;
            }
            case "52":{
                console.log("");
                console.log("Test Doc2-52 Started");
                await nav_dome.toDomeCamera(page,ip);
                await cam.ir_cut_open(page);
                await page.waitFor(2000);
                await cam.set_ir_filter_transition(page,"Otomatik");
                await cam.ir_filter_apply(page);
                console.log("IT-Cut Filtre Geçişi  Otomatik ayarlandı");
                var command = 'vlc rtsp://admin:admin@'+ip+'/stream1';
                proc =await require('child_process').exec(command);
                select0 = await question.ask("Kamera gündüz modunda mı? e/h");
                select1 = await question.ask("Kameranın merceğini bir cisimle kapatın. Kamera gece moduna geçti mi? e/h")
                select2 = await question.ask("Cismi kameranın önünden çekin. Kamera tekrardan gündüz moduna geçti mi? e/h");
                if(select0=="e"||select0=="E") select0=1; else select0=0;
                if(select1=="e"||select1=="E") select1=1; else select1=0;
                if(select2=="e"||select2=="E") select2=1; else select2=0;
                if(select0 && select1 && select2) await result.write("52"," BAŞARILI   Kamera IR-Cut Filtre Geçişini otomatik yapabiliyor.",2)
                else await result.write("52"," BAŞARISIZ   Kamera IR-Cut Filtre Geçişini otomatik yapamıyor.",2)
                console.log("Test is completed!");
                break;
                }
            
            
            case "54":{
                console.log("TEY-2_ver06 Test-54 Başladı");
                console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                console.log("Kameranın gücü kesilir ve bir süre beklendikten sonra tekrar verilir.  Kameranın canlı görünütüsü izlenmeye başladıktan bir süre sonra yine kameranın gücü kesilir bir süre beklenir. Ardından kameranın gücü tekrar verilir. Bu işlem aynı şekilde 1 kez daha tekrarlanır. Toplamda 3 sefer bu işlem yapıldıktan sonra kameranın canlı görüntüsü VLC üzerinden izlenir ve web arayüzüne giriş yapılır. Web arayüzüne giriş yapılabildiği ve görüntü çekilebildiği test edilerek doğrulanır.");
                select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi? e/h");
                if (select1=="e"||select1=="E")
                { console.log("Test Başarılı");
                await result.write("54"," BAŞARILI",2)}
                else
                {console.log("Test Başarısız");
                await result.write("54"," BAŞARISIZ",2)}
                break;
            }
            case "55":{
                console.log("TEY-2_ver06 Test-55 Başladı");
                console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                console.log("Kamera web arayüzü üzerinden yeniden başlatılır. Kamera arayüzüne erişim sağlandıktan sonra bu işlem aynı şekilde toplamda 3 sefer tekrarlanır. Daha sonra kameranın canlı görüntüsü VLC üzerinden izlenir ve web arayüzüne giriş yapılır. Bu işlemlerin  sonucunda istenilen işlemlerin sorunsuz bir şekilde yapıldığı gözlemlenerek doğrulanır.");
                select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi ? e/h");
                if (select1=="e"||select1=="E")
                { console.log("Test Başarılı");
                await result.write("55"," BAŞARILI",2)}
                else
                {console.log("Test Başarısız");
                await result.write("55"," BAŞARISIZ",2)}
                break;
            }
            case "56": {//TEST-56
                console.log("");
                console.log("TEY-2_ver06 Test-56 Başladı");
                await nav_dome.toTimeSettings(page,ip);
                await page.waitFor(2000);
                await timeSet.test_np1_value(page);
                select1 = await question.ask("NTP sunucu1 adresi doğru mu? e/h");
                if (select1=="e"||select1=="E")
                { console.log("Test Başarılı");
                await result.write("56"," BAŞARILI   NTP Sunucu1 adresi doğru",2)}
                else
                {console.log("Test Başarısız");
                await result.write("56"," BAŞARISIZ   NTP Sunucu1 adresi yanlış",2)}
                await timeSet.apply(page);
                await camera_restart(page,ip);
                
                console.log("Test is completed!");
                break;
            }
            case "57":{
                console.log("TEY-2_ver06 Test-57 Başladı");
                console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                console.log("Test bilgisayarından kameranın 1.stream adresi kullanılarak(rtsp://<KameraIPAdresi>/stream1) VLC üzerinden 5 adet unicast görüntü oynatılır. 5 adet unicast görüntü çekilirken görüntüde herhangi bir takılma, mozaiklenme, bozulma olmadığı gözlemlenerek kameradan istenilen çözünürlük ve fps değerinde en az 5 adet unicast yayın akışı başlatılabildiği doğrulanır.");
                select1 = await question.ask("İstenen işlemler sorunsuz bir şekilde yapılabildi mi ? e/h");
                if (select1=="e"||select1=="E")
                { console.log("Test Başarılı");
                await result.write("57"," BAŞARILI   Kamera istenilen çözünürlük ve fps değerinde en az 5 adet unicast yayın akışı başlatabiliyor.",2)}
                else
                {console.log("Test Başarısız");
                await result.write("57"," BAŞARISIZ   Kamera istenilen çözünürlük ve fps değerinde en az 5 adet unicast yayın akışı başlatamıyor.",2)}
                break;
            }
            case "58": {//TEST-58
                var temp_val = 1;
                console.log("");
                console.log("TEY-2_ver06 Test-58 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                await page.waitFor(2000);
                await cam.ir_cut_open(page);
                await cam.lighting_level(page,"manuel");
                console.log("Lütfen kameranın merceğini görebileceğiniz bir konuma getirin ");
                var level = ["level0","level1","level2","level3","level4","level5","level6","AUTO"];
                for (let i = 0; i < 7; i++){
                    await cam.lighting_level(page,level[i]);
                    await page.waitFor(3000);
                    select1 = await question.ask("Merceğin sağ ve solunda "+i+"adet IR Led yanıyor mu? e/h");
                    if (select1=="e"||select1=="E")
                    temp_val = temp_val && 1;
                    else
                    temp_val = temp_val && 0;
                }
                await cam.lighting_level(page,level[7]);
                    await page.waitFor(3000);
                if (temp_val) await result.write("58"," BAŞARILI   Tüm IR Aydınlatma seviyeleri düzgün çalışıyor.",2)
                else await result.write("58"," BAŞARISIZ   En az bir IR Aydınlatma seviyesi düzgün çalışmıyor.",2)
                console.log("Test is completed!");
                break;
            }
            case "61": {
                await test_set_res_fps_DOM(page,0,1,dom_ip);
                await test_ffmpeg_res_fps('stream1',61,2);
                break;
            }
            case "62": {
                await test_set_res_fps_DOM(page,1,1,dom_ip);
                await test_ffmpeg_res_fps('stream1',62,2);
                break;
            }
            case "63": {
                await test_set_res_fps_DOM(page,2,1,dom_ip);
                await test_ffmpeg_res_fps('stream1',63,2);
                break;
            }
            case "64": {
                await test_set_res_fps_DOM(page,3,1,dom_ip);
                await test_ffmpeg_res_fps('stream1',64,2);
                break;
            }
            case "65": {
                await test_set_res_fps_DOM(page,0,2,dom_ip);
                await test_ffmpeg_res_fps('stream2',65,2);
                break;
            }
            case "66": {
                await test_set_res_fps_DOM(page,1,2,dom_ip);
                await test_ffmpeg_res_fps('stream2',66,2);
                break;
            }
            case "67": {
                await test_set_res_fps_DOM(page,2,2,dom_ip);
                await test_ffmpeg_res_fps('stream2',67,2);
                break;
            }
            case "68": {
                await test_set_res_fps_DOM(page,3,2,dom_ip);
                await test_ffmpeg_res_fps('stream2',68,2);
                break;
            }
            case "69":{
                console.log("");
                console.log("TEY-2_ver06 Test-69 Başladı");
                await nav_dome.toRTSP(page,ip);
                rtsp.rtsp_set(page,"tanımlı","admin",1);
                await camera_restart(page,ip);
                console.log("OPTIONS SETTED");
                capture_test.watch_rtsp(ip,"stream1",1);
                select1 = await question.ask("RTSP Kimlik doğrulama ekranı gelip kimlik doğrulama sorunsuz bir şekilde yapılabildi mi? e/h");
                if (select1=="e"||select1=="E")
                await result.write("69"," BAŞARILI   Stream1 için RTSP Kimlik doğrulama çalışıyor",2);
                else
                await result.write("69"," BAŞARISIZ   Stream1 için RTSP Kimlik doğrulama çalışmıyor",2);
                console.log("Test is completed!");
                break;
            }
            case "70":{
                console.log("");
                console.log("TEY-2_ver06 Test-70 Başladı");
                await nav_dome.toRTSP(page,ip);
                rtsp.rtsp_set(page,"tanımlı","admin",1);
                await camera_restart(page,ip);
                console.log("OPTIONS SETTED");
                capture_test.watch_rtsp(ip,"stream2",1);
                select1 = await question.ask("RTSP Kimlik doğrulama ekranı gelip kimlik doğrulama sorunsuz bir şekilde yapılabildi mi? e/h");
                if (select1=="e"||select1=="E")
                await result.write("70"," BAŞARILI   Stream2 için RTSP Kimlik doğrulama çalışıyor",2);
                else
                await result.write("70"," BAŞARISIZ   Stream2 için RTSP Kimlik doğrulama çalışmıyor",2);
                console.log("Test is completed!");
                break;
            }
            case "71":{
                console.log("");
                console.log("TEY-2_ver06 Test-71 Başladı");
                await nav_dome.toRTSP(page,ip);
                await rtsp.rtsp_set_no(page,0);
                await camera_restart(page,ip);
                console.log("OPTIONS SETTED");
                await capture_test.watch_rtsp(ip,"stream1",0);
                select1 = await question.ask("RTSP Kimlik doğrulama ekranı gelmeden görüntü izlenebildi mi? e/h");
                if (select1=="e"||select1=="E")
                await result.write("71"," BAŞARILI   RTSP Kimlik doğrulama kapatılabiliyor.",2);
                else
                await result.write("71"," BAŞARISIZ   RTSP Kimlik doğrulama kapatılamıyor.",2);
                console.log("Test is completed!");
                break;
            }
            case "72":{
                console.log("TEY-2_ver06 Test-72 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                console.log("Kamera web arayüzü üzerinden Kamera sekmesine tıklanır. Pan, Tilt, Zoom, Focus seçeneğinden Aşağı butonuna basılır. Kamera en alt konuma geldikten sonra 180 derece dönmeye başladığında hareketi tamamlamadan buton basılı durumdan çıkarılır. Bu koşulda  kameranın aşağıya bakmaya devam ettiği ve yukarıya yönlenmediği hareketi gözlemlenerek doğrulanır.");
                select1 = await question.ask("Kamera aşağıya bakmaya devam etti mi ? e/h");
                if (select1=="e"||select1=="E")
                await result.write("72"," BAŞARILI   Kamera en aşağı konumdayken aşağı butonuna basıldığında 180 derece dönüyor ve yukarıya yönelmiyor.",2);
                else
                await result.write("72"," BAŞARISIZ   Kamera en aşağı konumdayken aşağı butonuna basıldığında 180 derece dönmüyor ve yukarıya yöneliyor.",2);
                break;
            }
            case "73":{
                console.log("TEY-2_ver06 Test-73 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
                console.log("Kamera web arayüzü üzerinden Kamera sekmesine tıklanır. Pan, Tilt, Zoom, Focus seçeneğinden Aşağı butonuna basılır. Kamera en alt konuma konuma geldikten sonra 180 derece dönmeye başladığı ve Aşağı butonuna basılmadan önceki konumuna kadar yukarı hareket ettiği gözlemlenerek e-flip özelliğinin çalışması doğrulanır.");
                select1 = await question.ask("Kamera en alt konuma konuma geldikten sonra 180 derece dönüp Aşağı butonuna basılmadan önceki konumuna kadar yukarı hareket etti mi? e/h");
                if (select1=="e"||select1=="E")
                await result.write("73"," BAŞARILI   Kamera en aşağı konumdayken aşağı butonuna basıldığında 180 derece dönüyor ve e-flip hareketini gerçekleştiriyor.",2);
                else
                await result.write("73"," BAŞARISIZ   Kamera en aşağı konumdayken aşağı butonuna basıldığında 180 derece dönmüyor veya e-flip hareketini gerçekleştirmiyor.",2);
            }
            case "75":{
                console.log("TEY-2_ver06 Test-75 Başladı");
                console.log("Kamera sabit bir noktaya bakarken kameranın gücünü kesin. Güç kapalı iken kameranın baktığı açı ve kameranın konumunu değiştirin. ");
                await question.ask("Kameraya tekrar güç verip ENTER'a basın.")
                await camera_restart(page,ip);
                select1 = await question.ask("Kamera gücü kesilmeden önceki konumuna döndü mü? e/h");
                if (select1=="e"||select1=="E")
                await result.write("75"," BAŞARILI   Kamera güç kesintisinde konumu değişirse güç geldiğinde eski konumuna dönüyor.",2);
                else
                await result.write("75"," BAŞARISIZ   Kamera güç kesintisinde konumu değişirse güç geldiğinde eski konumuna dönmüyor.",2);
                break;
            }
            case "77":{//77-78
                var temp_val = 1;
                console.log("");
                console.log("TEY-2_ver06 Test-77 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                await page.waitFor(2000);
                await cam.set_goto_home(page,"50");
                await cam.check_turn_to_task(page,"1");
                await cam.goto_home_apply(page);
                await cam.set_pattern(page);
                await cam.pattern_run(page);
                console.log("Kamera desene başladı. Lütfen kamerayı bir süre gözlemleyiniz.. Ardından zoom kontolü göndermek için ENTER tuşuna basın.");
                var time0 = await ppp.push_time(page,1);
                await cam.PTZ(page);
                console.log("Son kullanıcı müdahele saati = "+time0);
                select0 = await question.ask("Kamera durdu mu? e/h")
                if(select0=="e" || select0 == "E")
                {   console.log("Lütfen kamera harekete yeniden başlayıncaya kadar bekleyin ve hareket başladığında zamanı kaydetmek için ENTER'a basın.")
                    var time1= await ppp.push_time(page,1);
                    console.log("Desene yeniden başlama saati = "+time1);
                    select1 = await question.ask("Kamera deseni düzgün bir şekilde gerçekleştiriyor mu? e/h");
                    if(select1=="e" || select1 == "E") temp_val = temp_val && 1;
                    else temp_val = 0;
                    select2 = await question.ask("Kamera durduktan sonra ve Serbest Süre kadar zaman geçtikten sonra harekete devam etti mi ? ")
                    if(select2=="e" || select3 == "E") temp_val = temp_val && 1;
                    else temp_val =0;
                    if (temp_val) {
                        console.log("Test Başarılı")
                        await result.write("77"," BAŞARILI   Son kullanıcı müdahele saati = "+time0+"   Desene yeniden başlama saati = "+time1,2)
                    }
                    else{
                        console.log("Test Başarısız");
                        await result.write("77"," BAŞARISIZ   Son kullanıcı müdahele saati = "+time0+"  Desene yeniden başlama saati = "+time1,2)
                    }
                }
                else
                {
                    await result.write("77"," BAŞARISIZ   Kamera desen uygularken zoom kontrolü yollandığında durmuyor."+time1,2)
                    console.log("Test Başarısız")
                }
                await cam.pattern_cancel(page);
                console.log("Test is completed!");
                break;
            }
            case "79":{
                console.log("");
                console.log("TEY-2_ver06 Test-79 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                await page.waitFor(2000);
                await cam.set_pattern(page);
                await cam.pattern_run(page);
                await page.waitFor(2000);
                select1 = await question.ask("Kamera deseni gerçekleştiriyor mu? e/h");
                if (select1=="e"||select1=="E")
                {
                    await nav_dome.toDomeVersion(page,ip);
                    await version_dome.reload(page);
                    console.log("Lütfen kameranın açılmasını bekleyin....");
                    await camera_restart(page,ip);
                    select = await question.ask("Kamera açıldıktan sonra desene devam etti mi? e/h");
                    if (select=="e"||select=="E")
                    { console.log("Test Başarılı");
                        await result.write("79"," BAŞARILI   Kamera yeniden başlatma sonrasında desene devam ediyor.",2)
                    }
                    else
                    { console.log("Test Başarısız");
                        await result.write("79"," BAŞARISIZ   Kamera yeniden başlatma sonrasında desene devam etmiyor.",2)
                    }
                }
                else
                console.log("Deseni başlatıp tekrar deneyin . Test sonucu dosyaya KAYDEDİLMEDİ.");
                await cam.pattern_cancel(page);
                break;
            }
            case "80":{
                console.log("");
                console.log("TEY-2_ver06 Test-80 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                await page.waitFor(2000);
                await cam.set_pattern(page);
                await cam.pattern_run(page);
                select1 = await question.ask("Kamera deseni gerçekleştiriyor mu? e/h");
                if (select1=="e"||select1=="E")
                {
                    await question.ask("Lütfen kameranın gücünü kesin ve 15-20 sn sonra gücü tekrar verin. Ardından ENTER'a basın..");
                    await camera_restart(page,ip);
                    select = await question.ask("Kamera açıldıktan sonra desene devam etti mi? e/h");
                    if (select=="e"||select=="E")
                    {
                        console.log("Test Başarılı");
                        await result.write("80"," BAŞARILI   Kamera güç kesintisi sonrasında desene devam ediyor.",2)
                    }
                    else
                    {
                        console.log("Test Başarısız");
                        await result.write("80"," BAŞARISIZ   Kamera güç kesintisi sonrasında desene devam etmiyor.",2)
                    }
                }
                else
                console.log("Deseni başlatıp tekrar deneyin . Test sonucu dosyaya KAYDEDİLMEDİ.");
                await cam.pattern_cancel(page);
                break;
            }
            case "81":{//81,82,83
                var times= new Array();
                console.log("");
                console.log("TEY-2_ver06 Test-81 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                await page.waitFor(2000);
                await cam.set_goto_home(page,"50");
                await cam.check_turn_to_task(page,"1");
                await cam.goto_home_apply(page);
                await cam.set_pattern(page); ///daha önce kaydettiğimiz bir deseni çalıştırıyoruz. Bu kod için pattern_id:1
                await cam.pattern_run(page);
                select1 = await question.ask("Kamera deseni gerçekleştiriyor mu? e/h");
                if(select1=="e"||select1=="E")
                select1=1;
                else
                select1 = 0;
                console.log("DEFNE'den kameranın canlı görüntüsünü açın ve kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                time0= await ppp.push_time(page,1);
                console.log("Alarm başlama saati: "+time0);
                select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                if(select3=="e"||select3=="E")
                select3=1;
                else
                select3=0;
                console.log("Alarmı sonlandırmak için çıkarmış olduğunuz kabloyu tekrar yerine takın. Ardından alarm bitiş saatini kaydetmek için ENTER'a basın.")
                time1= await ppp.push_time(page,1);
                console.log("Alarm bitiş saati = "+time1);
                select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                if(select2=="e"||select2=="E")
                select2=1;
                else
                select2=0;
                console.log("Kamera desene yeniden başlayana kadar bekleyin. Ardından Desene yeniden başlama saatini kaydetmek için ENTER'a basın.")
                time2= await ppp.push_time(page,1);
                console.log("Desene yeniden başlama saati = "+time2);
                select4 = await question.ask("Kamera daha önce yaptığı desene devam etti mi? e/h");
                if(select4=="e"||select4=="E")
                select4=1;
                else
                select4=0;
                if(select1 && select2 && select3 && select4)
                await result.write("81"," BAŞARILI   Alarm başlama saati: "+time0+"  Alarm bitiş saati = "+time1+" Desene yeniden başlama saati = "+time2,2)
                else
                await result.write("81"," BAŞARISIZ   ",2)
                console.log("Test is completed!");
                await cam.pattern_cancel(page);
                break;
            }
            case "84":{//84-94 arası
                var times_bitis= new Array();
                var times_basla= new Array();
                var time_desen_devam;
                console.log("");
                console.log("TEY-2_ver06 Test-84 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                await page.waitFor(2000);
                await cam.set_goto_home(page,"50");
                await cam.check_turn_to_task(page,"1");
                await cam.goto_home_apply(page);
                await cam.set_pattern(page); ///daha önce kaydettiğimiz bir deseni çalıştırıyoruz. Bu kod için pattern_id:1
                await cam.pattern_run(page);
                select1 = await question.ask("Kamera deseni gerçekleştiriyor mu? e/h");
                if(select1=="e"||select1=="E"){
                    console.log("DEFNE'den kameranın canlı görüntüsünü açın.");
                    for(var i=0 ; i<5 ; i++){
                        console.log("Kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                        times_basla[i]=await ppp.push_time(page,1);
                        console.log((i+1)+". Alarm başlama saati:"+times_basla[i]);
                        console.log("Lütfen bekleyin..")
                        //await page.waitFor(10000);
                        console.log("En az 10 sn bekleyin ve kabloyu yeniden takıp Enter tuşuna basın");
                        times_bitis[i]=await ppp.push_time(page,1);
                        console.log((i+1)+". Alarm bitiş saati:"+times_bitis[i]);
                        //await page.waitFor(10000);
                        console.log("Lütfen bekleyin..")
                    }
                    console.log("Kamera desene yeniden başlayana kadar bekleyin. Ardından Desene yeniden başlama saatini kaydetmek için ENTER'a basın.")
                    time_desen_devam= await ppp.push_time(page,1);
                    console.log("Desene yeniden başlama saati:"+time_desen_devam);
                    select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                    if(select2=="e"||select2=="E")
                    select2=1;
                    else
                    { select2=0;
                        await result.write("84","BAŞARISIZ    Alarm varolduğu sürece DEFNE'ye alarm bilgisi gelmedi.",2)
                    }
                    select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                    if(select3=="e"||select3=="E")
                    select3=1;
                    else
                    { select3=0;
                        await result.write("84","BAŞARISIZ    Alarm oluşturulduğunda kamera girilen Preset değerine hareket etmedi.",2)
                    }
                    var text = " ";
                    if(select2 && select3){
                        text = (i+1)+".Alarm başlangıç saati = "+times_basla[i]+"....."+(i+1)+".Alarm bitiş saati = "+times_bitis[i]+"    ";
                        await result.write("84","BAŞARILI    "+1+".Alarm başlangıç saati = "+times_basla[0]+"....."+1+".Alarm bitiş saati = "+times_bitis[0],2)
                        for(let i= 1; i<5; i++)
                        {
                            text = (i+1)+".Alarm başlangıç saati = "+times_basla[i]+"....."+(i+1)+".Alarm bitiş saati = "+times_bitis[i]+"    ";
                            await result.write("84","........."+text,2)
                        }
                        text = "Desene yeniden başlama saati:"+time_desen_devam;
                        await result.write("84","........."+text,2)
                    }
                                    }
                else{
                    console.log("Test Başarısız");
                    await result.write("84","BAŞARISIZ    Kamera deseni gerçekleştirmiyor.",2)
                }
                console.log("Test is completed!");
                await cam.pattern_cancel(page);
                break;
            }
            case "95":{//95-98 arası
                var times= new Array();
                console.log("");
                console.log("TEY-2_ver06 Test-95 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                await page.waitFor(2000);
                await cam.set_goto_home(page,"50");
                await cam.check_turn_to_task(page,"1");
                await cam.goto_home_apply(page);
                await cam.set_pattern(page); ///daha önce kaydettiğimiz bir deseni çalıştırıyoruz. Bu kod için pattern_id:1
                await cam.pattern_run(page);
                select1 = await question.ask("Kamera deseni gerçekleştiriyor mu? e/h");
                if(select1=="e"||select1=="E")
                {
                    select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                    times[0]= await ppp.get_time(1);
                    console.log("Alarm başlama saati:"+times[0]);
                    console.log("Lütfen bir süre bekleyin.");
                    await page.waitFor(3000);
                    await cam.PTZ(page);
                    times[2] = await ppp.get_time(1);
                    console.log("Kullanıcı müdahele etme saati:"+times[2]);
                    console.log("PanTiltZoom kontrolü uygulandı.");
                    console.log("Serbest süre x 2 kadar bekleyin (100sn)");
                    await page.waitFor(100000);
                    select4 = await question.ask("Kamera kullanıcının bıraktığı konumda kalmaya devam etti mi? e/h");
                    if(select4=="e"||select4=="E")
                    { select4=1;  times[3]= await ppp.get_time(1); console.log("Hareket olmadığının en son kontrol edildiği saat: "+times[3]);}
                    else
                    {  select4=0; times[3]= "HATA: Kamera pattern hareketine yeniden başladı." }
                    select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                    if(select2=="e"||select2=="E")
                    select2=1;
                    else
                    select2=0;
                    select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                    if(select3=="e"||select3=="E")
                    select3=1;
                    else
                    select3=0;
                    console.log("Kameranın alarmını durdurun ardından ENTER tuşuna basın.")
                    times[1]=await ppp.push_time(page,1);
                    console.log("ALarm bitiş saati: "+times[1])
                    if(select2 && select3 && select4)
                    await result.write("95","BAŞARILI    Alarm başlama saati:"+times[0]+"Alarm bitiş saati: "+times[1]+"Kullanıcı müdahele etme saati:"+times[2]+"Hareket olmadığının en son kontrol edildiği saat: "+times[3],2);
                    else await result.write("95","BAŞARISIZ    Alarm başlama saati:"+times[0]+"Alarm bitiş saati: "+times[1]+"Kullanıcı müdahele etme saati:"+times[2]+"Hareket olmadığının en son kontrol edildiği saat: "+times[3],2);
                    
                }
                else
                { console.log("Test Başarısız");    await result.write("95","BAŞARISIZ    Kamera deseni gerçekleştirmiyor.",2)}
                console.log("Test is completed!");
                await cam.pattern_cancel(page);
                break;
            }
            case "99":{//99-101 arası
                var times= new Array();
                console.log("");
                console.log("TEY-2_ver06 Test-99 Başladı");
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
                    times[0]=await ppp.get_time(1);;
                    console.log("Alarm başlama saati:"+times[0]);
                    console.log("Serbest süre x 2 kadar bekleyin (100sn)");
                    await timer(page,100);
                    await page.waitFor(100000);
                    select4 = await question.ask("Kamera preset konumda kalmaya devam etti mi? e/h");
                    if(select4=="e"||select4=="E")
                    {  select4=1; times[2]=await ppp.get_time(1);;
                    console.log("Hareket olmadığının en son kontrol edildiği saat:"+times[2]);}
                    else
                    {  select4=0; times[2] = "HATA: Kamera pattern hareketine yeniden başladı "}
                    select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                    if(select2=="e"||select2=="E")
                    select2=1;
                    else
                    select2=0;
                    select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                    if(select3=="e"||select3=="E")
                    select3=1;
                    else
                    select3=0;
                    console.log("Kameranın alarmını durdurun ardından ENTER tuşuna basın.")
                    times[1]=await ppp.push_time(page,1);
                    console.log("ALarm bitiş saati: "+times[1])
                    if(select2 && select3 && select4)
                    await result.write("99","BAŞARILI    Alarm başlama saati:"+times[0]+"Alarm bitiş saati: "+times[1]+"Hareket olmadığının en son kontrol edildiği saat: "+times[2],2);
                    else await result.write("99","BAŞARISIZ    Alarm başlama saati:"+times[0]+"Alarm bitiş saati: "+times[1]+"Hareket olmadığının en son kontrol edildiği saat: "+times[2],2);
                }
                else
                { console.log("Test Başarısız"); await result.write("99","BAŞARISIZ    Kamera deseni gerçekleştirmiyor.",2)}
                console.log("Test is completed!");
                await cam.pattern_cancel(page);
                break;
            }
            case "102":{//102-105
                var times= new Array();
                console.log("");
                console.log("TEY-2_ver06 Test-102 Başladı");
                await nav_dome.toDomeCamera(page,ip);
                await page.waitFor(2000);
                await cam.set_goto_home(page,"50");
                await cam.check_turn_to_task(page,"0");
                await cam.goto_home_apply(page);
                await cam.set_pattern(page); ///daha önce kaydettiğimiz bir deseni çalıştırıyoruz. Bu kod için pattern_id:1
                await cam.pattern_run(page);
                select1 = await question.ask("Kamera deseni gerçekleştiriyor mu? e/h");
                if(select1=="e"||select1=="E")
                {
                    select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                    times[0]= await ppp.get_time(1);
                    console.log("Alarm başlama saati:"+times[0]);
                    console.log("Lütfen bir süre bekleyin.");
                    await page.waitFor(3000);
                    await cam.PTZ(page);
                    times[2] = await ppp.get_time(1);
                    console.log("Kullanıcı müdahele etme saati:"+times[2]);
                    console.log("PanTiltZoom kontrolü uygulandı.");
                    console.log("Serbest süre x 2 kadar bekleyin (100sn)");
                    await timer(page,100);
                    await page.waitFor(100000);
                    select4 = await question.ask("Kamera kullanıcının bıraktığı konumda kalmaya devam etti mi? e/h");
                    if(select4=="e"||select4=="E")
                    { select4=1;  times[3]= await ppp.get_time(1); console.log("Hareket olmadığının en son kontrol edildiği saat: "+times[3]);}
                    else
                    {  select4=0; times[3]= "HATA: Kamera pattern hareketine yeniden başladı." }
                    select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                    if(select2=="e"||select2=="E")
                    select2=1;
                    else
                    select2=0;
                    select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                    if(select3=="e"||select3=="E")
                    select3=1;
                    else
                    select3=0;
                    console.log("Kameranın alarmını durdurun ardından ENTER tuşuna basın.")
                    times[1]=await ppp.push_time(page,1);
                    console.log("ALarm bitiş saati: "+times[1])
                    if(select2 && select3 && select4)
                    await result.write("102","BAŞARILI    Alarm başlama saati:"+times[0]+"Alarm bitiş saati: "+times[1]+"Kullanıcı müdahele etme saati:"+times[2]+"Hareket olmadığının en son kontrol edildiği saat: "+times[3],2);
                    else await result.write("102","BAŞARISIZ    Alarm başlama saati:"+times[0]+"Alarm bitiş saati: "+times[1]+"Kullanıcı müdahele etme saati:"+times[2]+"Hareket olmadığının en son kontrol edildiği saat: "+times[3],2);
                    
                }
                else
                { console.log("Test Başarısız");    await result.write("102","BAŞARISIZ    Kamera deseni gerçekleştirmiyor.",2)}
                console.log("Test is completed!");
                await cam.pattern_cancel(page);
                break;
            }
            case "107":{
                await nav_dome.toDomeCamera(page,ip);
                await ppp.set_preset(page);
                await ppp.set_patrol(page);
                await ppp.goto_home(page,1,"70");
                await ppp.run_patrol(page);
                console.log("Patrol 9sn devam edecek ardından kameraya sağa dön komutu verilecek..")
                await page.waitFor(9000);
                console.log("Kamera sağa dönüyor..")
                await ppp.turn_left_right(page,"r");
                time1 = await ppp.get_time(1);
                console.log("Son kullanıcı saati = "+time1)
                console.log("Kamera patrole yeniden başladığında entera basın..");
                time2 = await ppp.push_time(page,1);
                console.log("Patrola yeniden başlama saati = "+time2)
                await ppp.break_patrol(page);
                select1 = await question.ask("Patrol girilen presetlere gitti mi? e/h");
                select2 = await question.ask("Patrol girilen presetlerde belirlenen süre kadar kaldı mı? e/h");
                select3 = await question.ask("Kameraya sağa dön komutu verildikten sonra patrol durdu mu? e/h");
                select4 = await question.ask("Göreve dön süresi(70sn) kadar zaman geçtikten sonra patrole devam edildi mi? e/h");
                if(select1)
                {
                    if(select2){
                        if(select3){
                            if(select4){
                                await result.write("107","BAŞARILI    Son kullanıcı saati = "+time1+"Patrola yeniden başlama saati = "+time2,2);
                            }
                            else await result.write("107","BAŞARISIZ    Son kullanıcı saati = "+time1+"Patrola yeniden başlama saati = "+time2,2);
                        }
                        else await result.write("107","BAŞARISIZ    Patrole devam ederken sağa dön komutu verildiğinde patrol durdurulmadı.",2);
                    }
                    else await result.write("107","BAŞARISIZ    Patrol girilen presetlerde belirlenen süre kalmadı.",2);
                }
                else await result.write("107","BAŞARISIZ    Patrol girilen presetlere gitmedi.",2);
                console.log("Test done.");
                break;
            }
            case "109":{
                await nav_dome.toDomeCamera(page,ip);
                await ppp.set_preset(page);
                await ppp.set_patrol(page);
                await ppp.run_patrol(page);
                await page.waitFor(2000);
                select1 = await question.ask("Kamera patrol hareketini gerçekleştiriyor mu? e/h");
                if (select1=="e"||select1=="E")
                {
                    await nav_dome.toDomeVersion(page,ip);
                    await version_dome.reload(page);
                    console.log("Lütfen kameranın açılmasını bekleyin....");
                    await camera_restart(page,ip);
                    select = await question.ask("Kamera açıldıktan sonra patrole devam etti mi? e/h");
                    if (select=="e"||select=="E")
                    { console.log("Test Başarılı");
                    await result.write("109","BAŞARILI    Kamera yeniden başlatıldıktan sonra önce yapmakta olduğu işe devam ediyor.",2);}
                    else
                    { console.log("Test Başarısız");
                    await result.write("109","BAŞARISIZ    Kamera yeniden başlatıldıktan sonra önce yapmakta olduğu işe devam etmiyor.",2);}
                }
                else
                console.log("Patrol hareketini başlatıp tekrar deneyin");
                await ppp.break_patrol(page);
                break;
            }
            case "110":{
                await nav_dome.toDomeCamera(page,ip);
                await ppp.set_preset(page);
                await ppp.set_patrol(page);
                await ppp.run_patrol(page);
                await page.waitFor(2000);
                select1 = await question.ask("Kamera patrol hareketini gerçekleştiriyor mu? e/h");
                if (select1=="e"||select1=="E")
                {
                    await question.ask("Lütfen kameranın gücünü kesin ve 15-20 sn sonra gücü tekrar verin. Ardından ENTER'a basın..");
                    await camera_restart(page,ip);
                    select = await question.ask("Kamera açıldıktan sonra patrole devam etti mi? e/h");
                    if (select=="e"||select=="E")
                    { console.log("Test Başarılı");
                    await result.write("110","BAŞARILI    Kamera güç kesintisinden sonra önce yapmakta olduğu işe devam ediyor.",2);}
                    else
                    { console.log("Test Başarısız");
                    await result.write("110","BAŞARISIZ    Kamera güç kesintisinden sonra önce yapmakta olduğu işe devam etmiyor.",2);}
                }
                else
                console.log("Patrol hareketini başlatıp tekrar deneyin");
                await ppp.break_patrol(page);
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
                times0 = await ppp.push_time(page);
                console.log("Alarma başlama saati = "+times0);
                console.log("Lütfen alarm bittiğinde 'ENTER'a basın");
                times1 = await ppp.push_time(page);
                console.log("Alarm bitiş saati = "+times1);
                console.log("Lütfen patrol tekrar başladığında 'ENTER'a basın");
                times2 = await ppp.push_time(page);
                console.log("Patrole yeniden başlama saati = "+times2);
                await ppp.break_patrol(page);
                select1 = await question.ask("Alarm başlatıldığından kamera Alarm Preset'ine yöneldi mi? e/h");
                if (select1=="e"||select1=="E")
                select1 = 1;
                else
                {  select1 = 0;
                await result.write("111","BAŞARISIZ    Alarm başlatıldığında kamera Alarm presetine yönelmedi.",2);}
                select2 = await question.ask("Alarm varolduğu süre boyunca DEFNE yazılımında alarm bilgisi mevcutmuydu? e/h");
                if (select2=="e"||select2=="E")
                select2 = 1;
                else
                {  select2 = 0;
                await result.write("111","BAŞARISIZ    Alarm varolduğu süre boyunca DEFNE yazılımında alarm bilgisi mevcut değildi.",2);}
                if (select1 && select2)  await result.write("111","BAŞARILI    Alarma başlama saati = "+times0+"Alarm bitiş saati = "+times1+"Patrole yeniden başlama saati = "+times2,2);
 console.log("Test done");
 break;
            }
            case "114":{
                var times_basla = new Array();
                var times_bitis = new Array();
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
                    times_basla[i] = await ppp.push_time(page);
                    console.log("Lütfen alarm bittiğinde 'ENTER'a basın.. İki işlem arasında en az 10 saniye süre olması gerekmektedir... ");
                    times_bitis[i] = await ppp.push_time(page);
                }
                console.log("Lütfen patrol tekrar başladığında 'ENTER'a basın");
                var time_patrol = await ppp.push_time(page);
                //await ppp.break_patrol(page);
                select1 = await question.ask("Alarm başlatıldığında kamera Alarm Preset'ine yöneldi mi? e/h");
                if (select1=="e"||select1=="E")
                select1 = 1;
                else
                select1 = 0;
                select2 = await question.ask("Alarm varolduğu süre boyunca DEFNE yazılımında alarm bilgisi mevcutmuydu? e/h");
                if (select2=="e"||select2=="E")
                select2 = 1;
                else
                select2 = 0;
                var text = " ";
                if(select1 ){
                    if(select2){
                        text = (i+1)+".Alarm başlangıç saati = "+times_basla[i]+"....."+(i+1)+".Alarm bitiş saati = "+times_bitis[i]+"    ";
                        await result.write("114","BAŞARILI    "+1+".Alarm başlangıç saati = "+times_basla[0]+"....."+1+".Alarm bitiş saati = "+times_bitis[0],2)
                        for(let i= 1; i<5; i++)
                        {
                            text = (i+1)+".Alarm başlangıç saati = "+times_basla[i]+"....."+(i+1)+".Alarm bitiş saati = "+times_bitis[i]+"    ";
                            await result.write("114","........."+text,2)
                        }
                        text = "Desene yeniden başlama saati:"+time_patrol;
                        await result.write("114","........."+text,2)
                    }
                    else  await result.write("114","BAŞARISIZ    Alarm varolduğu süre boyunca DEFNE yazılımında alarm bilgisi mevcut değildi.",2)
                }
                else{
                    console.log("Test Başarısız");
                    await result.write("114","BAŞARISIZ    Alarm başlatıldığında kamera Alarm Presetine yönelmedi",2)
                }
                
                await ppp.break_patrol(page);
                console.log("Test done")
                break;
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
                console.log("PanTiltZoom kontrolü uygulandı");
                await ppp.go_position(page,"3000","7500","6000");
                times[2] = await ppp.get_time();
                console.log("140sn bekleyin")
                for(let i=140;i>0;i--)
                {
                    await page.waitFor(1000);
                    console.log("Kalan Süre:"+i+"sn   Lütfen Bekleyin");
                }
                select3 = await question.ask("Kamera patrole yeniden başladı mı? e/h")
                if (select3=="h"||select3=="H")
                {select3 = 1; times[3] = await get_time(1);}
                else
                {  select3 = 0; times[3] = "HATA: Kamera patrole yeniden başladı"}
                select1 = await question.ask("Alarm başlatıldığından kamera Alarm Preset'ine yöneldi mi? e/h");
                if (select1=="e"||select1=="E")
                select1 = 1;
                else
                select1 = 0;
                select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                if (select2=="e"||select2=="E")
                select2 = 1;
                else
                select2 = 0;
                console.log("Lütfen alarmı sonlandırın ve 'ENTER'a basın");
                times[1] = await ppp.push_time(page);
                if(select1)
                {
                    if(select2)
                    {
                        if(select3)
                        await result.write("125","BAŞARILI    Alarm başlatıldığında kamera Alarm Presetine yönelmedi",2)
                        else
                        await result.write("125","BAŞARISIZ    Kamera patrole yeniden başladı",2)
                    }
                    else
                    await result.write("125","BAŞARISIZ    Alarm var olduğu sürece DEFNEde sol üst köşede SEI Alarm bilgisi gelmedi",2)
                }
                else
                await result.write("125","BAŞARISIZ    Alarm başlatıldığında kamera Alarm Presetine yönelmedi",2)
                await ppp.break_patrol(page);
                break;
            }
            case "129" : {
                var times = new Array();
                await nav_dome.toDomeCamera(page,ip);
                await ppp.set_preset(page);
                await ppp.set_patrol(page);
                await ppp.goto_home(page,0,"70");
                await ppp.run_patrol(page);
                select = await question.ask("Kamera patrole başladı mı ? e/h");
                if (select=="e" || select == "E")
                {
                    console.log("Patrol başlatıldı lütfen DEFNE yazılımınızı çalıştırın...");
                    console.log("Lütfen saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkartarak alarm oluşturunuz...");
                    console.log("Lütfen alarmı oluşturduğunuzda 'ENTER'a basın");
                    times[0] = await ppp.push_time(page,1);
                    console.log("Alarm başlama saati"+times[0]);
                    console.log("140sn bekleyin")
                    for(let i=140;i>0;i--)
                    {
                        await page.waitFor(1000);
                        console.log("Kalan Süre:"+i+"sn   Lütfen Bekleyin");
                    }
                    select0 = await question.ask("Kamera patrole devam ediyor mu ? e/h");
                    if (select0=="H" || select0 == "h")
                    {
                        times[2] = await ppp.get_time(1);
                        console.log("Hareket olmadığının en son kontrol edildiği saat:"+times[2])
                        console.log("Lütfen alarmı sonlandırın ardından saati kaydetmek için ENTER tuşuna basın")
                        times[1] = await ppp.push_time(page,1)
                        console.log("Alarmı sonlandırma saati:"+times[1]);
                        select1 = await question.ask("Alarm başlatıldığından kamera Alarm Preset'ine yöneldi mi? e/h");
                        if (select1=="e"||select1=="E")
                        {
                            await result.write("129","BAŞARILI    Alarm başlama saati"+times[0]+"Alarmı sonlandırma saati:"+times[1]+"Hareket olmadığının en son kontrol edildiği saat:"+times[2],2)
                        }
                        else await result.write("129","BAŞARISIZ    Alarm başlatıldığına kamera alarm presetine yönelmiyor.",2)
                    }
                    else await result.write("129","BAŞARISIZ    Kamera patrole yeniden başlıyor.",2)
                }
                else await result.write("129","BAŞARISIZ    Kamera patrole başlamıyor. Lütfen tekrar deneyin.",2)
                    await ppp.break_patrol(page);
                break;
            }
            case "132" : {
                var times = new Array();
                await nav_dome.toDomeCamera(page,ip);
                await ppp.set_preset(page);
                await ppp.set_patrol(page);
                await ppp.goto_home(page,0,"70");
                await ppp.run_patrol(page);
                select = await question.ask("Kamera patrole başladı mı ? e/h");
                if (select=="e" || select == "E")
                console.log("Patrol başlatıldı lütfen DEFNE yazılımınızı çalıştırın...");
                console.log("Lütfen saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkartarak alarm oluşturunuz...");
                console.log("Lütfen alarmı oluşturduğunuzda 'ENTER'a basın");
                times[0] = await ppp.push_time(page,1);
                console.log("Alarm başlama saati"+times[0]);
                console.log("Kameraya PTZ hareketleri uygulanacak. Lütfen bekleyin.")
                await page.waitFor(7000);
                await ppp.go_position(page,"3000","7500","6000");
                times[2] = await ppp.get_time();
                console.log("PTZ uygulandı. Kullanıcı müdahale saati : "+times[2]);
                console.log("140sn bekleyin")
                /*for(let i=140;i>0;i--)
                {
                    await page.waitFor(1000);
                    console.log("Kalan Süre:"+i+"sn   Lütfen Bekleyin");
                }*/
                select0 = await question.ask("Kamera patrole devam ediyor mu ? e/h");
                if (select0=="H" || select0 == "h")
                {
                    times[3] = await ppp.get_time(1);
                    console.log("Hareket olmadığının en son kontrol edildiği saat:"+times[3])
                    console.log("Lütfen alarmı sonlandırın ardından saati kaydetmek için ENTER tuşuna basın")
                    times[1] = await ppp.push_time(page,1)
                    console.log("Alarmı sonlandırma saati:"+times[1]);
                    select1 = await question.ask("Alarm başlatıldığından kamera Alarm Preset'ine yöneldi mi? e/h");
                    if (select1=="e"||select1=="E")
                    {
                        await result.write("132","BAŞARILI    Alarm başlama saati"+times[0]+"Alarmı sonlandırma saati:"+times[1]+"Hareket olmadığının en son kontrol edildiği saat:"+times[3],2)
                    }
                    else await result.write("132","BAŞARISIZ    Alarm başlatıldığında kamera alarm presetine yönelmiyor.",2)
                }
                else await result.write("132","BAŞARISIZ    Kamera patrole yeniden başlıyor.",2)
            break; }
            
        case "137": {//TEST-137
            console.log("");
            console.log("TEY-2_ver06 Test-137 Başladı");
            await nav_dome.toDomeCamera(page,ip);
            await page.waitFor(2000);
            await cam.turn_left(page);
            await page.waitFor(4000);
            select = await cam.stop_isactive(page);
            if(select == "visible"){
                console.log("Stop butonu aktif..")
            await cam.stop(page);
}
            select2 = await question.ask("Kamera sola dönüp durdu mu? e/h")
            if (select2 == 'E' || select2 == 'e')
            {if(select == "visible")
                await result.write("137","BAŞARILI    Stop butonu aktif ve otopan hareketleri gerçekleştirildi.",2)
                else await result.write("137","BAŞARISIZ    Kamera otopan hareketini gerçekleştirmedi.",2)
            }
            else
            await result.write("137","BAŞARISIZ    Stop butonu aktif değil.",2)
            console.log("Test is completed!");
            break;
        }
        case "138": {//TEST-138
            console.log("");
            console.log("TEY-2_ver06 Test-138 Başladı");
            await nav_dome.toDomeCamera(page,ip);
            await page.waitFor(2000);
            await cam.turn_left(page);
            await page.waitFor(4000);
            await cam.turn_right(page);
            select = await cam.stop_isactive(page);
            if(select == "visible"){
                console.log("Stop butonu aktif..")
            await cam.stop(page);}
            select2 = await question.ask("Kamera önce sola ardından sağa dönüp durdu mu? e/h")
            if (select2 == 'E' || select2 == 'e')
            {if(select == "visible")
                await result.write("138","BAŞARILI    Stop butonu aktif ve otopan hareketleri gerçekleştirildi.",2)
                else await result.write("138","BAŞARISIZ    Kamera otopan hareketini gerçekleştirmedi.",2)
            }
            else
            await result.write("138","BAŞARISIZ    Stop butonu aktif değil.",2)
            console.log("Test is completed!");
            break;
        }
        case "139": {//TEST-139
            console.log("");
            console.log("TEY-2_ver06 Test-139 Başladı");
            await nav_dome.toDomeCamera(page,ip);
            await page.waitFor(2000);
            await cam.turn_right(page);
            await page.waitFor(4000);
            select = await cam.stop_isactive(page);
            if(select == "visible"){
                console.log("Stop butonu aktif..")
            await cam.stop(page);}
            select2 = await question.ask("Kamera sağa dönüp durdu mu? e/h")
            if (select2 == 'E' || select2 == 'e')
            {if(select == "visible")
                await result.write("139","BAŞARILI    Stop butonu aktif ve otopan hareketleri gerçekleştirildi.",2)
                else await result.write("139","BAŞARISIZ    Kamera otopan hareketini gerçekleştirmedi.",2)
            }
            else
            await result.write("139","BAŞARISIZ    Stop butonu aktif değil.",2)
            break;
        }
        case "140": {//TEST-140
            console.log("");
            console.log("TEY-2_ver06 Test-140 Başladı");
            await nav_dome.toDomeCamera(page,ip);
            await page.waitFor(2000);
            await cam.turn_right(page);
            await page.waitFor(4000);
            await cam.turn_left(page);
            select = await cam.stop_isactive(page);
            if(select == "visible"){
                console.log("Stop butonu aktif..")
            await cam.stop(page);}
            select2 = await question.ask("Kamera önce sağa ardından sola dönüp durdu mu? e/h")
            if (select2 == 'E' || select2 == 'e')
            {if(select == "visible")
                await result.write("140","BAŞARILI    Stop butonu aktif ve otopan hareketleri gerçekleştirildi.",2)
                else await result.write("140","BAŞARISIZ    Kamera otopan hareketini gerçekleştirmedi.",2)
            }
            else
            await result.write("140","BAŞARISIZ    Stop butonu aktif değil.",2)
            console.log("Test is completed!");
            break;
        }
        case "141":{//141-142
            console.log("");
            console.log("TEY-2_ver06 Test-141 Başladı");
            await nav_dome.toDomeCamera(page,ip);
            await page.waitFor(2000);
            await cam.set_goto_home(page,"30");
            await cam.check_turn_to_task(page,"1");
            await cam.goto_home_apply(page);
            await cam.turn_left(page);
            select = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
            if(select=="e"||select=="E")
            {
                await cam.PTZ(page);
                var command=await ppp.get_time(1);;
                console.log("Son müdehale saati:"+command);
                select3 = await question.ask("Otopan hareketi durdu mu? e/h");
                if(select3=="e"||select3=="E")
                {
                  select2 = await question.ask("30 sn bekleyin ve kamera otopan hareketine tekrar başlayınca 'e' tuşlayınız. Eğer kamera otopan hareketine başlamazsa 'h' tuşlayın.");
                if (select2=="e"||select2=="E"){
                    var command1=await ppp.get_time(1);;
                    console.log("Otopan hareketine yeniden başlama saati:"+command1);
                    await result.write("141","BAŞARILI     Son müdehale saati:"+command+"Otopan hareketine yeniden başlama saati:"+command1,2);
                }
                else await result.write("141","BAŞARISIZ     Kamera otopan hareketine yeniden başlamadı.",2);
                 
                }
                else await result.write("141","BAŞARISIZ     Kamera PTZ hareketinden sonra otopan hareketine devam etti.",2);
                
                
            }
            else await result.write("141","BAŞARISIZ     Kamera otopan hareketine başlamadı. Tekrar deneyin.",2);
            await cam.stop(page);
            console.log("Test is completed!");
            break;
        }
        case "143": {//TEST-143
            console.log("");
            console.log("TEY-2_ver06 Test-143 Başladı");
            await nav_dome.toDomeCamera(page,ip);
            await page.waitFor(2000);
            await cam.turn_right(page);
            select1 = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
            if (select1=="e"||select1=="E")
                {
            await nav_dome.toDomeVersion(page,ip);
            await version_dome.reload(page);
            console.log("Lütfen kameranın açılmasını bekleyin....");
                    await camera_restart(page,ip);
            select = await question.ask("Kamera açıldıktan sonra otopan hareketine devam etti mi? e/h");
            if (select=="e"||select=="E")
            {console.log("Test Başarılı"); await result.write("143","BAŞARILI     Kamera yeniden başlatma sonrası otopan hareketine devam etti",2);}
            else
            {console.log("Test Başarısız"); await result.write("143","BAŞARISIZ     Kamera yeniden başlatma sonrası otopan hareketine devam etmedi",2);}}
            else console.log("Otopan hareketini başlatıp tekrar deneyin");
            await nav_dome.toDomeCamera(page,ip);           
            await cam.stop(page);
            break;
        }
        case "144":{
            console.log("");
            console.log("TEY-2_ver06 Test-144 Başladı");
            await nav_dome.toDomeCamera(page,ip);
            await page.waitFor(2000);
            await cam.turn_right(page);
            select1 = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
            if (select1=="e"||select1=="E")
                {
                    await question.ask("Lütfen kameranın gücünü kesin ve 15-20 sn sonra gücü tekrar verin. Ardından ENTER'a basın..");
                    await camera_restart(page,ip);
                    select = await question.ask("Kamera açıldıktan sonra otopan hareketine devam etti mi? e/h");
            if (select=="e"||select=="E")
            {console.log("Test Başarılı"); await result.write("144","BAŞARILI     Kamera güç kesintisi sonrası otopan hareketine devam etti",2);}
            else
            {console.log("Test Başarısız"); await result.write("144","BAŞARISIZ     Kamera güç kesintisi sonrası otopan hareketine devam etmedi",2);}
                }
                else
                console.log("Otopan hareketini başlatıp tekrar deneyin");
                await nav_dome.toDomeCamera(page,ip);
                await cam.stop(page);
             
            break;
        }
        case "145":{//145,146,147
            var times= new Array();
            console.log("");
            console.log("TEY-2_ver06 Test-145 Başladı");
            await nav_dome.toDomeCamera(page,ip);
            await page.waitFor(2000);
            await cam.set_goto_home(page,"30");
            await cam.check_turn_to_task(page,"1");
            await cam.goto_home_apply(page);
            await cam.turn_left(page);
            select = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
            if(select=="e"||select=="E"){
                await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve otopan hareketi devam ederken kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                times[0]=await ppp.get_time(1);;
                console.log("Alarm başlama saati:"+times[0]);
                await question.ask("10 sn bekleyin ve alarmı sonlandırın. Ardından ENTER'a basın.");
                times[1]=await ppp.get_time(1);
                console.log("Alarm bitiş saati :"+times[1]);
                await question.ask("Serbest süre kadar (30sn) bekleyin ve kamera otopan hareketine başladığında ENTER'a basın.");
                times[2]=await ppp.get_time(1);
                console.log("Otopana yeniden başlama saati:"+times[2]);
                
                select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                if(select2=="e"||select2=="E")
                {
                select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                if(select3=="e"||select3=="E")
                {
                    await result.write("145","BAŞARILI Alarm başlama saati:"+times[0]+" Alarm bitiş saati :"+times[1]+" Otopana yeniden başlama saati:"+times[2],2);
                }
                else
                {
                    await result.write("145","BAŞARISIZ    Alarm oluştuğunda kamera alarm presetine yönelmedi.",2);
                }
                }
                else
                    await result.write("145","BAŞARISIZ    Alarm varolduğu süre boyunca DEFNEde SEI Alarm bilgisi gelmedi.",2);
               
            }
            else
            {
                    await result.write("145","BAŞARISIZ     Kamera otopan hareketini gerçekleştirmedi.Tekrar deneyin.",2);
            console.log("Test Başarısız");}
            console.log("Test is completed!");
                await cam.stop(page);
            break;
        }
        case "148":{//148-158 arası
            var times_basla= new Array();
            var times_bitis = new Array();
            var time_otopan_devam;
            console.log("");
            console.log("TEY-2_ver06 Test-148 Başladı");
            await nav_dome.toDomeCamera(page,ip);
            await page.waitFor(2000);
            await cam.set_goto_home(page,"30");
            await cam.check_turn_to_task(page,"1");
            await cam.goto_home_apply(page);
            await cam.turn_left(page);
            select = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
            console.clear();
            if(select=="e"||select=="E"){
                console.log("Lütfen DEFNE programını çalıştırın. Ardından saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkartarak alarm oluşturunuz...");
                for(let i=0;i<4;i++)
                {
                    await question.ask("Lütfen"+(i+1)+"'nci alarmı oluşturduğunuzda 'ENTER'a basın");
                    times_basla[i] = await ppp.get_time(page);
                    await question.ask("Lütfen alarm bittiğinde 'ENTER'a basın.. İki işlem arasında en az 10 saniye süre olması gerekmektedir... ");
                    times_bitis[i] = await ppp.get_time(page);
                    console.clear();
                }
                console.log("Lütfen"+(5)+"'nci alarmı oluşturduğunuzda 'ENTER'a basın");
                    times_basla[4] = await ppp.push_time(page);
                    select1 = await question.ask("Alarm başlatıldığında kamera Alarm Preset'ine yöneldi mi? e/h");
                if (select1=="e"||select1=="E")
                select1 = 1;
                else
                select1 = 0;
                console.clear();
                    console.log("Lütfen alarmı sonlandırın ardından 'ENTER'a basın.. ");
                    times_bitis[4] = await ppp.push_time(page);
                    
                    
                console.clear();
                await page.waitFor(1000);
                select0 = await question.ask("Lütfen otopan tekrar başladığında 'e' tuşlayın eğer 1 dakika içerisinde başlamazsa 'h' tuşlayın");
                if (select0=="e"||select0=="E")
                {
                    var time_patrol = await ppp.get_time(1);
                
                select2 = await question.ask("Alarm varolduğu süre boyunca DEFNE yazılımında alarm bilgisi mevcutmuydu? e/h");
                if (select2=="e"||select2=="E")
                select2 = 1;
                else
                select2 = 0;
                var text = " ";
                if(select1 ){
                    if(select2){
                        text = (i+1)+".Alarm başlangıç saati = "+times_basla[i]+"....."+(i+1)+".Alarm bitiş saati = "+times_bitis[i]+"    ";
                        await result.write("148","BAŞARILI    "+1+".Alarm başlangıç saati = "+times_basla[0]+"....."+1+".Alarm bitiş saati = "+times_bitis[0],2)
                        for(let i= 1; i<5; i++)
                        {
                            text = (i+1)+".Alarm başlangıç saati = "+times_basla[i]+"....."+(i+1)+".Alarm bitiş saati = "+times_bitis[i]+"    ";
                            await result.write("148","........."+text,2)
                        }
                        text = "Desene yeniden başlama saati:"+time_patrol;
                        await result.write("148","........."+text,2)
                    }
                    else  await result.write("148","BAŞARISIZ    Alarm varolduğu süre boyunca DEFNE yazılımında alarm bilgisi mevcut değildi.",2)
                }
                else{
                    console.log("Test Başarısız");
                    await result.write("148","BAŞARISIZ    Alarm başlatıldığında kamera Alarm Presetine yönelmedi",2)
                }
                
            }
            else await result.write("148","BAŞARISIZ    Otopan alarm sonlandırıldıktan sonra tekrar başlamıyor.",2)
            }
            else
                await await result.write("148","BAŞARISIZ    Otopan başlatılamadı tekrar deneyin.",2)
                await cam.stop(page);
                console.log("Test done")
                break;
         }
        case "159":{//159-162 arası
            var times= new Array();
            console.log("");
            console.log("TEY-2_ver06 Test-159 Başladı");
            await nav_dome.toDomeCamera(page,ip);
            await page.waitFor(2000);
            await cam.set_goto_home(page,"30");
            await cam.check_turn_to_task(page,"1");
            await cam.goto_home_apply(page);
            await cam.turn_left(page);
            select = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
            if(select=="e"||select=="E"){
                select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve otopan hareketi devam ederken kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                times[0]=await ppp.get_time(1);;
                console.log("Alarm başlama saati:"+times[0]);
                console.log("PanTiltZoom uygulanıyor. Lüften SerbestSürex2 (60sn) bekleyin.")
                await cam.PTZ(page);
                times[2]=await ppp.get_time(1);;
                console.log("Kullanıcı müdehale saati:"+times[2]);
                await page.waitFor(1000);
                await timer(page,60);
                await page.waitFor(60000);
                select0 = await question.ask("Kamera otopana devam ediyor mu?  e/h");
                if(select0=="h"||select0=="H")
                {
                    times[3]=await ppp.get_time(1);;
                console.log("Hareket olmadığının en son kontrol edildiği saat:"+times[3]);
                select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                if(select2=="e"||select2=="E")
                {
                    select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                if(select3=="e"||select3=="E")
                { await question.ask("Alarmı durdurun ardından ENTER'a basın.")
                    times[1] = await ppp.get_time(1);
                    console.log("Alarmın bitiş saati:"+times[1]);
                    await result.write("159","BAŞARILI     Alarm başlama saati:"+times[0]+"Alarmın bitiş saati:"+times[1]+"Kullanıcı müdehale saati:"+times[2]+"Hareket olmadığının en son kontrol edildiği saat:"+times[3],2);
                }
                else await result.write("159","BAŞARISIZ     Alarm oluşturulduğunda kamera alarm presetlerine yönelmiyor.",2);
                    
                }
                else await result.write("159","BAŞARISIZ     Alarm varolduğu sürece DEFNEde SEI alarm bilgisi gelmedi.",2);
               
                }
                else await result.write("159","BAŞARISIZ    Kamera serbest süre geçtikten sonra otopana devam ediyor.",2)
            }
            else await result.write("159","BAŞARISIZ     Kamera otopana başlamıyor. Testi tekrar deneyin.",2);
            console.log("Test is completed!");
            await cam.stop(page);
            break;
        }
        case "163":{//163-165 arası
            var times= new Array();
            console.log("");
            console.log("TEY-2_ver06 Test-163 Başladı");
            await nav_dome.toDomeCamera(page,ip);
            await page.waitFor(2000);
            await cam.set_goto_home(page,"30");
            await cam.check_turn_to_task(page,"0");
            await cam.goto_home_apply(page);
            await cam.turn_left(page);
            select = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
            if(select=="e"||select=="E"){
                select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve otopan hareketi devam ederken kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                times[0]=await ppp.get_time(1);;
                console.log("Alarm başlama saati:"+times[0]);
                console.log("Lüften SerbestSürex2 (60sn) bekleyin.")
                await page.waitFor(1000);
                await timer(page,60);
                await page.waitFor(60000);
                select0 = await question.ask("Kamera otopana devam ediyor mu?  e/h");
                if(select0=="h"||select0=="H")
                {
                    times[2]=await ppp.get_time(1);;
                console.log("Hareket olmadığının en son kontrol edildiği saat:"+times[2]);
                select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                if(select2=="e"||select2=="E")
                {
                    select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                if(select3=="e"||select3=="E")
                { await question.ask("Alarmı durdurun ardından ENTER'a basın.")
                    times[1] = await ppp.get_time(1);
                    console.log("Alarmın bitiş saati:"+times[1]);
                    await result.write("163","BAŞARILI     Alarm başlama saati:"+times[0]+"Alarmın bitiş saati:"+times[1]+"Hareket olmadığının en son kontrol edildiği saat:"+times[2],2);
                }
                else await result.write("163","BAŞARISIZ     Alarm oluşturulduğunda kamera alarm presetlerine yönelmiyor.",2);
                    
                }
                else await result.write("163","BAŞARISIZ     Alarm varolduğu sürece DEFNEde SEI alarm bilgisi gelmedi.",2);
               
                }
                else await result.write("163","BAŞARISIZ    Kamera serbest süre geçtikten sonra otopana devam ediyor.",2)
            }
            else await result.write("163","BAŞARISIZ     Kamera otopana başlamıyor. Testi tekrar deneyin.",2);
            console.log("Test is completed!");
            await cam.stop(page);
            break;
        }
        case "166":{//166-169
             var times= new Array();
            console.log("");
            console.log("TEY-2_ver06 Test-166 Başladı");
            await nav_dome.toDomeCamera(page,ip);
            await page.waitFor(2000);
            await cam.set_goto_home(page,"30");
            await cam.check_turn_to_task(page,"0");
            await cam.goto_home_apply(page);
            await cam.turn_left(page);
            select = await question.ask("Kamera oto pan hareketini gerçekleştiriyor mu? e/h");
            if(select=="e"||select=="E"){
                select_1 = await question.ask("DEFNE'den kameranın canlı görüntüsünü açın ve otopan hareketi devam ederken kameranın alarm girişine saha dolabı kapağının açılma durumunu simüle eden kabloyu çıkarıp Enter tuşuna basın.");
                times[0]=await ppp.get_time(1);;
                console.log("Alarm başlama saati:"+times[0]);
                console.log("PanTiltZoom uygulanıyor. Lüften SerbestSürex2 (60sn) bekleyin.")
                await cam.PTZ(page);
                times[2]=await ppp.get_time(1);;
                console.log("Kullanıcı müdehale saati:"+times[2]);
                await page.waitFor(1000);
                await timer(page,60);
                await page.waitFor(60000);
                select0 = await question.ask("Kamera otopana devam ediyor mu?  e/h");
                if(select0=="h"||select0=="H")
                {
                    times[3]=await ppp.get_time(1);;
                console.log("Hareket olmadığının en son kontrol edildiği saat:"+times[3]);
                select2 = await question.ask("Alarm var olduğu sürece DEFNE'de sol üst köşede SEI Alarm bilgisi geldi mi? e/h");
                if(select2=="e"||select2=="E")
                {
                    select3 = await question.ask("Alarm oluşturulduğunda kamera girilen Preset değerine hareket etti mi? e/h");
                if(select3=="e"||select3=="E")
                { await question.ask("Alarmı durdurun ardından ENTER'a basın.")
                    times[1] = await ppp.get_time(1);
                    console.log("Alarmın bitiş saati:"+times[1]);
                    await result.write("166","BAŞARILI     Alarm başlama saati:"+times[0]+"Alarmın bitiş saati:"+times[1]+"Kullanıcı müdehale saati:"+times[2]+"Hareket olmadığının en son kontrol edildiği saat:"+times[3],2);
                }
                else await result.write("166","BAŞARISIZ     Alarm oluşturulduğunda kamera alarm presetlerine yönelmiyor.",2);
                    
                }
                else await result.write("166","BAŞARISIZ     Alarm varolduğu sürece DEFNEde SEI alarm bilgisi gelmedi.",2);
               
                }
                else await result.write("166","BAŞARISIZ    Kamera serbest süre geçtikten sonra otopana devam ediyor.",2)
            }
            else await result.write("166","BAŞARISIZ     Kamera otopana başlamıyor. Testi tekrar deneyin.",2);
            console.log("Test is completed!");
            await cam.stop(page);
            break;
        }
        case "171":{
            console.log("");
            console.log("TEY-2_ver06 Test-171 Başladı");
            await nav_dome.toDomeAlarm(page,ip);
            select = await question.ask("Saha dolabının kapağının kapanış/açılış durumunu simüle etmek için hareketli kameraya takılı olan konektörü çıkarıp devam etmek için Enter tuşuna basınız.");
            page.reload();
            await login.loginCamera(page, ip);
            await nav_dome.toDomeAlarm(page,ip);
            temp_val0 = await alarm_dome.alarm_is_active(page);
            temp_val1 = await alarm_dome.active_alarms_control(page,"alarm1 input");
            if(temp_val0[1] && temp_val1[1])
                await result.write("171","BAŞARILI     Alarm aktif seçeneği tikli. Aktif alarm:"+temp_val1[0],2);
            else await result.write("171","BAŞARISIZ    Alarm aktif seçeneği tiki = "+temp_val0[0]+". Aktif alarm:"+temp_val1[0],2);
            console.log("Test is completed!");
            break;
        }
        //////////172-173 ALARM SEKMESİ HAREKET TESPİTİ (yok)
        case "174":{//174-176 arası
            var times= new Array();
            console.log("");
            console.log("TEY-2_ver06 Test-174 Başladı");
            await nav_dome.toDomeCamera(page,ip);
            await page.waitFor(2000);
            await cam.set_goto_home(page,"40");
            await cam.check_turn_to_task(page,"1");
            await cam.goto_home_apply(page);
            await question.ask("Saha dolabının kapağının kapanış/açılış durumunu simüle etmek için hareketli kameraya takılı olan konektörü çıkarıp  Enter tuşuna basınız.");
            times[0]=await ppp.get_time(1);;
            console.log("Alarm başlama saati:"+times[0]);
            select1 = await question.ask("Kamera tanımlanan presete gitti mi? e/h");
            if(select1=="e"||select1=="E")
            {
                await timer(page,80);
                await page.waitFor(80000);
                select2 = await question.ask("Kamera hala preset noktasına bakmaya devam ediyor mu? e/h");
                if(select2=="e"||select2=="E")
                    {
                    await question.ask("Kameraya konnektörü geri takıp  Enter tuşuna basınız.");
                    times[1]=await ppp.get_time(1);;
                    console.log("Alarm bitiş saati:"+times[1]);
                    select4 = await question.ask("Kamera alarm oluşturulmadan önceki konumuna dönünce 'e' tuşlayın. 1 dakika içerisinde dönmezse 'h' tuşlayın");
                    if(select4=="e"||select4=="E")
                    {
                        times[2]=await ppp.get_time(1);;
                        console.log("Harekete devam etme saati:"+times[2]);
                        await result.write("174", "BAŞARILI    Alarm başlama saati:"+times[0]+"Alarm bitiş saati:"+times[1]+"Harekete devam etme saati:"+times[2],2);
                    }
                    else await result.write("174", "BAŞARISIZ    Kamera alarm sonlandırıldıktan sonra eski konumuna dönmüyor.",2);
                    }
                    else await result.write("174", "BAŞARISIZ    Kamera alarm aktifken eski konumuna dönmüyor.",2);
            }
            else await result.write("174", "BAŞARISIZ    Kamera alarm oluşturulduğunda alarm presetine yönelmiyor",2);
        
            console.log("Test is completed!");
            break;
        }
        case "179":{//TEST 179
                      console.log("Test 179 Başladı.");
                      await nav_dome.toDomeVersion(page, ip);
                      await nav_dome.toWatchCamera(page,ip);
                      console.log("Test 21'de oluşturulan 4 adet maskenin canlı izlemede görüldüğü ve konumlarının aynı kaldığını gözlemleyin");
                      select1 = await question.ask("4 adet maske görüldü mü? e/h");
                      select2 = await question.ask("Maskelerin konumları aynı mı? e/h");
                       if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                       {
                          console.log("Test Başarılı");
                          await result.write("179", "Test Başarılı",2);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("179", "Test Başarısız",2);
                      }
                      break;
                }
        case "180":{//TEST 180
                      console.log("Test 180 Başladı.");
                      console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın\n");
                      await nav_dome.toDomeVersion(page, ip);
                      await nav_dome.toWatchCamera(page,ip);
                      console.log("Tanımlanmış maskelerden bir tanesi 'Maske ID' sekmesinden seçilir ve yönlendirme yapılır. Yönlendirme yapıldıktan sonra(maske sol, maske sağ, maske yukarı, maske aşağı) genişlik ve yükseklik değiştirilip 'Maskeyi güncelle' butonuna basılır. Bu durumda maskenin yeni özellikleri aldığı ve güncellendiği gözlemlenerek doğrulanır. Kamera yeniden başlatılır ve görüntü geldiğinde güncellenen maskenin yeni yerinde olduğu gözlemlenir.");
                      select1 = await question.ask("Ayarlarında değişiklik yapılan maske yeni özellikleri aldı mı? e/h");
                      select2 = await question.ask("Kamera yeniden başlatıldıktan ve görüntü geldikten sonra güncellenen maske son konumunu korudu mu? e/h");
                       if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                      {
                          console.log("Test Başarılı");
                          await result.write("180", "Test Başarılı",2);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("180", "Test Başarısız",2);
                      }
                      break;
                }
        case "181" : {
                    console.log("Test 181 Başladı.");
                    console.log("Lütfen maskelerin oluşturulmasını bekleyiniz.");
                    for(var i = 5; i<25; i++){                        
                        await nav_dome.toDomeVersion(page, ip);
                        await nav_dome.toWatchCamera(page,ip);
                        await mask.select_mask(page, i);
                        console.log("Maske "+ i + " oluşturuluyor.");
                        await mask.mask_size(page, "10", "10");
                        var is_active = await mask.test_mask_active(page); 
                        if(!is_active) await mask.mask_visible(page);
                        //////APPLY/////
                        await mask.mask_refresh(page);
                        await mask.mask_apply(page);
                        await page.waitFor(5000);
                        await mask.mask_popup(page);
                    }
                    
                    for(var i = 5; i<25; i++){
                        await nav_dome.toDomeVersion(page, ip);
                        await nav_dome.toWatchCamera(page,ip);
                        await mask.select_mask(page, i);
                        console.log("Maske "+ i + " konumlandırılıyor.");
                       for( let j = 0; j<20; j++){                        
                        if(i == 5){
                            await mask.mask_up(page);
                            await page.waitFor(100);
                        }
                        else if(i == 6){
                            await mask.mask_down(page);
                            await page.waitFor(100);
                        }
                        else if(i == 7){
                            await mask.mask_left(page);
                            await page.waitFor(100);
                        }
                        else if(i == 8){
                            await mask.mask_right(page);
                            await page.waitFor(100);
                        }
                        else if(i == 9){
                            await mask.mask_down(page);
                            await page.waitFor(100);
                            await mask.mask_right(page);
                            await page.waitFor(100);
                        }
                      }
                      for( let j = 0; j<30; j++){                        
                        if(i == 10){
                            await mask.mask_up(page);
                            await page.waitFor(100);
                        }
                        else if(i == 11){
                            await mask.mask_down(page);
                            await page.waitFor(100);
                        }
                        else if(i == 12){
                            await mask.mask_left(page);
                            await page.waitFor(100);
                        }
                        else if(i == 13){
                            await mask.mask_right(page);
                            await page.waitFor(100);
                        }
                        else if(i == 14){
                            await mask.mask_down(page);
                            await page.waitFor(100);
                            await mask.mask_right(page);
                            await page.waitFor(100);
                        }
                      }
                        for( let j = 0; j<40; j++){                        
                        if(i == 15){
                            await mask.mask_up(page);
                            await page.waitFor(100);
                        }
                        else if(i == 16){
                            await mask.mask_down(page);
                            await page.waitFor(100);
                        }
                        else if(i == 17){
                            await mask.mask_left(page);
                            await page.waitFor(100);
                        }
                        else if(i == 18){
                            await mask.mask_right(page);
                            await page.waitFor(100);
                        }
                        else if(i == 19){
                            await mask.mask_up(page);
                            await page.waitFor(100);
                        }
                      }
                      for( let j = 0; j<50; j++){                        
                        if(i == 20){
                            await mask.mask_down(page);
                            await page.waitFor(100);
                        }
                        else if(i == 21){
                            await mask.mask_left(page);
                            await page.waitFor(100);
                        }
                        else if(i == 22){
                            await mask.mask_right(page);
                            await page.waitFor(100);
                        }
                        else if(i == 23){
                            await mask.mask_down(page);
                            await page.waitFor(100);
                            await mask.mask_right(page);
                            await page.waitFor(100);
                        }
                        else if(i == 24){
                            await mask.mask_up(page);
                            await page.waitFor(100);
                        }
                       }  
                      }   
                    
                    await mask.mask_refresh(page);
                        console.log("Maskeler oluşturuldu ve konumlandırıldı.");
                        console.log("Lütfen web arayüzünden oluşturulan maskeleri kontrol ediniz.");
                        select1 = await question.ask("8 adet maske tespit edildi mi? e/h");
                        console.log("Lütfen web arayüzünden 'Canlı İzleme' sekmesinde kameranın bakış açısını değiştirerek oluşturulan diğer maskelerin geldiğini gözlemleyerek kontrol ediniz.");
                        select2 = await question.ask("Diğer maskeler tespit edildi mi? e/h");
                        if ( (select1 == "e" || select1 == "E") && (select2 =="e"|| select2=="E"))
                        {
                          console.log("Test Başarılı");
                          await result.write("181", "Test Başarılı",2);  
                      }    
                      else
                      {
                          console.log("Test Başarısız")
                          await result.write("181", "Test Başarısız",2);
                      }
                      break;
                }
        case "182":{
            console.log("");
            console.log("TEY-2_ver06 Test-182 Başladı");
            await nav_dome.toWatchCamera(page,ip);
            await watch_camera.select_mask(page,1);
            await watch_camera.mask_width(page);
            await watch_camera.mask_height(page);
            await watch_camera.check_show(page);
            await watch_camera.mask_apply(page);
            await page.waitFor(2000);
            console.log("Kameraya pan tilt zoom kontrolleri göderip kameranın bakış açısını değiştirin.");
            select4 = await question.ask("Maske kapatmak için konulduğu alanı kapatmaya devam ediyor mu? e/h");
            if(select4=="e"||select4=="E")
            await result.write("182", "BAŞARILI",2);
            else
            await result.write("182", "BAŞARISIZ",2);
            console.log("Test is completed!");
            break;
        }
        case "189":{
            console.log("");
            console.log("TEY-2_ver06 Test-189 Başladı");
            select1 = await question.ask("Bilgisayarınızda eğer test yapılacak kameradan herhangi bir program aracılığı ile görüntü çekiliyorsa( VLC, VMS, DEFNE) bu programı kapatıp Enter tuşuna basınız.");
            await nav_dome.toDomeEncodingHigh(page,ip);
            await page.waitFor(2000);
            await encodingH.traffic_forming(page,"1");
            await encodingH.apply(page);
            await camera_restart(page,ip);
            var command = 'vlc rtsp://admin:admin@'+ip+'/stream1';
            proc =await require('child_process').exec(command);
            console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
            console.log("Wireshark programı çalıştırılır. Kameradan gelen UDP paketlerinden bir tanesi seçilerek mouse'un sağ tuşuna tıklanır ve Decode As seçilir.  Açılan pencereden Current seçeneği RTP olarak seçilir ve OK butonuna tıklanır. Bu işlemden sonra Telephony sekmesinden  RTP --> Stream Analysis seçeneğine tıklanır. Açılan pencerede Forward altında bulunan Lost değerinin %0 oldugu görülerek kayıp olmadığı gözlemlenerek doğrulanır.");
            select1 = await question.ask("Görüntü çekilirken herhangi bir kayıp meydana geliyor mu, kayıp %0 'dan farklı mı? e/h");
            if (select1=="h"||select1=="H")
            await result.write("189", "BAŞARILI",2);
            else
            await result.write("189", "BAŞARISIZ",2);
            break;
        }
        case "190":{
            console.log("");
            console.log("TEY-2_ver06 Test-190 Başladı");
            select1 = await question.ask("Bilgisayarınızda eğer test yapılacak kameradan herhangi bir program aracılığı ile görüntü çekiliyorsa( VLC, VMS, DEFNE) bu programı kapatıp Enter tuşuna basınız.");
            await nav_dome.toDomeEncodingHigh(page,ip);
            await page.waitFor(2000);
            await encodingH.traffic_forming(page,"1");
            await encodingH.apply(page);
            var command = 'vlc rtsp://admin:admin@'+ip+'/stream1';
            proc =await require('child_process').exec(command);
            console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
            console.log("Wireshark programı çalıştırılır. Statistics sekmesinin altından I/O Graph seçeneğien tıklanır. Name altındaki tüm değerler tek tek seçilir ve - butonuna tıklanarak listeden silinir. Liste boşaltıldıktan sonra + butonuna tıklanır ve yeni bir nesne eklenir. Name ve Display Filter seçeneğine RTP ifadesi yazılır. Daha sonra Y Axis değeri Bits ve alt bardaki Interval seçeneği 100ms olarak seçilir. 1 dakika süreyle herhangi bir işlem yapılmadan grafiğin çizilmesi beklenir.");
            select1 = await question.ask("Grafik geçen süre içerisinde çizildi mi? e/h");
            if (select1=="e"||select1=="E")
            await result.write("190", "BAŞARILI",2);
            else
            await result.write("190", "BAŞARISIZ",2);
            break;
        }
        case "191": {//TEST-191
            console.log("");
            await nav_dome.toDomeEncodingHigh(page,ip);
            await page.waitFor(2000);
            await encodingH.traffic_forming(page,"0");
            console.log("TEY-2_ver06 Test-191 Başladı");
            await encodingH.frequency(page,"50");
            await encodingH.precision(page,"Agresif");
            await encodingH.apply(page);
            await camera_restart(page,ip);
            var command = 'vlc rtsp://admin:admin@'+ip+'/stream1';
            proc =await require('child_process').exec(command);
            console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
            console.log("Wireshark programı çalıştırılır. Statistics sekmesinin altından I/O Graph seçeneğien tıklanır.1 dakika süreyle herhangi bir işlem yapılmadan grafiğin çizilmesi beklenir.");
            select1 = await question.ask("Grafik geçen süre içerisinde çizildi mi? e/h");
            if (select1=="e"||select1=="E")
            await result.write("191", "BAŞARILI",2);
            else
            await result.write("191", "BAŞARISIZ",2);
            break;
        }
        case "192":{
            console.log("");
            console.log("TEY-2_ver06 Test-192 Başladı");
            console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
            console.log("TEY-2_ver06 dökümanındaki 190 ve 191 nolu testleri gerçekleştirin. Her iki test için de oluşan grafikleri inceleyin ve aralarındaki farklara bakın. 191 nolu test sonunda oluşan grafiğin bit değerinin 190 nolu test sonucu oluşan grafikteki kadar yüksek olmadığı ve burstlerin limitlendiği gözlemlenerek şekillendiricinin çalıştığı doğrulanır.");
            select1 = await question.ask("Test istenilen sonuçları veriyor mu? e/h");
            if (select1=="e"||select1=="E")
            await result.write("192", "BAŞARILI",2);
            else
            await result.write("192", "BAŞARISIZ",2);
            break;
        }
        case "193": {//TEST-193
            console.log("");
            await nav_dome.toDomeEncodingHigh(page,ip);
            await page.waitFor(2000);
            await encodingH.traffic_forming(page,"0");
            console.log("TEY-2_ver06 Test-193 Başladı");
            await encodingH.frequency(page,"50");
            await encodingH.precision(page,"Orta");
            await encodingH.apply(page);
            await camera_restart(page,ip);
            var command = 'vlc rtsp://admin:admin@'+ip+'/stream1';
            proc =await require('child_process').exec(command);
            console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
            console.log("Wireshark programı çalıştırılır. Statistics sekmesinin altından I/O Graph seçeneğien tıklanır.1 dakika süreyle herhangi bir işlem yapılmadan grafiğin çizilmesi beklenir.");
            select1 = await question.ask("Grafik geçen süre içerisinde çizildi mi? e/h");
            if (select1=="e"||select1=="E")
            await result.write("193", "BAŞARILI",2);
            else
            await result.write("193", "BAŞARISIZ",2);
            break;
        }
        case "194":{
            console.log("");
            console.log("TEY-2_ver06 Test-194 Başladı");
            console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
            console.log("TEY-2_ver06 dökümanındaki 190,191 ve 193 nolu testleri gerçekleştirin.3 test için de oluşan grafikleri inceleyin ve aralarındaki farklara bakın. 193 nolu test sonunda oluşan grafiğin bit değerinin 191 nolu test sonucu oluşan grafiğe göre biraz daha yükseldiği yani toleransın arttırıldığı ve hala 190 nolu test sonucu oluşan grafiğe göre düşük değerler geldiği grafikler gözlemlenerek doğrulanır.");
            select1 = await question.ask("Test istenilen sonuçları veriyor mu? e/h");
            if (select1=="e"||select1=="E")
            await result.write("194", "BAŞARILI",2);
            else
            await result.write("194", "BAŞARISIZ",2);
            break;
        }
        case "195": {//TEST-195
            console.log("");
            await nav_dome.toDomeEncodingHigh(page,ip);
            await page.waitFor(2000);
            await encodingH.traffic_forming(page,"0");
            console.log("TEY-2_ver06 Test-195 Başladı");
            await encodingH.frequency(page,"50");
            await encodingH.precision(page,"Hafif");
            await encodingH.apply(page);
            await camera_restart(page,ip);
            var command = 'vlc rtsp://admin:admin@'+ip+'/stream1';
            proc =await require('child_process').exec(command);
            console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
            console.log("Wireshark programı çalıştırılır. Statistics sekmesinin altından I/O Graph seçeneğien tıklanır.1 dakika süreyle herhangi bir işlem yapılmadan grafiğin çizilmesi beklenir.");
            select1 = await question.ask("Grafik geçen süre içerisinde çizildi mi? e/h");
            if (select1=="e"||select1=="E")
            await result.write("195", "BAŞARILI",2);
            else
            await result.write("195", "BAŞARISIZ",2);
            break;
        }
        case "196":{
            console.log("");
            console.log("TEY-2_ver06 Test-196 Başladı");
            console.log("Lütfen aşağıdaki testi uygulayın.. Ardından otomatik test yazılımını tekrardan başlatın ve test sonuçlarını otomatik test yazılımına bildirmek için bu testin numarasını tuşlayın");
            console.log("TEY-2_ver06 dökümanındaki 190,191,193 ve 95 nolu testleri gerçekleştirin.4 test için de oluşan grafikleri inceleyin ve aralarındaki farklara bakın. 195 nolu test sonunda oluşan grafiğin bit değerinin 191 ve 193 nolu testler sonucu oluşan grafiklere göre biraz daha yükseldiği yani toleransın arttırıldığı gözlemlenerek doğrulanır.");
            select1 = await question.ask("Test istenilen sonuçları veriyor mu? e/h");
            if (select1=="e"||select1=="E")
            await result.write("196", "BAŞARILI",2);
            else
            await result.write("196", "BAŞARISIZ",2);
            break;
        }
        default: await console.log("Test "+test_number+" blunamadı lütfen tekrar deneyin..");
    }
}
}());