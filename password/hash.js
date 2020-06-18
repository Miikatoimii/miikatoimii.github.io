password = {
    
    hash: function(pwd, salt, characters){
        return new Promise((res, rej)=> {
            var hChars = characters;
            var nwChars = '';
            var v = 0;
            if(salt == null || salt == undefined){
                err = {
                    type: 'SALT ERROR',
                    msg: 'Salt must be defined.',
                    errID: 3
                }
                rej(err)
            }
            for(var i = 0; i < pwd.length; i++){
                for(var b = 0; b < hChars.length; b++){
                    pw = pwd[i];
                    hw = hChars[b];
                    if(pw == hw){
                        aa = hChars.slice(b, hChars.length);
                        bb = hChars.slice(0, b);
                        hChars = aa+bb;
                        x0 = hChars.slice(salt+v, salt+v+1);
                        x1 = hChars.slice(v+1, v+2);
                        nwChars += x0+x1;
                        v++;
                    }
                }
            }
            
            if(nwChars.length < 60){
                loopNumber = 60 - nwChars.length;
                var nHH = nwChars.length-1;
                var newcharacters = hChars.slice(nHH, hChars.length)+hChars.slice(0, nHH);
                for(var i = 0; i < loopNumber; i++){
                    aa = newcharacters.slice(salt+i, newcharacters.length)
                    bb = newcharacters.slice(0, salt+i);
                    newcharacters = aa+bb;
                    nwChars+=newcharacters[0];
                }
            }
            res(nwChars);
        }).then(pw =>{
            return pw;
        }).catch(err => {
            return err;
        })
    }
}