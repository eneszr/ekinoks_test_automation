var tcpp = require('tcp-ping');
var return_value;

module.exports.ping = async function(page,ip)
{
   tcpp.probe(ip, 8080, function(err, available) {
    return_value = available;
}); 
 while(return_value === undefined)
 await page.waitFor(100);
 return return_value;
}