  (function() {

        const NTP_SERVER1_SELECTOR_UP = 'body > div > div:nth-child(3) > div.col-md-8 > div.view-container > div > form > div:nth-child(3) > div > div';
	
               
	module.exports.test_ntp_server1 = async function(page , set) 
        {
                        const input = await page.$(NTP_SERVER1_SELECTOR_UP);
                        const inpot = await input.$eval('.form-control' , node => node.value);
                        console.log("NTP Server1 IP");
                        console.log(inpot);
                        console.log("");
                        if(inpot == set)
                        {
                            console.log("NTP Server1 IP is TRUE");
                        }
                        else
                        {
                            console.log("NTP Server1 IP is FALSE");
                        }
                        
                        return inpot;
            
	}
	
	
    
}());


 

 
