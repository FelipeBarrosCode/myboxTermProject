import React, { useState, useActionState } from 'react';

const FILE_TYPES = [
  { value: 'image', label: 'Image' },
  { value: 'text', label: 'Text Document' },
  { value: 'pdf', label: 'PDF' },
  { value: 'code', label: 'Code File' }
];

const FileSearch = (props) => {
  const [title, setTitle] = useState('');
  const [userSearcg, setUserSearch] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState('image');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  

  

  const handleUpload = async (prevState, formData) => {
   
    const userToSearch = formData.get('userToSearch');
    const title = formData.get('title');
    const description = formData.get('description');
    const fileType = formData.get('fileType');
    const uploadedFile = formData.get('file');

    

    const newFormData = new FormData();
    
    newFormData.append('title', title);
   
    newFormData.append('fileType', fileType);
    newFormData.append('username', props.user.username);
    
  
    newFormData.append('uploadedBy', userToSearch);

    const params = new URLSearchParams(newFormData);
    console.log("params", params);

    try {
      const response = await fetch(`http://localhost:3000/api/files/search?${params.toString()}`, {
        method: 'GET'
      });
      
      const data = await response.json();
      console.log("data", data.files);

      if (response.ok) {
        props.onClose();
        props.setMetadata(data.files);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error uploading file:', error);
      return false;
    }
  };

  const [state, formAction, isPending] = useActionState(handleUpload, false);

  return (
    <div className="upload-overlay">
      <div className="upload-modal">
        <button className="close-button" onClick={props.onClose}>×</button>
        <h2>Search New File</h2>
        <form action={formAction}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter file title"
            
             
              optional
            />
          </div>
          <div className="form-group">
            <label htmlFor="userToSearch">User To Search</label>
            <input
              type="text"
              id="userToSearch"
              name="userToSearch"
              placeholder="Enter user"
              value={userSearcg}
              onChange={(e) => setUserSearch(e.target.value)}
              
            />
          </div>
         
          <div className="form-group">
            <label htmlFor="fileType">File Type</label>
            <select
              id="fileType"
              name="fileType"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              required
            >
              {FILE_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
      
         
          <button type="submit" className="upload-submit-button" disabled={isPending}>
            {isPending ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileSearch; 