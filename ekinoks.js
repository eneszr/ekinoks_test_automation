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
var mask = require('./mask');
var page;
var browser;
////
var login_dome = require("./login_dome");

var select_cam;
 
 
async function interface (page)
{
        test_number = await question.ask("HANGİ TESTİ YAPMAK İSTİYORSUNUZ?...................Çıkış İçin C ye basabilirsiniz");
        console.clear();
        if (test_number == "c" || test_number == "C")
        { 
            console.log("Çıkış yapılıyor..");  
            return;
        }
        
       if (select_cam == 1)
            await tests.start_1(page,test_number,ip);
        
        else if(select_cam == 2)
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
   ip = await question.ask("Test edilecek kameranın ip adresini girin:  ");
   
  
    select_cam_type = await question.ask("Kamera tipini seçin Sabit Kamera => 1 DOM => 2  ");
   
    if(select_cam_type == 1)
    {
        browser = await puppeteer.launch({headless: false});
        page = await browser.newPage();
        await login.loginCamera(page, ip);
        select_cam = 1;
    }
    else if(select_cam_type == 2)
    {
        browser = await puppeteer.launch({headless: false});
        page = await browser.newPage();
        await login_dome.loginCamera(page, ip);
        select_cam = 2;
    }
    else
    {
        console.log("Hatalı tuşladınız. Lütfen tekrar deneyin..");
        await testIt();
    }

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
        else {console.log("Hatalı Tuşlama Yaptınız. Çıkmak İçin C Tuşuna Basabilirsiniz. Test Aşamasına Geçildi..");
        await interface(page);}
 // await tests.start_2(page,"125",ip);
        return select_cam;
        await page.waitFor(30000);
        await page.close();
        await browser.close();
       // return 0;
}

testIt().then((value) => {
	console.log("Testing done " + 1); // Success!
});




	
	
	
	
	


