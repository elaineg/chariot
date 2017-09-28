// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/chariot'); // connect to our database

var mongodbUri = 'mongodb://chariotbeta:sh9YXR58berseukW@ds137729.mlab.com:37729/chariot';
mongoose.connect(mongodbUri);

var dbConnection = mongoose.connection;
dbConnection.on('error', console.error.bind(console, 'connection error:'));
dbConnection.once('open', function() {
    console.log('connected to mongoDB');
});

var User = require('./db/user');
var Ride = require('./db/ride');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const path = require('path');

var port = process.env.PORT || 3001; // set our port
app.use(express.static(path.join(__dirname, 'chariot', 'build')));

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:3001/api)
router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

// more routes for our API will happen here

// on routes that end in /users
// ----------------------------------------------------
router.route('/users').post(function(req, res) {

    var user = new User();
    user.userID = req.body.userID;
    user.savedRides = [];

    // save the user and check for errors
    user.save(function(err) {
        if (err)
            res.send(err);
        res.json({
            message: 'User created!'
        });
    });

}).get(function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
});
router.route('/users/:user_id').get(function(req, res) {
    User.find({userID: req.params.user_id}, function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
}).put(function(req, res) {

    User.findById(req.params.user_id, function(err, user) {

        if (err)
            res.send(err);

        // if savedRides[] contains the id, pull() else, push()
        user.savedRides.push(req.body.ride);

        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Ride saved!'
            });
        });

    });
}).delete(function(req, res) {
    User.remove({
        _id: req.params.user_id
    }, function(err, user) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});

router.route('/user-save/:user_id/:saved_id').put(function(req, res) {
  User.find({
    userID: req.params.user_id
  }, function(err, user) {

        if (err)
            res.send(err);
        user[0].savedRides.push(req.params.saved_id);
        user[0].save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Saved ride added!'
            });
        });

    });
}).delete(function(req, res) {
  User.find({
    userID: req.params.user_id
  }, function(err, user) {
      if (err)
          res.send(err);

      user[0].savedRides.pull(req.params.saved_id);

      user[0].save(function(err) {
          if (err)
              res.send(err);

          res.json({
              message: 'Saved ride removed!'
          });
      });

  });
});

// on routes that end in /ride
// ----------------------------------------------------
router.route('/rides').post(function(req, res) {

    var ride = new Ride();
    ride.userID = req.body.userID;
    ride.rideTo = req.body.rideTo;
    ride.rideFrom = req.body.rideFrom;
    ride.date = req.body.date;
    ride.cost = req.body.cost;
    ride.about = req.body.about;
    ride.posted = req.body.posted;

    // save the user and check for errors
    ride.save(function(err) {
        if (err)
            res.send(err);
        res.json({
            message: 'Ride created!'
        });
    });

}).get(function(req, res) {
    Ride.find(function(err, rides) {
        if (err)
            res.send(err);
        res.json(rides);
    });
});
router.route('/rides/:from/:to').get(function(req, res) {
    Ride.find({
      rideFrom: req.params.from,
      rideTo: req.params.to,
      posted: true
    }, function(err, ride) {
        if (err)
            res.send(err);
        res.json(ride);
    });
});
router.route('/rides-user/:userID').get(function(req, res) {
    Ride.find({
      userID: req.params.userID
    }, function(err, ride) {
        if (err)
            res.send(err);
        res.json(ride);
    });
});
router.route('/rides/:id').get(function(req, res) {
    // console.log(req.params.id);
    Ride.find({
      _id: req.params.id
    }, function(err, ride) {
        // console.log(ride);
        if (err)
            res.send(err);
        res.json(ride);
    });
});
router.route('/rides-id-user/:id/:userID').get(function(req, res) {
    Ride.find({
      _id: req.params.id,
      userID: req.params.userID
    }, function(err, ride) {
        if (err)
            res.send(err);
        res.json(ride);
    });
}).put(function(req, res) {

    Ride.findById(req.params.id, function(err, ride) {

        if (err)
            res.send(err);

        // ride.name = req.body.name;

        ride.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Ride updated!'
            });
        });

    });
}).delete(function(req, res) {
    Ride.remove({
        _id: req.params.id
    }, function(err, ride) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});

router.route('/rides-delete/:id').delete(function(req, res) {
  Ride.findById(req.params.id, function(err, ride) {
      if (err)
          res.send(err);
      ride.posted = false;
      ride.save(function(err) {
          if (err)
              res.send(err);

          res.json({
              message: 'Ride Deleted!'
          });
      });

  });
});



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// send all requests to index.html so browserHistory in React Router works
app.get('*', function (req, res) {
  // res.sendFile(path.join(__dirname, 'chariot', 'build', 'index.html'))
  res.redirect('/#' + req.originalUrl);
})

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Database server on ' + port);
