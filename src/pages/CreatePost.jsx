import { useState } from "react";
import {
  FaCloudUploadAlt,
  FaHeading,
  FaLink,
  FaRegPaperPlane,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import "./CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();

  // Get current user from localStorage
  const authData = JSON.parse(localStorage.getItem("authData") || "{}");
  const defaultAuthor = authData?.username || "User";

  const [formData, setFormData] = useState({
    title: "",
    author: defaultAuthor,
    description: "",
    imageUrl: "",
    imageType: "url",
  });

  const [imageTab, setImageTab] = useState("url");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          imageUrl: reader.result,
          imageType: "file",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newPost = {
        title: formData.title,
        author: formData.author || defaultAuthor,
        description: formData.description,
        image: formData.imageUrl || "https://via.placeholder.com/600x400",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        toast.success("Post created successfully!");
        navigate("/dashboard");
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      title: "",
      author: defaultAuthor,
      description: "",
      imageUrl: "",
      imageType: "url",
    });
    setImagePreview(null);
    setImageTab("url");
    toast.info("Form cleared");
  };

  return (
    <div className="create-post-page">
      <Navbar
        onLogout={() => {
          localStorage.removeItem("authData");
          navigate("/login");
        }}
      />

      <div className="create-post-container">
        <header className="form-header">
          <h1>Create New Post</h1>
          <p>Share your thoughts and stories with the world</p>
        </header>

        <div className="post-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Post Title</label>
              <div className="input-wrapper">
                <FaHeading className="input-icon" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter a catchy title..."
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Author Name</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                placeholder="What's on your mind?"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Cover Image</label>

              {!imagePreview && (
                <div className="image-source-tabs">
                  <button
                    type="button"
                    className={`tab-btn ${
                      imageTab === "url" ? "active" : ""
                    }`}
                    onClick={() => {
                      setImageTab("url");
                      setFormData({ ...formData, imageType: "url" });
                    }}
                  >
                    Image URL
                  </button>

                  <button
                    type="button"
                    className={`tab-btn ${
                      imageTab === "upload" ? "active" : ""
                    }`}
                    onClick={() => {
                      setImageTab("upload");
                      setFormData({ ...formData, imageType: "file" });
                    }}
                  >
                    Upload File
                  </button>
                </div>
              )}

              {imageTab === "url" && (
                <div className="input-wrapper">
                  <FaLink className="input-icon" />
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    className="form-control"
                    placeholder="Paste image URL here"
                  />
                </div>
              )}

              {imageTab === "upload" && (
                <div
                  className="image-upload-area"
                  onClick={() =>
                    document.getElementById("imageUpload").click()
                  }
                >
                  <FaCloudUploadAlt className="upload-icon" />
                  <p>Click to upload image</p>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </div>
              )}

              {imagePreview && (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={removeImage}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>

            <div className="form-actions-row">
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                <FaRegPaperPlane />
                {loading ? " Publishing..." : " Publish Post"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={handleClearForm}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
