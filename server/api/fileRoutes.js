import express from 'express';
import multer from 'multer';
import path from 'path';
import { client, dbName } from '../collections/schemas.js';
import { GridFSBucket, ObjectId } from 'mongodb';


const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage });



router.get('/', async (req, res) => {
  try {
    const db = client.db(dbName);
    const filesCollection = db.collection('files');
    const files = await filesCollection.find().toArray();
    res.status(200).json({files});
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Error fetching files' });
  }
});


router.post('/upload', upload.single('file'), async (req, res) => {
  console.log(req.body)
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

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
});


router.get('/search', async (req, res) => {

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
      query= []
      
      pipeline = [
        {
          $match: { username:username } // Filter for the specific user if needed
        },
        
        {
          $lookup: {
            from: 'files',
            localField: 'uploadedFiles.fileId', // The references to file documents
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
    console.error('Error searching files:', error);
    res.status(500).json({ error: 'Error searching files' });
  }
});

router.get('/download/:customDocId', async (req, res) => {
 console.log("Download file")
  try {
      const bucket = new GridFSBucket(client.db(dbName), { bucketName: 'myBucket' });
      const db = client.db(dbName);
      const filesCollection = db.collection('myBucket.files');
      const customDocId = req.params.customDocId;

      console.log('Work on file')
      const customDocument = await db.collection('files').findOne({ _id: new ObjectId(customDocId) });
      
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
});


export default router;