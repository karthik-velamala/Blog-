import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import _ from "lodash";
import mongoose from "mongoose";

const app = express();
const port = 4000;

mongoose.connect("mongodb+srv://velamalakarthik2003:Vkarthik8@cluster0.3il7l.mongodb.net/Blogdb?retryWrites=true&w=majority");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Define Post Schema and Model with 'pid' (custom post ID)
const postSchema = new mongoose.Schema({
  pid: Number,
  title: String,
  content: String,
  author: String,
  date: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", postSchema);

// CHALLENGE 1: GET All posts
app.get('/posts', (req, res) => {
  Post.find({}).then(function(posts) {
    res.json(posts);
  }).catch(function(err) {
    res.status(500).json({ error: err });
  });
});

// CHALLENGE 2: GET a specific post by 'pid'
app.get('/posts/:pid', (req, res) => {
  const pid = parseInt(req.params.pid);
  Post.findOne({ pid: pid }).then(function(post) {
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  }).catch(function(err) {
    res.status(500).json({ error: err });
  });
});

// CHALLENGE 3: POST a new post
app.post('/posts', (req, res) => {
  // Find the highest 'pid' to increment it for the new post
  Post.findOne().sort({ pid: -1 }).then(function(lastPost) {
    const newPid = lastPost ? lastPost.pid + 1 : 1;

    const newPost = new Post({
      pid: newPid,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    });

    newPost.save().then(function(post) {
      res.json(post);
    }).catch(function(err) {
      res.status(500).json({ error: err });
    });
  }).catch(function(err) {
    res.status(500).json({ error: err });
  });
});

// CHALLENGE 4: PATCH a post when you just want to update one parameter using 'pid'
app.patch('/posts/:pid', (req, res) => {
  const pid = parseInt(req.params.pid);
  Post.findOneAndUpdate({ pid: pid }, req.body, { new: true }).then(function(post) {
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  }).catch(function(err) {
    res.status(500).json({ error: err });
  });
});

// CHALLENGE 5: DELETE a specific post by providing the 'pid'
app.delete('/posts/:pid', (req, res) => {
  const pid = parseInt(req.params.pid);
  Post.findOneAndDelete({ pid: pid }).then(function(post) {
    if (post) {
      res.json({ message: "Post deleted" });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  }).catch(function(err) {
    res.status(500).json({ error: err });
  });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
