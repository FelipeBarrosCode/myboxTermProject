import React, { useState, useEffect } from 'react';
import DisplayFile from './DisplayFile';

const ImageGallery = (props) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
   
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('https://myboxtermproject.onrender.com/api/files');
      const data = await response.json();

      
      props.setMetadata(data.files);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>Welcome, {props.user.username}!</h2>
        <button onClick={props.onSearchClick} className="upload-button">
          Search Images
        </button>
        <button onClick={props.onUploadClick} className="upload-button">
          Upload New Image
        </button>
      </div>
      <div className="image-grid">
        {props.metadata && props.metadata.map((obj, index) => (
          <div key={index} className="image-card">
            <DisplayFile obj={obj}/>
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery; 