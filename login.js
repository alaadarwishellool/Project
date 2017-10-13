module.exports = {
    login: function(MongoClient, req, res, dburl) {
        MongoClient.connect(dburl, function(err, db) {
            var response = {}

            if (!err) {
                db.collection('users').findOne({
                    email: req.body.email,
                    password: req.body.password
                }, function(err, user) {
                    if (!err) {
                        if (user) {
                            user.accesstoken = req.cookies.accesstoken;

                            db.collection('users').updateOne({
                                email: req.body.email,
                                password: req.body.password
                            }, user, function(err, result) {
                                response.user = user
                                res.end(JSON.stringify(response))
                            })

                        } else {
                            response.error = 'User Not Exists'
                            res.end(JSON.stringify(response))
                        }

                    } else {
                        response.error = err.message
                        res.end(JSON.stringify(response))
                    }
                })
            } else {
                response.error = err.message
                res.end(JSON.stringify(response))
            }
        })
    }
}