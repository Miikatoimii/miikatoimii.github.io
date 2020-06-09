
var array1 = [1,2,1,2,3,3,4];
var array2 = [2,1,3,5,3,2];
var array3 = [1,2,3,4,5,6];

function firstDuplicateCharacter(array){
    var hashSet = {};
    //loop through the array
    for(var i=0; i<array.length; i++){
        // check if the item exists in the hashSet object
        if(hashSet[array[i]] == undefined){
            // if not insert the item
            hashSet[array[i]] = false;
        } else {
            // if yes return the value
            hashSet[array[i]] = true;
            return array[i]
        }
    } 
    return "no duplicate character.";
}


function firstDuplicateCharacter2(array){
    for(var i=0; i<array.length; i++){
        char1 = array[i];
        for(var b=0; b<array.length; b++){
            char2 = array[b];
            if(i != b){
                if(char1 == char2)
                    return char1;
            }
        }
    }
}

/* SORTING */
function firstDuplicateCharacter3(array){
    var arr = array.sort((a, b) => a-b)
    for(var i=0; i<array.length; i++){
        if(arr[i] == arr[i+1])
            return arr[i]
    }
    return null;
}