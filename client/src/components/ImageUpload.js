import React, { useState, useActionState } from 'react';

const FILE_TYPES = [
  { value: 'image', label: 'Image' },
  { value: 'text', label: 'Text Document' },
  { value: 'pdf', label: 'PDF' },
  { value: 'code', label: 'Code File' }
];

const ImageUpload = (props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState('image');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadError, setUploadError] = useState('');


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const getAcceptedFileTypes = (type) => {
    switch (type) {
      case 'image':
        return 'image/*';
      case 'text':
        return '.txt,.doc,.docx';
      case 'pdf':
        return '.pdf';
      case 'code':
        return '.js,.jsx,.ts,.tsx,.html,.css,.json';
      default:
        return '*/*';
    }
  };

  const handleUpload = async (prevState, formData) => {
    const title = formData.get('title');
    const description = formData.get('description');
    const fileType = formData.get('fileType');
    const uploadedFile = formData.get('file');

    if (!uploadedFile || !title || !description){
      return false;
    }

    const newFormData = new FormData();
    newFormData.append('file', uploadedFile);
    newFormData.append('title', title);
    newFormData.append('description', description);
    newFormData.append('fileType', fileType);
    newFormData.append('username', props.user.username);
    newFormData.append('fileName', uploadedFile.name);
    newFormData.append('fileSize', uploadedFile.size.toString());
    newFormData.append('mimeType', uploadedFile.type);
    let holdDate = new Date();
    newFormData.append('uploadedAt', holdDate);

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body:newFormData,
      });

      const formDataObj = Object.fromEntries(newFormData.entries());
      
      
      if (response.ok) {
        props.onClose();
        setUploadError('');
        const formDataObj = Object.fromEntries(newFormData.entries());
        formDataObj.uploadedBy = formDataObj.username;
        delete formDataObj.uploadedAt;
        formDataObj.uploadedAt = holdDate.toISOString();
         delete formDataObj.username;
  
        const updatedMetadata = [...props.metadata, formDataObj];
        props.setMetadata(updatedMetadata); 

        return true;
      }

      const hold = await response.json();
      setUploadError(hold.error);

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
        <h2>Upload New File</h2>
        <form action={formAction}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter file title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter file description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="3"
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
          <div className="form-group">
            <label htmlFor="file">File</label>
            <input
              type="file"
              id="file"
              name="file"
              accept={getAcceptedFileTypes(fileType)}
              onChange={handleFileChange}
              required
            />
          </div>
          {preview && fileType === 'image' && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
          <button type="submit" className="upload-submit-button" disabled={isPending}>
            {isPending ? 'Uploading...' : 'Upload'}
          </button>
          {uploadError && <div className="error-message">{uploadError}</div>}
        </form>
      </div>
    </div>
  );
};

export default ImageUpload; 