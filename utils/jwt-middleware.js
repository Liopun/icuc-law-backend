const passport      = require('passport'),
      bcrypt        = require('bcrypt'),
      mongoose      = require('mongoose'),
      JwtStrategy   = require('passport-jwt').Strategy,
      ExtractJwt    = require('passport-jwt').ExtractJwt;

const keys          = require('config'),
      Auth          = require('../models/auth-model');

var options = {};
options.jwtFromRequest = (req) => req.signedCookies['jwtToken'] || req.cookies.jwtToken;
options.secretOrKey = keys.get('secretOrKey');

passport.use(new JwtStrategy(options, async (jwtPayLoad, done) => {
    try {
        let user = await Auth.findById(jwtPayLoad.sub ? jwtPayLoad.sub : jwtPayLoad.id);

        if(!user) return done(null, false); 

        if(Date.now() > jwtPayLoad.expires) return done('jwt expired.');

        return done(null, jwtPayLoad);
    } catch (err) {
        return done(null, false);
    }
}));