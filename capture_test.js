const fs = require('fs');
const child_process = require("child_process");

(function() {
       
    module.exports.record =  function(url,stream,test_num)
        {
            var command = "ffmpeg -y -i rtsp://"+url+"/"+stream+" -acodec copy -t 00:00:05 -vcodec copy "+test_num+".mp4";
            child_process.execSync(command);
        }
        
    module.exports.create_json = function(url,stream,test_num)
        {
            var command = "ffprobe -v error -print_format json -show_entries stream=avg_frame_rate -show_format -show_streams "+test_num+".mp4 > "+"specs_test"+test_num+".json"+" 2>&1";
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



 
