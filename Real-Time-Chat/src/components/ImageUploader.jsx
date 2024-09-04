import React, { useState } from 'react';
import axios from 'axios';
import './ImageUploader.css';

const ImageUploader = ({ onUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('image', selectedImage);
  
      try {
        const response = await axios.post('http://localhost:4000/upload', formData);
        console.log('File uploaded successfully:', response.data.filePath);
        // Update selectedImage state after upload
        setSelectedImage(null); 
        sendMessage(); // Call sendMessage after upload
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  
  

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
};

export default ImageUploader;
