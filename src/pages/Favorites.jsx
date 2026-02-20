import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Favorites.css";
import { MdDeleteSweep, MdOpenInNew } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Favorites = () => {
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/posts');
      const data = await response.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const removeFavorite = (postId) => {
    const currentFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = currentFavorites.filter(id => id !== postId);

    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
    toast.info("Removed from favorites");
  };

  const clearAllFavorites = () => {
    if (window.confirm("Clear all your saved posts?")) {
      localStorage.removeItem('favorites');
      setFavorites([]);
      toast.info("Collection cleared");
    }
  };

  const handleReadPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  const favoritePosts = posts.filter(post => favorites.includes(post.id));

  return (
    <div className="favorites-page-container">
      <Navbar />

      <main className="favorites-main">
        <div className="favorites-hero">
          <div className="hero-shape"> </div>
          <div className="hero-content">
            <h1>Your Reading List</h1>
            <p>Enjoy the Collection Of Stories you've Curated.</p>
          </div>
        </div>

        <div className="favorites-content">
          <div className="favorites-header">
            <h2>
              Curated Collection
              <span className="count-badge">{favoritePosts.length}</span>
            </h2>

            {favoritePosts.length > 0 && (
              <button className="clear-all-btn" onClick={clearAllFavorites}>
                <MdDeleteSweep size={20} /> Clear List
              </button>
            )}
          </div>

          {favoritePosts.length === 0 ? (
            <div className="fav-empty-state">
              <div className="empty-icon-wrapper">
                <FaRegStar className="empty-icon" />
              </div>
              <h3>Your list is Empty</h3>
              <p>Discover interesting posts and save them to read later</p>
              <button className="browse-btn" onClick={() => navigate("/dashboard")}>
                Explore Stories
              </button>
            </div>
          ) : (
            <div className="favorites-grid">
              {favoritePosts.map((post) => (
                <div className="fv-card" key={post.id}>
                  <div className="fav-card-image">
                    <img 
                      src={post.image || "https://via.placeholder.com/300x200"} 
                      alt={post.title} 
                    />

                    <div className="fav-card-overlap">
                      <button 
                        className="read-btn"
                        onClick={() => handleReadPost(post.id)}
                      >
                        <MdOpenInNew />
                        Read Article
                      </button>
                    </div>
                  </div>

                  <div className="fav-card-body">
                    <div className="fav-meta">
                      <span className="fav-author">
                        {post.author || "Anonymous"}
                      </span>
                      <span className="fav-date">
                        {post.date || new Date(post.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="fav-title">{post.title}</h3>
                    <p className="fav-excerpt">
                      {post.description || post.content || post.excerpt || "No description available"}
                    </p>
                    <button 
                      className="remove-fav-btn"
                      onClick={() => removeFavorite(post.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Favorites;