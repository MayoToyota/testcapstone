const express = require('./node_modules/express');
const Router = require('./routes');
const path = require('path');
const createError = require('./node_modules/http-errors');
const cookieParser = require('./node_modules/cookie-parser');
const logger = require('./node_modules/morgan');

const db = require('./db');
const hbs = require('express-handlebars');
const passport = require('passport/lib');
const session = require('./node_modules/express-session');
const flash = require('connect-flash');
const GithubStrategy = require('./node_modules/passport-github2/lib').Strategy
const User = require('./db').User

const app = express();

app.use(cookieParser());

app.use(logger('dev'));
app.use(express.urlencoded());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    helpers: {
        currency: function(amount) {
            return amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            });
        },
    }
}));
app.use(flash());
app.use(session({
    secret: 'keyboad cat'
}));
app.use(passport.initialize()); 
app.use(passport.session());
passport.use(db.User.createStrategy());
passport.use(new GithubStrategy({
    clientID: '343565be4337d7979e61',
    clientSecret: 'c1f466f1e4277191671155d56d2cca8f6608cea5',
    callbackURL: 'http://localhost:3000/auth/callback'
},
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        User.findOrCreate({ where: { username: profile.username } })
            .then(([user, created]) => {
                done(null, user);

            })
            .catch(err => {
                done(err, null);
            });
    }
));
passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());


app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/lib/axios/', express.static(path.join(__dirname, 'node_modules', 'axios', 'dist')));

app.use(Router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
app.listen(process.env.PORT || '3000', () => {
    console.log('Listening');
});
