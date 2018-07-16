(function() { 
  
    module.exports.ask = async function(question_sentence) {
 
 var readline = require('readline-sync');

var answer = readline.question(question_sentence);

return(answer);
     
        
}

}());