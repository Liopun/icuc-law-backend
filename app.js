const express       = require('express'),
      bodyParser    = require('body-parser'),
      passport      = require('passport'),
      cors          = require('cors'),
      cookieParser  = require('cookie-parser'),
      keys        = require('config')

const authRouter    = require('./routes/api/auth'),
      clientsRouter = require('./routes/api/clients');


const db = require('./utils/db');

require('./utils/jwt-middleware');

const app = express();

db.connectDB();

app.use(cors({origin: '*'}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(keys.get('secretOrKey')));

app.use(passport.initialize());

// app.use('/api/', indexRouter)
app.use('/api/auth', authRouter);
app.use('/api/clients', clientsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).json('Page Not Found');
});

module.exports = app;