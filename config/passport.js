var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var gravatar = require('gravatar');    
var _ = require("underscore");    
    
var verifyHandler = function (token, tokenSecret, profile, done) {
    process.nextTick(function () {

        User.findOne({ email: _.pluck(profile.emails, 'value') }).done(function (err, user) {
            if (user) {
            	/*var picture;
            	//TODO
            
                if(profile._json.picture && profile._json.picture.data) {
                	picture = profile._json.picture.data.url;
                } else if (profile._json.picture) {
                	picture = profile._json.picture;
                } else {
                	picture = gravatar.url(data.email);
                }
                
                user.save({ picture : picture });*/
            	
                return done(null, user);
            } else {

                var data = {
                	email: profile.emails[0].value,
                    name: profile.displayName
                };

                if(profile._json.picture && profile._json.picture.data) {
                	data.picture = profile._json.picture.data.url;
                } else if (profile._json.picture) {
                	data.picture = profile._json.picture;
                } else {
                	data.picture = gravatar.url(data.email);
                }
                
                User.create(data).done(function (err, user) {
                    return done(err, user);
                });
            }
        });
    });
};

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findOne({id: id}).done(function (err, user) {
        done(err, user)
    });
});


module.exports = {

    // Init custom express middleware
    express: {
        customMiddleware: function (app) {

            passport.use(new FacebookStrategy({
                    clientID: "485905004858134",
                    clientSecret: "42aa628df64300147b845b94e1f9fe99",
                    callbackURL: "http://localhost:1337/auth/facebook/callback",
                    profileFields: ["picture", "id", "displayName", "link" ,"email"]
                },
                verifyHandler
            ));

            passport.use(new GoogleStrategy({
                    clientID: '319700997687.apps.googleusercontent.com',
                    clientSecret: '0bSGvKf7AuLX28BMClx9_9gM',
                    callbackURL: 'http://localhost:1337/auth/google/callback'
                },
                verifyHandler
            ));

            app.use(passport.initialize());
            app.use(passport.session());
        }
    }

};