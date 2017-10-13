module.exports = {
    chat: function(req, res, MongoClient, dburl) {
        if (req.query.name) {
            MongoClient.connect(dburl, function(err, db) {
                db.collection('users', function(err, collection) {
                    var members = collection;
                    members.find({ "name": req.query.name }).toArray(function(err, arr) {
                        res.end(JSON.stringify(arr))
                        db.close()
                    })
                })
            })
        } else {
            MongoClient.connect(dburl, function(err, db) {
                db.collection('users', function(err, collection) {
                    var members = collection;
                    members.find({}).toArray(function(err, arr) {
                        res.end(JSON.stringify(arr))
                        db.close()
                    })
                })
            })
        }
    }
}