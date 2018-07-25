const fs = require('fs');
const child_process = require("child_process");
const file_exist= require("./file_exist");


(function() {
       
    module.exports.write = async function(test_num, string,document_no)
        {
            var command = "echo Test No:" +test_num + "....."  +  string + " >>sonuc.txt";
            child_process.execSync(command);
            await file_exist.excel_file(parseInt(test_num), string,document_no);
        }
        
}());
