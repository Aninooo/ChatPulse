import React, { useState, useRef } from 'react';
import axios from 'axios';
import { IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import './Chat.css'

function ImageUploader({ setSelectedImage }) {
  const [selectedImage, setSelectedImageLocal] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImageLocal(file);
      setSelectedImage(file);
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:4000/upload', formData);
      console.log(response.data.filePath); 
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }} 
        ref={fileInputRef}
      />
      <label>
        <IconButton
          color="primary"
          component="span"
          onClick={() => fileInputRef.current.click()}
        >
          <PhotoCameraIcon className='camera-icon'/>
        </IconButton>
      </label>
      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ImageUploader;
