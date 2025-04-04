# MyBox Term Project

[MyBox Term Project](https://github.com/FelipeBarrosCode/myboxTermProject)
[Click To Go To Project](https://myboxtermproject.onrender.com)

## Building and Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/myboxTermProject.git
   ```
2. Navigate to the project folder:
   ```bash
   cd myboxTermProject
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set environment variables:
   - `MONGODB_URI` – MongoDB connection string.
   - `DB_NAME` – Optional (defaults to "mybox").
5. Start the server:
   ```bash
   npm run dev
   ```
6. Open your browser at [http://localhost:1234](http://localhost:1234) (or the configured port).

## Proud Features

- **Robust API:** RESTful endpoints for user and file management.
- **Validation:** MongoDB schema validation for users and files.
- **Dynamic File Handling:** Supports file uploads along with metadata.
- **Modular Design:** Separation of concerns across client, server, and database layers.

## Application Usage

- The application provides a React interface rendered into the `#react-container` div.
- Navigate through the login, image gallery, and file upload views.
- API endpoints are accessible under `/api` (refer to API documentation below).

## References

- **MongoDB Schemas:** See `server/collections/schemas.js` (e.g., lines 1-80 for user schema and lines 82-160 for file schema).
- **Client Entry Point:** `/server/public/index.js` (look at lines 1-120 for module setup).
- **Parcel Bundling:** Reviewed in `/server/public/index.js` and related file selections.

## API Documentation

### Endpoints




#### GET /api/files
- **Description:** Retrieves a list of uploaded files.
- **Response Format:** JSON array of file objects.

#### GET /api/files/search&query
- **Description:** Uses a dynamic querryto search for documents in the database
- **Response Format:** JSON array filtered by search params

#### GET /api/files/download/:customDocId
- **Description:** Streams the file content using MongoDB’s [GridFsBucket](https://www.mongodb.com/docs/drivers/node/current/fundamentals/gridfs/). Use this endpoint to retrieve file streams for downloads or previews.
- **Response Format:** Returns a file stream.


#### POST /api/files/upload
- **Description:** Uploads a new file. This endpoint uses [multer](https://github.com/expressjs/multer) middleware to handle `multipart/form-data` uploads. File metadata and storage details are then managed in MongoDB.
- **Expected POST Body:** (Form-data)
  - `title`: string (min 10, max 50 characters)
  - `description`: string (min 10 characters)
  - `fileType`: one of "image", "text", "pdf", "code"
  - `file`: the file blob
- **Response Format:** JSON object with details about the uploaded file.

## Middleware Documentation

### handlerPost Middleware
- **Purpose:** Validates incoming POST requests for file uploads.
- **Validations:**
  - Ensures `req.body.title` exists.
  - Ensures a file is provided via `req.file`.
  - Ensures `req.body.description` exists.
- **Behavior:** On missing fields, responds with a 400 error and an appropriate message. Otherwise, passes control to the next middleware.

### handleSearch Middleware
- **Purpose:** Validates GET requests for file searching.
- **Validations:**
  - Checks that query parameters `uploadedBy` and `title` do not exceed 100 characters.
  - Ensures the request method is GET.
- **Behavior:** If any validation fails, responds with a 400 error; otherwise, logs the query and passes control to the next middleware.




