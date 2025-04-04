import express from 'express';
import multer from 'multer';
import path from 'path';
import { client, dbName } from '../collections/schemas.js';
import { GridFSBucket, ObjectId } from 'mongodb';

const postFile = async (req, res) => {
    console.log(req.body)
    try {
      
  
      const db = client.db(dbName);
      const filesCollection = db.collection('files');
      const usersCollection = db.collection('users');
  
      const bucket = new GridFSBucket(db, { bucketName: 'myBucket' },{
        username: req.body.username || '',
      });
      const uploadStream = bucket.openUploadStream(req.file.originalname);
      uploadStream.end(req.file.buffer);
  
      
  
      uploadStream.on('finish', async () => {
        try{
        const fileDoc = {
          title: req.body.title,
          description: req.body.description,
          fileType: req.body.fileType,
          fileName: req.file.originalname,
          uploadedBy: req.body.username,
          uploadedAt: new Date(),
          fileSize: Number(req.file.size),
          mimeType: req.file.mimetype,
          fileDocumentId: uploadStream.id
        };
    
        let fileResult;
        
        fileResult = await filesCollection.insertOne(fileDoc);
        
        
        console.log('Not work on file')
       
         const existingUser = await usersCollection.findOne({ username: req.body.username });
  
        
         if (!existingUser) {
           await usersCollection.insertOne({
             username: req.body.username,
             password: 'test',
             createdAt: new Date(),
             role: 'user',
             uploadedFiles: []
           });
         }
         
       
         await usersCollection.updateOne(
           { username: req.body.username },
           {
             $push: {
               uploadedFiles: {
                  fileId: fileResult.insertedId,
                  title: req.body.title,
                  uploadedAt: new Date()
               }
             }
           }
         );
  
        res.json({ 
          success: true, 
          fileId: fileResult.insertedId 
        });
        }catch(error){
          console.log('Error on file hdbubiewbchj');
          res.status(500).json({ error: `Error on file Review the content that you are uploading
            \n
            Supports: PDF, DOC, DOCX, TXT, JS, JSX, TS, TSX, HTML, CSS, JSON, JPG, JPEG, PNG, GIF, SVG, MP4, MP3, WAV, OGG, WEBM, and more.
            \n
            Max file size: 16MB
            \n
            At Last all fields must have minimum of 10 characters and most 50 chracters
            
            ` });
          return;
        }
  
      
          
      });
    
      uploadStream.on('error', (error) => {
        console.error('Error during file upload stream:', error);
        res.status(500).json({ error: 'Error during file upload stream' });
      });
        
        
  
     
    } catch (error) {
      console.error('Error uploading file:', error.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied);
      res.status(500).json({ error: 'Error uploading file reviw your submition' });
    }
  }

  export default postFile;