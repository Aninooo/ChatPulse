import React, { useState } from 'react';
import axios from 'axios';

function ImageUploader({ setSelectedImage }) {
  const [selectedImage, setSelectedImageLocal] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (event) => {
    setSelectedImageLocal(event.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    setUploading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:4000/upload', formData);
      console.log(response.data.filePath); 
      setSelectedImage(selectedImage); 
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
      />
      <button onClick={handleImageUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ImageUploader;
