const fs = require('fs');
const child_process = require("child_process");

(function() {
       
    module.exports.write =  function(test_num, string)
        {
            var command = "echo Test No:" +test_num + "....."  +  string + " >>sonuc.txt";
            child_process.execSync(command);
            
        }
        
}());
