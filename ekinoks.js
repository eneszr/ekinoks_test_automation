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
var capture_test = require('./capture_test');
const fs = require('fs');
const path = require('path');
var tests = require('./tests');
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
            await tests.start_1(page,test_number);
        
        else if(document == 2)
            await tests.start_2(page,test_number);
        
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

   /* await capture_test.record("10.5.177.47","stream1","1");
    sonuc = await capture_test.create_json("10.5.177.47","stream1","1");
    console.log(capture_test.read_specs("width","1"));
    */
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	await login.loginCamera(page, 'http://10.5.177.47:8080');

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
  
  
  
        await page.waitFor(3000);
	await page.close();
	await browser.close();
  
	return 0;
}

testIt().then((value) => {
	console.log("Testing done " + 1); // Success!
});

