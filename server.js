var express = require("express"),
    app = express(),
    hasher = require("./modules/hash-generator"),
    mongo = require("mongodb").MongoClient;
   
app.get(/^\/[A-Za-z\d]{7}$/, function(req, res){
    mongo.connect('mongodb://localhost:27017/shortcuturl', function(err, db){
        if(err) throw err;
        db.collection('url').findOne({ 'hash': req.url.toString().slice(1) }, function(err, doc){
            if(err) throw err;
            db.close();
            if(doc) {
                /^((http)|(https)).+$/.test(doc.url)
                    ? res.writeHead(308, {'location': doc.url})
                    : res.writeHead(308, {'location': 'http://' + doc.url});
                
                res.end();
                
            } else {
                res.end('shortcut url not found');
            }
        });
    });
});
    
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
                    var url = req.url.toString().slice(1)
                    db.collection('url').insert({ 'hash': hash, 'url': url }, function(){
                        if(err) throw err;
                        db.close();
                        var resJson = {
                            'original_url': url,
                            'short_url': 'https://npm-labriffa.c9users.io/' + hash
                        }
                        res.end(JSON.stringify(resJson));
                    })
                } else {
                    insertHash(db)
                }
            });
        };
        insertHash(db);
    });
});

app.get('/*', function(req, res){
    res.end('url could not be found');
});

app.listen(8080);