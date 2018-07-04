const fs = require('fs');
const child_process = require("child_process");

(function() {
       
    module.exports.record =  function(ip,stream,test_num)
        {
            try {
            console.log(ip);
            var command = "ffmpeg -y -i rtsp://admin:admin@"+ip+"/"+stream+" -acodec copy -t 00:00:05 -vcodec copy "+test_num+".mp4";
            child_process.execSync(command);
            } catch(err){console.log("Bağlantı Hatası"); return 0; }
                
            }
        
    module.exports.create_json = function(ip,stream,test_num)
        {
            var command = "ffprobe -v quiet -print_format json -show_entries stream=avg_frame_rate -show_format -show_streams "+test_num+".mp4 > "+"specs_test"+test_num+".json"+" 2>&1";
            child_process.execSync(command);     
        }
        
    module.exports.write = function(command)
        {
           var buffer = child_process.execSync(command);
           return buffer.toString();
        }
       
    module.exports.read_specs = function(setting,test_num)
        {   
            var json_name = "specs_test"+test_num+".json";
            var contents = fs.readFileSync(json_name);  
            var jsonContent = JSON.parse(contents);
            var ffmpeg_spec = jsonContent["streams"][0][setting];
            return ffmpeg_spec;
        }    
}());



 
