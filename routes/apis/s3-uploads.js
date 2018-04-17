/* waks:start=File Upload Server=start
Before you start, you need to setup your bucket on S3.

1. Go to the IAM service on AWS, then go to "Users", then "Add User."
2. Add a descriptive name for the user, choose the "Programmatic Access" option, and go to the next step.
3. Copy the "Access key ID" and the "Secret access key" to your environment - it's the last opportunity to see them, so don't wait. Additionally, make note of the "User ARN"- you'll need it for the next part.
4. Next, go to the S3 service from the AWS management console.
5. Create a bucket. Give it a name, and use the default settings for everything
6. Click on your new bucket, and take note of the `region` value in the URL (eg. `us-west-2`). Add this to your server environment.
7. Create a folder (the one in this example is named `files`)
8. Click on "Permissions" > "Bucket Policy". Take note of the `ARN` for this bucket. We're about to combine it with the User ARN.
9. Click on "Policy Generator." We need to add two statements- one to allow our server to add files, and another to allow the public to read them. Both of them are of type "S3 Bucket Policy."
    * The first statement's principal is the User ARN from step 3, the service is "Amazon S3", the action is "PutObject", the ARN is the bucket ARN from step 8 and the name of the folder (eg. `arn:aws:s3:::bucket-name/files`). Add this statement.
    * The second statement's principal is `*` (for everyone), the action is "GetObject", the ARN is the bucket ARN from step 8 and the name of the folder (eg. `arn:aws:s3:::bucket-name/files`). Add this to the statement.
    * Click "Generate Policy", and copy the resulting JSON file to the Bucket Policy from step 8 and click "Save."

NOTE: If you do this, only your server can write files to the bucket, but anyone can read them. Both reading and writing can cost you money on AWS, and all uploaded files are available to anyone.

Once you've set up your bucket, add a route to process the file upload. This route will process the file upload as middleware, and add details about the added S3 object to the `request` object.
waks:example */
const express = require("express");
const router = express.Router();

// Dependencies
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

// This creates an authenticated S3 instance
const s3 = new aws.S3({
    apiVersion: "2006-03-01",
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        accessKeyId: process.env.S3_ACCESS_KEY_ID
    }
});

// This is middleware that will process the multipart file upload
const upload = multer({
    storage: multerS3({
        s3, // The s3 instance from above
        // The name of your S3 bucket
        bucket: process.env.S3_BUCKET_NAME,
        key: (request, file, next) => {
            // This names the file. This example prepends the
            // UNIX timestamp to original name of the file,
            // which helps with duplicate file names
            next(null, `files/${Date.now()}_${file.originalname}`);
        }
    })
});

// The upload object from above has a `.single` method that runs as middleware,
// and then adds `file` to the `request` object. "file" is the `name` from
// the file upload form.
router.post("/upload", upload.single("file"), (request, response) => {
    // Return the URL the file was uploaded to- optionally, store it
    // in a database first.
    response.json({data: request.file.location});
});

module.exports = router;
/* waks:end */
