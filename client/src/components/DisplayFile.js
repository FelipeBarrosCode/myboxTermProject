

import React, { useState, useActionState } from 'react';



const DisplayFile = (props) => {
  const [title, setTitle] = useState('');
  const [userSearcg, setUserSearch] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState('image');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  

  

  const handleUpload = async (prevState, formData) => {
    

    console.log(props.obj)
   
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
      const response = await fetch(`/api/files/search?${params.toString()}`, {
        method: 'GET'
      });


      
      
      const data = await response.json();
    

      if (response.ok) {
        props.onClose()
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error uploading file:', error);
      return false;
    }
  };
  const [state, formAction, isPending] = useActionState(handleUpload, false);

  async function dowloadFile(){
    try {
      console.log(props.obj)
      const {_id} = props.obj;
      console.log(_id)
      const response = await fetch(`/api/files/download/${_id}`, {
        method: 'GET'
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

    
      const a = document.createElement("a");
      a.href = url;
      a.download = `downloaded_file.${props.obj.mimeType.split("/")[1]}`; 
      document.body.appendChild(a);
      a.click(); 
      document.body.removeChild(a); 

  
      URL.revokeObjectURL(url);


  }catch (error) {
    console.error('Error dowlloading file:', error);
    return false;
  }



  }

  return (
    
      <div className='display-file'>
        
        <div>
        <p>Title:{props.obj.title}</p>
        <p>Description:{props.obj.description}</p>
        <p>File Type:{props.obj.fileType}</p>
        <p>Uploaded By:{props.obj.uploadedBy}</p>
        <p>Uploaded At:{props.obj.uploadedAt}</p>
        <p>File Size:{props.obj.fileSize} kb</p>
        <p>Mime Type:{props.obj.mimeType}</p>
        </div>
        <form > 
         <button onClick={(e)=>{
              e.preventDefault();
              dowloadFile();
         }}>

            Dowload

         </button>
        </form>
      </div>

  );
};

export default DisplayFile; 