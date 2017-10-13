module.exports = {
    addcourse: function(MongoClient, dburl, req, res) {
        MongoClient.connect(dburl, function(err, db) {
            db.collection('courses', function(err, collection) {
                var courses = collection;
                courses.insertOne({
                    name: req.body.name,
                    description: req.body.description,
                    instructor: req.body.instructor,
                    timeperiod: req.body.timeperiod,
                    from: req.body.from,
                    to: req.body.to,
                    price: req.body.price,
                    certifcate: req.body.certifcate,
                    img: req.body.img

                }, function() {
                    res.end('ok');
                    db.close();
                })
            })
        })
    }
}