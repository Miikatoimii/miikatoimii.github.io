// 1. get the first non repeating character

var str1  = 'aaabcccdeeef';
var str2 = 'abcbad';
var str3 = 'abcabcabc';

function firstNonRepeatingCharacter(string){
    for(var i = 0; i < string.length; i++){
        c1 = string.slice(i, i+1);
        match = false;
        for(var b=0; b<string.length; b++){
            c2 = string.slice(b, b+1);
            if(i != b){
                if(c1 == c2){
                    match = true;
                    break;
                }
            }
        }
        if(match == false){
            return c1;
        }
    }
    return "no non repeating characters";
}
console.log(firstNonRepeatingCharacter(str2))