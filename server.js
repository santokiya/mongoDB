const express = require("express");
const bodyParser = require("bodyParser");
const logger = require("morgan");
const mongoose = require("mongoose");

//scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

//require all models
const db = require("./models");

const PORT = 3000;

//Initialize express
let app = express();

//morgan logger to log requests
app.use(logger("dev"));
//bodyParser to handle form submissions
app.use(bodyParser.urlencoded({ extended: false }));
//express.static to serve as a static directory
app.use(express.static("public"));
//set mongoose to use promises(.then) and connect to MongoDB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/week18Populater", {
    useMongoClient: true
});
//Routes

app.get("/scrape", function(req, res) {
    //grab the body of html with request
    axios.get("http://www.nytimes.com").then(function(response) {
        //load into Cheerio and save to $ for shorthand
        let $ = cheerio.load(response.data);
        //grab h2 within an article tag
        $("article h2").each(function(i, element) {
            //save empty result object
            let result = {};
            //add,save text and href of every link save as properties of the results object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            //create new art. using result obj built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    //if error then send to client
                    return res.json(err);
                });
        });

        res.send("Scrape Complete");
    });
});

//route for retrieving all articles from DB
app.get("/articles", function(req, res) {
    //grab all docs in the Art. collection
    db.Article.find({})
        .then(function(dbArticle) {
            //send Articles back to client
            res.json(dbArticle);
        })
        .catch(function(err) {
            //if error then send to client
            res.json(err);
        });
});

//route for grabbing spec art by id
app.get("/articles/:id", function(req, res) {
    //use id passed n prepare a query to find a matching one in db
    db.Article.findOne({ _id: req.params.id })
        //populate all of the notes associated w/it
        .populate("note")
        .then(function(dbArticle) {
            //If found article with given id then send back to client
            res.json(dbArticle);
        })
        .catch(function(err) {
            //if error then return to client
            res.json(err);
        });
});

//route for saving/updating an article's associate Note
app.post("/articles/:id", function(req, res) {
    //create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function(dbNote) {

        })
})