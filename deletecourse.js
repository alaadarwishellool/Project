module.exports = {
    deletecourse: function(MongoClient, dburl, req, res, mongodb) {

        MongoClient.connect(dburl, function(err, db) {
            if (err) {
                throw err;
            }
            db.collection("courses", function(err, collection) {
                var courses = collection;
                courses.deleteOne({ name: req.body.name }, function() {
                    db.close();
                    res.redirect('/courses');
                })
            });

        });
    }
}