module.exports.generate = function() {
    var hash = [];
    
    for(var i = 0; i < 5; i++) { hash[i] = Math.floor(Math.random() * 62) + 1; }   
    
    hash = hash.map(x=>/^((1\d)|(2[0-6])|([1-9]))$/.test(x) ? 
                    String.fromCharCode(x+64) : /^((2[7-9])|([3-4]\d)|(5[0-2]))$/.test(x) ? 
                    String.fromCharCode(x+70) : 62-x);
                    
    hash[5] = new Date().getSeconds();
    
    return hash.join('');
}