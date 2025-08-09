import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
  const parser = new DataUriParser(); //new data uriparser object
  const extName = path.extname(file.originalname).toString();
  //stores extension of file and convert it into string
  return parser.format(extName, file.buffer);
  //so in summary
//   This function:
// Takes a file uploaded (via multer).
// Extracts its type.
// Converts it into a base64 Data URI string.
// Returns that string for use in APIs (like Cloudinary upload).
}

export default getDataUri;
