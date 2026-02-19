import React from "react";
import Navbar from "../components/Navbar";
import "./Favorites.css";
import { MdDeleteSweep, MdOpenInNew } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";

const Favorites = () => {
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
              <span className="count-badge">3</span>
            </h2>

            <button className="clear-all-btn">
              <MdDeleteSweep size={20} /> Clear List
            </button>
          </div>

          <div className="fav-empty-state">
            <div className="empty-icon-wrapper">
              <FaRegStar className="empty-icon" />
            </div>

            <h3>Your list is Empty</h3>
            <p>Discover interesting posts and save then to read later</p>
            <button className="browse-btn">Explore Stories</button>
          </div>

          <div className="favorites-grid">
            <div className="fv-card">
              <div className="fav-card-image">
                <img src="" alt="sample Post" />

                <div className="fav-card-overlap">
                  <button className="read-btn">
                    <MdOpenInNew />
                    Read Article
                  </button>
                </div>
              </div>

              <div className="fav-card-body">
                <div className="fav-meta">
                  <span className="fav-author">Author Name</span>
                  <span className="fav-date">Recent</span>
                </div>

                <h3 className="fav-title">Sample Post Title</h3>
                <p className="fav-excerpt">
                  This is a sample description of the post used only fav.
                </p>
                <button className="remove-fav-btn">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Favorites;
