var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var url = require('url');
var formidable = require('formidable');
var mv = require('mv');
var socket = require('socket.io');

var session = require('express-session');
var passport = require('passport');
var localstratgy = require('passport-local').Strategy;
var expressValidator = require('express-validator');

/*var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBfze1M5a3MgR5b_kxmtCZCWPvQyfOWROQ'
});
googleMapsClient.geocode({
    address: '30.066381, 31.342515'
}, function(err, response) {
    if (!err) {
        console.log(response.json.results);
    }
});*/

var login = require('./login.js');
var signup = require('./signup.js');
var addcourse = require('./addcourse.js');
var chat = require('./chat.js');
var courses = require('./courses.js');
var deletecourse = require('./deletecourse.js');

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://alaa:qaz@127.0.0.1:27017/proacadmy';
app.use(express.static('site_files'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

//handle validator 
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formparam = root;

        while (namespace.length) {
            formparam += '[' + namespace.shift() + ']';
        }
        return {
            param: formparam,
            msg: msg,
            value: value
        }
    }
}))


app.get('/', function(req, res) {
    if (!req.cookies.accesstoken) {
        res.cookie('accesstoken', new Date().getTime())
        fs.readFile('./site_files/html/index.html', function(err, content) {
            res.writeHead(200, {
                'content-type': 'text/html'
            })
            res.end(content)
        })
    } else {
        MongoClient.connect(dburl, function(err, db) {
            var response = {}

            if (!err) {
                db.collection('users').findOne({
                    accesstoken: req.cookies.accesstoken
                }, function(err, user) {
                    if (!err) {
                        if (user) {

                            fs.readFile('./site_files/html/index_admin.html', function(err, content) {
                                res.writeHead(200, {
                                    'content-type': 'text/html'
                                })
                                res.end(content)
                            })

                        } else {
                            fs.readFile('./site_files/html/index.html', function(err, content) {
                                res.writeHead(200, {
                                    'content-type': 'text/html'
                                })
                                res.end(content)
                            })
                        }

                    } else {
                        fs.readFile('./site_files/html/index.html', function(err, content) {
                            res.writeHead(200, {
                                'content-type': 'text/html'
                            })
                            res.end(content)
                        })
                    }
                })
            } else {
                fs.readFile('./site_files/html/index.html', function(err, content) {
                    res.writeHead(200, {
                        'content-type': 'text/html'
                    })
                    res.end(content)
                })
            }
        })
    }
})
app.post('/fileupload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var oldpath = files.filetoupload.path;
        var newpath = __dirname + '/site_files/images/' + files.filetoupload.name;
        mv(oldpath, newpath, function(err) {
            if (err) throw err;
            res.write(files.filetoupload.name);
            res.end();
        });
    })
})
app.get('/deletesession', function(req, res) {
    res.clearCookie('accesstoken')
    res.redirect('/')
})
app.get('/chat', function(req, res) {
    fs.readFile(__dirname + '/site_files/html/chat.html', function(err, content) {
        res.end(content)
    })
})
app.post('/api/login', function(req, res) {
    login.login(MongoClient, req, res, dburl);
})
app.put('/api/signup', function(req, res) {
    signup.signup(MongoClient, dburl, req, res);
});
app.put('/api/addcourse', function(req, res) {
    addcourse.addcourse(MongoClient, dburl, req, res);
});
app.get('/courses', function(req, res) {
    fs.readFile(__dirname + '/site_files/html/courses.html', function(err, content) {
        res.end(content);
    })
})
app.get('/api/courses', function(req, res) {
    courses.courses(req, res, MongoClient, dburl)
});
app.get('/delete', function(req, res) {
    deletecourse.deletecourse(MongoClient, dburl, req, res);
});

app.get('/api/chat', function(req, res) {
    chat.chat(MongoClient, dburl, req, res)
});

var io = socket(app.listen(6060, function() {
    console.log('Example app listening on port 6060!')
}))

io.on('connection', function(socket) {
    console.log('user connected : ' + socket.id);
    socket.on('disconnect', function() {
        console.log('user disconnected : ' + socket.id);
    });
    socket.on('chat message', function(obj) {
        io.emit('chat message', '<b>' + obj.userName + '</b> : ' + obj.message);
    });
    socket.on('typing', function(obj) {
        socket.broadcast.emit('typing', '<em>' + obj.userName + ' is typing message ... </em>');
    });
});;