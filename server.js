var express = require("express"),
    app = express(),
    hasher = require("./modules/hash-generator"),
    mongo = require("mongodb").MongoClient;
    
app.get(/^\/((http|https):\/\/)?www\..+\..+$/, function(req, res){
    mongo.connect('mongodb://localhost:27017/shortcuturl', function(err, db){
        if(err) throw err;
        var hash = hasher.generate();
        
        /*
        * ---------------------------
        * Checks for an existing hash, if one is
        * found it recursivley calls itself until a unique hash is found
        * and then inserts it into the database.
        * ===========================
        * @params: db : the current instance of the database.
        * ---------------------------
        */
        function insertHash(db) {
            db.collection('url').count({ 'hash': hash }, function(err, count){
                if(err) throw err;
                if(count === 0) {
                    db.collection('url').insert({ 'hash': hash, 'link': 'http://www.google.com' }, function(){
                        if(err) throw err;
                        console.log('hash inserted');  
                        db.close();
                        res.end('added url');
                    })
                } else {
                    insertHash(db)
                }
            });
        };
        insertHash(db);
    });
});

app.get('*', function(req, res){
    res.end('url could not be found');
});

app.listen(8080);