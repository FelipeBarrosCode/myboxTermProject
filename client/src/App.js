import React, { useState } from 'react';
import Login from './components/Login';
import ImageGallery from './components/ImageGallery';
import ImageUpload from './components/ImageUpload';
import FileSearch from './components/FileSearch';
import './style.css';

function App() {
  const [user, setUser] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filesMetadata, setFilesMetadata] = useState([]);


  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleUploadClick = () => {
    setShowUpload(true);
   
  };

  const handleCloseUpload = () => {
    setShowUpload(false);
  };

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleSearchUpload = () => {
    setShowSearch(false);
  };

  

  return (
    <div className="app">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <ImageGallery setMetadata={setFilesMetadata} metadata={filesMetadata} user={user} onSearchClick={ handleSearchClick} onUploadClick={handleUploadClick} />

          <div className='modal'>
          {showUpload && <ImageUpload setMetadata={setFilesMetadata} metadata={filesMetadata} user={user} onClose={handleCloseUpload} />}
          {showSearch && <FileSearch setMetadata={setFilesMetadata} user={user} onClose={handleSearchUpload} />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;