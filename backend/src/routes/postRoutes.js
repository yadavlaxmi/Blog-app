


const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a Post
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new Post({ title, content, author: req.user.id });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all Posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single Post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a Post
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        post.title = title;
        post.content = content;
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a Post
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Like a Post
router.put('/:id/like', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.likes.includes(req.user.id)) {
            post.likes.pull(req.user.id);
        } else {
            post.likes.push(req.user.id);
            post.dislikes.pull(req.user.id);
        }
        await post.save();
        res.json({ 
            message: 'Like updated successfully', 
            likesCount: post.likes.length, 
            dislikesCount: post.dislikes.length 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dislike a Post
router.put('/:id/dislike', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.dislikes.includes(req.user.id)) {
            post.dislikes.pull(req.user.id);
        } else {
            post.dislikes.push(req.user.id);
            post.likes.pull(req.user.id);
        }
        await post.save();
        res.json({ 
            message: 'Dislike updated successfully', 
            likesCount: post.likes.length, 
            dislikesCount: post.dislikes.length 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check if a user has liked or disliked a Post & return counts
router.get('/:id/status', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const liked = post.likes.includes(req.user.id);
        const disliked = post.dislikes.includes(req.user.id);
        res.json({ 
            liked, 
            disliked, 
            likesCount: post.likes.length, 
            dislikesCount: post.dislikes.length 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
