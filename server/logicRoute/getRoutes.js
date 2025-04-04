import express from 'express';
import multer from 'multer';
import path from 'path';
import { client, dbName } from '../collections/schemas.js';
import { GridFSBucket, ObjectId } from 'mongodb';
import e from 'express';

const getAllFiles = async (req, res) => {
    try {
      const db = client.db(dbName);
      const filesCollection = db.collection('files');
      const files = await filesCollection.find().toArray();
      res.status(200).json({files});
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ error: 'Error fetching files' });
    }
  }


const getSelectedFiles = async (req, res) => {

    console.log(req.query)
    try {
      const username = req.query.uploadedBy;
      const db = client.db(dbName);
      const filesCollection = db.collection('files');
      const usersCollection = db.collection('users');
  
  
      let pipeline;
      let query = {};
  
     
      console.log(req.query.uploadedBy)
      if (req.query.uploadedBy) {

        const checkUser = await usersCollection.findOne({ username: username });
        if (!checkUser) {
          throw new Error('User not found');
        }
        query= []
        
        pipeline = [
          {
            $match: { username:username } 
          },
          
          {
            $lookup: {
              from: 'files',
              localField: 'uploadedFiles.fileId', 
              foreignField: '_id',
              as: 'filesInfo'
            }
          }
        ];
  
        const user = await usersCollection.aggregate(pipeline).toArray();
       
        let dataHolder = user[0].uploadedFiles
  
        console.log(dataHolder)
        if (req.query.fileType) {
       
          query.push({fileType: req.query.fileType});
        }
  
        
        if (req.query.title) {
          query.push({ title:{$regex: req.query.title, $options: 'i' }});
        }
        
        const files = (await Promise.all(dataHolder.map(async (file) => {
          const fileDoc = await filesCollection.findOne({ $and: [{ _id: file.fileId }, ...query] });
          return fileDoc;
        }))).filter(doc => doc !== null);
  
       
    
  
        return res.status(200).json({files});
      
      }
   
      if (req.query.fileType) {
       
        query.fileType = req.query.fileType;
      }
  
  
      
      if (req.query.title) {
        query.title = { $regex: req.query.title, $options: 'i' };
      }
  
    
  
      const files = await filesCollection
        .find(query)
        .toArray();
  
     
  
      res.json({
        files
      });
    } catch (error) {

      return res.status(500).json({ error: error.message });
      
    }
  }

  const dowloadFile = async (req, res) => {

    console.log(req.params)
    console.log("Download file")
     try {
         const bucket = new GridFSBucket(client.db(dbName), { bucketName: 'myBucket' });
         const db = client.db(dbName);
         const filesCollection = db.collection('myBucket.files');
         const customDocId = req.params.customDocId;

         console.log(req.params.customDocId)
   
         console.log('Work on file')
         console.log("Trigger Here")
          console.log(customDocId)
         const hold = new ObjectId(customDocId)
         const customDocument = await db.collection('files').findOne({ _id: hold });
         
     if (!customDocument) {
         return res.status(404).send('Custom document not found.');
     }
   
     
     const fileId = customDocument.fileDocumentId;
   
   
   
   
     const fileDoc = await filesCollection.findOne({ _id: fileId});
   
     if (!fileDoc) {
         return res.status(404).send('File not found.');
     }
   
     
     res.setHeader('Content-Disposition', `attachment; filename="${fileDoc.filename}"`);
     res.setHeader('Content-Type', 'application/octet-stream');
   
   
     const fileObjectId = typeof fileId === 'string' ? new ObjectId(fileId) : fileId;
     const downloadStream = bucket.openDownloadStream(fileObjectId);
     
     
     downloadStream.pipe(res);
   
    
     downloadStream.on('error', (error) => {
         console.error('Download error:', error);
         res.status(500).send('Error downloading file.');
     });
   
     } catch (error) {
         console.error('Error:', error);
         res.status(500).send('Internal server error.');
     }
   }


export {getAllFiles, getSelectedFiles, dowloadFile}
