import React from "react";
import Navbar from "../components/Navbar";
import {
  FaHeading,
  FaUser,
  FaLink,
  FaCloudUploadAlt,
  FaTimes,
  FaRegPaperPlane,
} from "react-icons/fa";
import "./CreatePost.css";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePost = () => {
  const user = JSON.parse(localStorage.getItem("authData"));
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: user?.name || "",
    imageUrl: "",
    imageType: "url",
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchPostToEdit = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${id}`);
      if (response.ok) {
        const post = await response.json();
        setFormData({
          title: post.title,
          description: post.description || post.content || '',
          author: post.author,
          imageUrl: post.image && post.image.startsWith('http') ? post.image : '',
          imageType: post.image && post.image.startsWith('http') ? 'url' : 'file',
        });
        setImagePreview(post.image);
      }
    } catch (error) {
      console.error("Error fetching post for edit:", error);
      toast.error("Failed to load post for editing");
    }
  };

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchPostToEdit();
    }
  }, [id]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    } else if (formData.title.length < 6) {
      newErrors.title = "Minimum 6 characters required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.length < 6) {
      newErrors.description = "Minimum 6 characters required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const compressImage = (base64String, maxSizeMB = 1) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        const maxDimension = 1200; // Max width/height
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.8 quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedBase64);
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageData = null;
      
      if (formData.imageType === "url") {
        imageData = formData.imageUrl.trim();
      } else if (imagePreview && imagePreview.startsWith('data:')) {
        // Compress image if it's from file upload
        try {
          imageData = await compressImage(imagePreview);
        } catch (error) {
          console.error("Error compressing image:", error);
          imageData = imagePreview; // Use original if compression fails
        }
      }

      const postData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        author: formData.author.trim() || user?.name || "Anonymous",
        image: imageData || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Sending data - Image length:", imageData?.length || 0);

      let response;
      if (isEditMode) {
        response = await fetch(`http://localhost:3001/posts/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
      } else {
        response = await fetch("http://localhost:3001/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
      }

      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);

      if (response.ok) {
        toast.success(isEditMode ? "Post updated successfully!" : "Post created successfully!");
        navigate("/dashboard");
      } else {
        let errorMessage = "Failed to save post";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        toast.error(`${errorMessage} (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error(`Network error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    if (isEditMode && id) {
      fetchPostToEdit();
    } else {
      setFormData({
        title: "",
        description: "",
        author: user?.name || "",
        imageUrl: "",
        imageType: "url",
      });
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    setErrors({});
  };

  const handleFileTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, imageType: type }));
    if (type === "url") {
      setImagePreview(formData.imageUrl);
    } else {
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setErrors({ ...errors, image: "" });
      };
      reader.onerror = () => {
        toast.error('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (formData.imageType === 'url') {
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    } else if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="create-post-page">
      <Navbar />

      <div className="create-post-container">
        <header className="form-header">
          <h1>{isEditMode ? "Edit Post" : "Create New Post"}</h1>
          <p>
            {isEditMode ? "Make changes to your post and update it." : "Share your thoughts, stories, or ideas with the world."}
          </p>
        </header>

        <div className="post-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Post Title *</label>
              <div className="input-wrapper">
                <FaHeading className="input-icon" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  className={`form-control ${errors.title ? "input-error" : ""}`}
                  placeholder="Enter a catchy title..."
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <span className="error-msg">{errors.title}</span>
                )}
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
                  className="form-control"
                  placeholder="Enter author name"
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                className={`form-control ${errors.description ? "input-error" : ""}`}
                placeholder="What's on your mind? Write your story here"
                onChange={handleChange}
                rows="5"
                disabled={isSubmitting}
              />
              {errors.description && (
                <span className="error-msg">{errors.description}</span>
              )}
            </div>

            <div className="form-group">
              <label>Cover Image</label>
              {!imagePreview ? (
                <>
                  <div className="image-source-tags">
                    <button
                      type="button"
                      className={`tab-btn ${formData.imageType === "url" ? "active" : ""}`}
                      onClick={() => handleFileTypeChange("url")}
                      disabled={isSubmitting}
                    >
                      Image URL
                    </button>

                    <button
                      type="button"
                      className={`tab-btn ${formData.imageType === "file" ? "active" : ""}`}
                      onClick={() => handleFileTypeChange("file")}
                      disabled={isSubmitting}
                    >
                      Upload File
                    </button>
                  </div>
                  
                  {formData.imageType === "url" ? (
                    <div className="input-wrapper">
                      <FaLink className="input-icon" />
                      <input
                        type="url"
                        name="imageUrl"
                        className="form-control"
                        placeholder="Paste image URL here (e.g., https://...)"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  ) : (
                    <div 
                      className={`image-upload-area ${isSubmitting ? 'disabled' : ''}`} 
                      onClick={!isSubmitting ? triggerFileSelect : undefined}
                      style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                    >
                      <FaCloudUploadAlt className="upload-icon" />
                      <p>Click to upload image from your device</p>
                      <p className="upload-hint">Images will be compressed automatically</p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                  {errors.image && (
                    <span className="error-msg">{errors.image}</span>
                  )}
                </>
              ) : (
                <div className="image-preview-container">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="image-preview"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
                    }}
                  />
                  <button 
                    type="button" 
                    className="remove-image-btn" 
                    onClick={removeImage}
                    disabled={isSubmitting}
                    title="Remove image"
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
                disabled={isSubmitting}
              >
                <FaRegPaperPlane /> 
                {isSubmitting 
                  ? (isEditMode ? "Updating..." : "Publishing...") 
                  : (isEditMode ? "Update Post" : "Publish Post")
                }
              </button>

              <button 
                type="button" 
                className="cancel-btn"
                onClick={resetForm}
                disabled={isSubmitting}
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