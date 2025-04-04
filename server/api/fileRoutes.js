import express from 'express';
import multer from 'multer';

import postFile from '../logicRoute/postRoutes.js'
import {getAllFiles, getSelectedFiles, dowloadFile } from '../logicRoute/getRoutes.js'

import { handlerPost, handleSearch } from '../middleware/middleware.js';


const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage });



router.get('/', getAllFiles);


router.post('/upload', [upload.single('file'),handlerPost ], postFile);


router.get('/search',handleSearch ,getSelectedFiles);



router.get('/download/:customDocId', dowloadFile);


export default router;