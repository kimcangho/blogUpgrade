//jshint esversion:6

//Require modules - express, body-parser, ejs, lodash, mongoose
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

//Declare constants
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutStartingContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactStartingContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//Other declared objects
let posts = [];
const app = express();

//Connect to mongoDB via mongoose through promise
main().catch(err => console.log(err));
async function main() {
  //Create new local mongoDB named blogUpgrade
  await mongoose.connect("mongodb://localhost:27017/blogUpgrade", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

//Initialize ejs
app.set('view engine', 'ejs');

//Use body-parser and public static files to be used by express
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Create new posts schema
const postsSchema = {
  postTitle: String,
  postEntry: String
};

//Create new posts model
const Post = mongoose.model("Post", postsSchema);

//Get request for home route
app.get("/", function(req, res) {

  //Search database for all entries to display in home page
  Post.find({}, function(err, foundPosts) {
    posts = foundPosts;
    res.render("home", {
      homeContent: homeStartingContent,
      postArray: posts
    });
  });


});

//Get request for about route
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutStartingContent
  });
});

//Get request for contact route
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactStartingContent
  });
});

//Get request for compose route
app.get("/compose", function(req, res) {
  res.render("compose");
});

//Handle Post request for compose route
app.post("/compose", function(req, res) {

  //Create new post document in posts collection
  const post = new Post({
    postTitle: req.body.postTitle,
    postEntry: req.body.composeEntry
  });
  post.save();
  //Redirect to home route
  res.redirect("/");
});

// Handle get requests from path parameters
app.get("/posts/:topic", function(req, res) {

  //Assign path parameter to id
  const id = req.params.topic;

  //Search DB for entry based on id
  Post.findById(id, function(err, post) {
    if (!err) {
      if (!post) {
        res.redirect("/error");
      } else {
        //Render post in separate page with id in path parameter
        res.render("post", {
          postTitle: post.postTitle,
          postEntry: post.postEntry
        });
      }
    } else {
      console.log(err);
      res.redirect("/error");
    }
  });

});

//Error-handling page
app.get("/:topic", function(req, res) {
  res.render("error");
});

//Listen in on server startup
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
