
import Navbar from '../components/Navbar';
import { Navigate, useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import './Dashboard.css'
import {useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

   const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };
  
    useEffect(() => {
    fetchData();
  }, []);


   const handleEdit = (post) => {
    navigate(`/edit-post/${post.id}`);
    toast.info("Redirecting to edit post...");
  };

const handleView = (post) => {
    navigate(`/post/${post.id}`);
    toast.info("Redirecting to post details...");
}

const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/posts/${id}`, {
        method: "DELETE",
      });
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete post");
    }
  };


  return (

    <div className="dashboard-page">

       <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <div className="welcome-text">
            <h1>Wellcome to your Dashboard</h1>
            <p>Manage your posts, track engagement,and connect with your audience</p>
          </div>
        </div>

        <div className="dashboard-stats-overview">
          <div className="dash-card">
            <h3>Total Posts</h3>
            <span className="dash-number">10</span>
          </div>

          <div className="dash-card">
            <h3>Total Stories</h3>
            <span className="dash-number">5</span>
          </div>

          <div className="dash-card">
            <h3>Community Posts</h3>
            <span className="dash-number">10</span>
          </div>
        </div>

        <section className="posts-section">
          <div className="section-header">
            <h2 className="section-title">Recent Feed</h2>
            <button className="create-shortcut-btn">
              <FaPlus /> New Post
            </button>
          </div>

          <div className="posts-grid">
        {( posts.map((post) => (
            <div className="post-card" key={post.id}>
              <div className=".post-image-container">
                <img
                  src={post.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500"}
                  alt={post.title}
                  className="post-card-image"
                />

                <div className="post-actions">
                  <button
                    className="action-btn edit-btn"
                    title="Edit Post" 
                    onClick={() =>  handleEdit(post)}
                  >
                    <MdEdit size={22} color="#ffffff" />
                  </button>

                  <button
                    className="action-btn delete-btn"
                    title="Delete Post"
                    onClick={() => handleDelete(post.id)}
                  >
                    <MdDelete size={20} color="#ffffff" />
                  </button>
                </div>
              </div>

              <div className="post-card-content">
                <div className="post-meta">
                  <span className="post-author">By {post.author || "Anonymous"}</span>
                  <span className="post-date">
                    {post.date || new Date(post.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="post-card-title">{post.title}</h3>
                <p className="post-card-description">
                  {post.description || post.content || post.excerpt}
                </p>
                <button className="read-more-btn" onClick={() => handleView(post)}>Read More</button>
              </div>
            </div>
          ))
        )}
      </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
