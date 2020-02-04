const express = require("express")
const app = express()
const session =require("express-session")
const MongoStore = require("connect-mongo")(session)
const flash = require("connect-flash")
const markdown = require("marked")
const sanitizeHTML = require("sanitize-html")


const router = require("./router")

let sessionOptions = session({
    secret: "I need to get a job asap",
    store: new MongoStore({client: require("./db")}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})

app.use(sessionOptions)
app.use(flash())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static(__dirname + "/public"))
app.set("views", "views")
app.set("view engine", "ejs")
app.use(function(req, res, next){
    //make our markodwn function available from within ejs template 
    res.locals.filterUserHTML = function(content){
        return sanitizeHTML(markdown(content), {allowedTags: ["p", "br", "ul", "ol", "li","strong", "bold", "i", "em", "h1", "h2", "h3", "h4", "h5", "h6"], allowedAttributes:{}})
    }

    //Make all error and success flash messages avaelable  from all templates
    res.locals.errors = req.flash("errors")
    res.locals.success = req.flash("success")

    //Make current user id available on the req object
    if(req.session.user){req.visitorId = req.session.user._id}else{req.visitorId = 0}

    //Make user session data available from within view templates
    res.locals.user = req.session.user;
    next()
})
app.use("/", router)


module.exports = app