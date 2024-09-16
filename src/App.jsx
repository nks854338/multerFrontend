import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null); 
  const [images, setImages] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [uploading, setUploading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://multer-backend-xi.vercel.app/');
      setImages(res.data); 
    } catch (err) {
      console.error("Error fetching images:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return; 

    setUploading(true);

    const formData = new FormData();
    formData.append('photo', file); 

    try {
      await axios.post('https://multer-backend-xi.vercel.app/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFile(null); 
      e.target.reset();
      fetchImages();
    } catch (err) {
      console.error("Error uploading image:", err);
    }

    setUploading(false);
  };

  return (
    <>
    <div className="container">
      <h1>Upload Image</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="photo" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {loading ? <p>Loading images...</p> : null}

      <div className='images'>
        {images.length === 0 ? (
          <p>No images found</p>
        ) : (
          images.map((image, index) => (
            <div key={index} className='image'>
              <img
                src={image.url}
                alt={`Uploaded ${index}`}
              />
            </div>
          ))
        )}
      </div>
      </div>
    </>
  );
};

export default App;
