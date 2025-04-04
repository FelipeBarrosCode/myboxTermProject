


const handlerPost = (req, res, next) => {

  if (req.method === 'POST') {
    
    if (!req.body.title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    if(!req.body.description){
      return res.status(400).json({ error: 'Description is required' });
    }
  }
  next();
}  

const handleSearch = (req, res, next) => {

  console.log(req.query)
  if (req.method === 'GET') {
    if (req.query.uploadedBy.length >100) {
      return res.status(400).json({ error: 'Username Needs to Be smaller' });
    }
    if (req.query.title.length > 100) {
      return res.status(400).json({ error: 'File Title Needs to Be smaller' });
    }
  }else{
   
    return res.status(400).json({ error: 'The endpoint metod is GET' });
  }
  next();
}

export {handlerPost, handleSearch}