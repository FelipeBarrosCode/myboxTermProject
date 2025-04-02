import { MongoClient, ObjectId } from 'mongodb';

import { GridFSBucket } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME || 'mybox';


export const userSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "password", "createdAt"],
      properties: {
        username: {
          bsonType: "string"
        },
        password: {
          bsonType: "string"
        },
        createdAt: {
          bsonType: "date"
        },
        uploadedFiles: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["fileId", "uploadedAt"],
            properties: {
              fileId: {
                bsonType: "objectId"
              },
              uploadedAt: {
                bsonType: "date"
              },
              title: {
                bsonType: "string"
              }
            }
          }
        }
      }
    }
  }
};

export const fileSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "fileType", "fileName", "uploadedBy", "uploadedAt"],
      properties: {
        title: {
          bsonType: "string",
          maxLength: 50,
          minLength: 10
          
        },
        description: {
          bsonType: "string",
          minLength: 10
        },
        fileType: {
          enum: ["image", "text", "pdf", "code"]
        },
        fileName: {
          bsonType: "string"
        },
        filePath: {
          bsonType: "string"
        },
        uploadedBy: {
          bsonType: "string"
        },
        uploadedAt: {
          bsonType: "date"
        },
        fileSize: {
          bsonType: "int"
        },
        mimeType: {
          bsonType: "string"
        },fileDocumentId:{
          bsonType: ObjectId,
        }
      }
    }
  }
};


export async function initializeMongoDB() {
  try {
    await client.connect();
    const db = client.db(dbName);


    await db.createCollection("users", userSchema);
    await db.createCollection("files", fileSchema);

  } catch (e) {
    if (e.code !== 48) {
      throw e;
    }
  }
}


export { client, dbName }; 