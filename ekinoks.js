 const puppeteer = require('puppeteer');
var ip = '0.0.0.0'; 
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
var capture_test = require('./capture_test');
const fs = require('fs');
const path = require('path');
var tests = require('./tests');
var page;
var browser;
////
var login_dome = require("./login_dome");


 
 
async function interface (page)
{
        document = await question.ask("Yapacağınız Test Hangi Dökümanda?            ..Çıkış İçin C ye basabilirsiniz");
        console.clear();
        if (document == "c" || document == "C") 
        {
            console.log("Çıkış yapılıyor..");  
            return;
            
        }
        test_number = await question.ask("HANGİ TESTİ YAPMAK İSTİYORSUNUZ?             ..Çıkış İçin C ye basabilirsiniz");
        console.clear();
        if (test_number == "c" || test_number == "C")
        { 
            console.log("Çıkış yapılıyor..");  
            return;
            
        }
        
        if (document == 1)
            await tests.start_1(page,test_number,ip);
        
        else if(document == 2)
            await tests.start_2(page,test_number,ip);
        
        else if (document == "c" || document == "C") 
        { 
            console.log("Çıkış yapılıyor..");  
            return;
            
        }
        
        else
            console.log("Hatalı döküman tuşladınız Lütfen tekrar deneyin..");
            await interface(page);
}    
let testIt = async () => {

 
  
   ip = '10.5.176.249'//await question.ask("Test edilecek kameranın ip adresini girin");
   url = 'http://'+ ip + ':8080';
   dom_url = 'http://10.5.177.164:8080';
   dom_ip = '10.5.177.164';
   select_cam_type = await question.ask("Kamera tipini seçin Sabit Kamera => 1 DOM => 2");
	
   if(select_cam_type == 1)
        {
         browser = await puppeteer.launch({headless: false});
	 page = await browser.newPage();
        await login.loginCamera(page, url);
        }
    else if(select_cam_type == 2)
        {
         browser = await puppeteer.launch({headless: false, args: ['--start-fullscreen']});
	 page = await browser.newPage();
        await login_dome.loginCamera(page, dom_url);
        }
    else
        {
            console.log("Hatalı tuşladınız. Lütfen tekrar deneyin..");
            await testIt();
        }
/*
 select = await question.ask("Test Yapmak İçin T'ye Çıkış için C ye basınz");
        console.clear();
        if (select == "c" || select == "C") 
        {
            console.log("Çıkış yapılıyor.."); 
            await page.waitFor(3000); 
            browser.close(); 
            return;
            
        }
        else if (select == "t" || select== "T") await interface(page);
        else {console.log("Hatalı Tuşladınız Çıkmak İçin C ye basabilirsiniz. Test seçme aşamasına geçildi..");
        await interface(page);}
  */
  await tests.start_2(page,"125",dom_ip);
  
        await page.waitFor(30000);
	await page.close();
	await browser.close();
  
	return 0;
}

testIt().then((value) => {
	console.log("Testing done " + 1); // Success!
});




	
	
	
	
	


