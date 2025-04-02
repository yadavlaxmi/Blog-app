import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updatePost, fetchPosts } from '../api/postsApi';

const UpdatePost = () => {
    const { id } = useParams();
    const [post, setPost] = useState({ title: '', content: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchPost = async () => {
            try {
                const { data } = await fetchPosts();
                const existingPost = data.find(p => p._id === id);
                if (existingPost) setPost(existingPost);
                else setError('Post not found');
            } catch (err) {
                setError('Error fetching post');
            }
        };

        fetchPost();
    }, [id, navigate, token]);

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updatePost(id, post, token);
            alert('Post updated successfully');
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating post');
        }
    };

    return (
        <div>
            <h2>Edit Post</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleUpdate}>
                <input type="text" name="title" value={post.title} onChange={handleChange} required />
                <textarea name="content" value={post.content} onChange={handleChange} required></textarea>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default UpdatePost;
