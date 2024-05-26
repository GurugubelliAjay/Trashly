if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}

const express=require('express');
const ejsMate=require('ejs-mate');
const path=require('path');
const methodOverride=require('method-override');
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const Trader=require('./models/trader')
const Admin=require('./models/admin');
const Event=require('./models/event');

const ExpressError=require('./utils/ExpressError');

const app=express();

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true})); 
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));


mongoose.connect('mongodb://127.0.0.1:27017/waste-app');

const db=mongoose.connection;
db.on("error",console.error.bind(console,"console error"));
db.once("open",()=>{
    console.log('Database connected');
});


const sessionConfig = {
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session())
passport.use('user-local',new LocalStrategy(User.authenticate()));
passport.use('trader-local',new LocalStrategy(Trader.authenticate()));
passport.use('admin-local', new LocalStrategy(Admin.authenticate()));

passport.serializeUser((user, done) => {
    done(null, { id: user._id, type: user.constructor.modelName });
});
  
passport.deserializeUser(async (serializedData, done) => {
    try {
        let Model;
        if (serializedData.type === 'User') {
            Model = User;
        } else if (serializedData.type === 'Trader') {
            Model = Trader;
        } else if (serializedData.type === 'Admin') {
            Model = Admin;
        }
        const user = await Model.findById(serializedData.id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.use((req, res, next) => {
    res.locals.currentUser=req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

const homeRoutes=require('./routes/home')
const userRoutes=require('./routes/users');
const traderRoutes=require('./routes/traders');
const adminRoutes=require('./routes/admins');
const wasteproductRoutes=require('./routes/wasteproducts');
const recycledproductRoutes=require('./routes/recycledproducts');
const orderRoutes=require('./routes/orders');
const complaintRoutes=require('./routes/complaints');
const eventRoutes=require('./routes/events');


app.use('/',homeRoutes)
app.use('/complaints',complaintRoutes);
app.use('/user',userRoutes)
app.use('/trader',traderRoutes)
app.use('/admin',adminRoutes);
app.use('/events',eventRoutes);
app.use('/wasteproducts',wasteproductRoutes);
app.use('/recycledproducts',recycledproductRoutes);
app.use('/orders',orderRoutes);

app.get('/',(req,res)=>{
    res.send('Home Page');
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(3000,(req,res)=>{
    console.log('Server running at port 3000');
})