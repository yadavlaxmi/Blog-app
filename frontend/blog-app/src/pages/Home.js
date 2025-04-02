

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, deletePost, likePost, dislikePost, checkpostStatus, createPost } from '../api/postsApi';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [likedPosts, setLikedPosts] = useState({});
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const loadPosts = async () => {
            try {
                const { data } = await fetchPosts();
                setPosts(data);
                setLoading(false);

                // Fetch like/dislike status for each post
                const statusPromises = data.map(post => checkpostStatus(post._id, token));
                const statusResults = await Promise.allSettled(statusPromises);

                const statuses = {};
                statusResults.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        statuses[data[index]._id] = result.value.data;
                    }
                });

                setLikedPosts(statuses);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load posts');
                setLoading(false);
            }
        };

        loadPosts();
    }, [navigate, token]);

    const handleDelete = async (id) => {
        try {
            await deletePost(id, token);
            setPosts(posts.filter(post => post._id !== id));
            alert('Post deleted successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting post');
        }
    };

    const handleLike = async (id) => {
        try {
            console.log(`Liking post: ${id}`);
            const { data } = await likePost(id, token);
            console.log("Like Response:", data);

            setLikedPosts(prev => ({
                ...prev,
                [id]: {
                    liked: !prev[id]?.liked, 
                    disliked: false,
                    likesCount: data.likesCount,
                    dislikesCount: data.dislikesCount
                }
            }));
        } catch (err) {
            alert(err.response?.data?.message || 'Error liking post');
        }
    };

    const handleDislike = async (id) => {
        try {
            console.log(`Disliking post: ${id}`);
            const { data } = await dislikePost(id, token);
            console.log("Dislike Response:", data);

            setLikedPosts(prev => ({
                ...prev,
                [id]: {
                    liked: false,
                    disliked: !prev[id]?.disliked, 
                    likesCount: data.likesCount,
                    dislikesCount: data.dislikesCount
                }
            }));
        } catch (err) {
            alert(err.response?.data?.message || 'Error disliking post');
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.title || !newPost.content) {
            alert('Please enter title and content');
            return;
        }

        try {
            const { data } = await createPost(newPost, token);
            setPosts([data, ...posts]);
            setNewPost({ title: '', content: '' });
            alert('Post created successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating post');
        }
    };

    return (
        <div className="container">
            <h2>Create New Post</h2>
            <form onSubmit={handleCreatePost} className="post-form">
                <input
                    type="text"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    required
                ></textarea>
                <button type="submit">Create Post</button>
            </form>

            {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
                posts.map(post => (
                    <div key={post._id} className="post-card">
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <p>Author: {post.author?.username}</p>
                        
                        <button onClick={() => handleLike(post._id)}>
                            {likedPosts[post._id]?.liked ? 'Unlike' : 'Like'} ({likedPosts[post._id]?.likesCount || 0})
                        </button>

                        <button onClick={() => handleDislike(post._id)}>
                            {likedPosts[post._id]?.disliked ? 'Remove Dislike' : 'Dislike'} ({likedPosts[post._id]?.dislikesCount || 0})
                        </button>

                        <button onClick={() => navigate(`/update/${post._id}`)}>Edit</button>
                        <button onClick={() => handleDelete(post._id)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Home;
