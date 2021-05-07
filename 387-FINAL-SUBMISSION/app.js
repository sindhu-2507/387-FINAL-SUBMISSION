const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// const regRo = require('./routes/register');
// const adminRo = require('./routes/admin');
const prodsRo = require('./routes/recommend');
const homeRo = require('./routes/home');
const recommendationsRo = require('./routes/recommendations');
const viewRo = require('./routes/viewdetail');
const wgRo = require('./routes/watching');
const wlRo = require('./routes/watchlist');
const pool =  require('./utils/database');
const profileRo = require('./routes/profile');
const friendsRo = require('./routes/friends');
const friendrequestRo = require('./routes/friend_request');
const logRo = require('./routes/login');
const regRo = require('./routes/register');
const recomfriendRo = require('./routes/recomfriend');
// const logoutRo = require('./routes/logout');
const searchedfriendRo = require('./routes/searched_friend');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/register',regRo);
// app.use('/friends',adminRo);
app.use('/recommend',prodsRo);
app.use('/home',homeRo);
app.use('/watching',wgRo);
app.use('/watchlist',wlRo);
app.use('/viewdetail',viewRo);
app.use('/friends',friendsRo);
app.use('/profile',profileRo);
app.use('/login',logRo);
app.use('/register',regRo);
app.use('/searched_friend',searchedfriendRo);
app.use('/recommendations',recommendationsRo);
app.use('/recomfriend',recomfriendRo);
// app.use('/logout',logoutRo);
app.use('/friend_request',friendrequestRo);
// app.use('/cart',cartRo);


app.listen(3000);