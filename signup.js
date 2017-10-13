module.exports = {
    signup: function(MongoClient, dburl, req, res) {
        MongoClient.connect(dburl, function(err, db) {
            var response = {}
            db.collection('users', function(err, collection) {
                var users = collection;
                req.checkBody('username', 'name field is required').notEmpty();
                req.checkBody('email', 'email field is required').notEmpty();
                req.checkBody('email', 'email field is not valid').isEmail();
                req.checkBody('password', 'password field is required').notEmpty();
                req.checkBody('passwordconfirm', 'passwords dont match').equals(req.body.password);
                req.checkBody('phone', 'phone field is required').notEmpty();
                users.insertOne({
                    username: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    passwordconfirm: req.body.confirmpassword,
                    phone: req.body.phone
                }, function() {
                    res.end('ok')
                    db.close()

                })
            })



        })
    }
}