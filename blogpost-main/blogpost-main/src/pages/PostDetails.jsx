import React from 'react'
import Navbar from '../components/Navbar';
import "./PostDetails.css";
import { FaArrowLeft, FaUser, FaCalendarAlt, FaClock} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PostDetails = () => {
    const [post, setPost] = useState({});
    const navigate = useNavigate();

    const fetchPostDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${window.location.pathname.split("/post/")[1]}`);
            const data = await response.json();
            setPost(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPostDetails();
    }, []);

  return (
    <div className="post-details"> 
    <Navbar />

    <main className="post-details-container">

        <button className="back-btn">
            <FaArrowLeft /> Back to Feed
        </button>

        <article className="full-post">
            <header className="post-header">
                <div className="post-category"> Journal </div>

                <h1 className="post-full-title">
                    {post.title}
                </h1>

                <div className="post-author-meta">
                    <div className="author-info">
                        <div className="author-avatar">
                            <FaUser size={40} color="#888" />
                        </div>

                        <div>
                            <span className="author-name">{post.author || "Anonymous"}</span>

                            <div className="post-data-row">
                                <span>
                                    <FaCalendarAlt /> {post.createAt ? new Date(post.createAt).toLocaleDateString() : ''}
                                </span>

                                <span className="dot"></span>

                                <span>
                                    <FaClock /> 5 Min Read
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="post-featured-image">
                <img 
                    src={post.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500"} 
                    alt="Post"
                />
            </div>

            <div className="post-body">
                <p>
                    {post.description || post.content || post.excerpt}
                </p>
            </div>

            <footer className="post-footer">
                <div className="post-share">
                    <span>Share this story: </span>
                    <div className="share-button">
                        <button className="share-btn">Twitter</button>
                        <button className="share-btn">LinkedIn</button>
                        <button className="share-btn">Link</button>
                    </div>
                </div>
            </footer>
        </article>
    </main>
    </div>
  )
}

export default PostDetails 
 