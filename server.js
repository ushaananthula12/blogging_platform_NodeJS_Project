// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/blogging-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Post schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model('Post', postSchema);

// Express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define routes

// Home route (display all posts)
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('index', { posts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Create new post route (form)
app.get('/posts/new', (req, res) => {
  res.render('new');
});

// Create new post route (submit form)
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;

  try {
    const newPost = new Post({ title, content });
    await newPost.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// View a specific post
app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (post) {
      res.render('show', { post });
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit a specific post (form)
app.get('/posts/:id/edit', async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (post) {
      res.render('edit', { post });
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit a specific post (submit form)
app.put('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });
    if (updatedPost) {
      res.redirect('/');
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a specific post
app.delete('/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (deletedPost) {
      res.redirect('/');
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
