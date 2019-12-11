const express = require("express")
const app = express()
const router = require("./router")
console.log(router)

app.use(express.static(__dirname + "/public"))
app.set("views", "views")
app.set("view engine", "ejs")

app.get("/", function(req, res){
    res.render("home-guest")
})

app.listen(3000, function(){
    console.log("listen port 3000")
})