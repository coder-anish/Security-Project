const app = require("./app");
const dotenv = require('dotenv');

const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database")
    // config
dotenv.config({ path: "backend/config/config.env" });
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
console.log(process.env.PORT)

process.on("uncaughtException", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1)
})

const server = app.listen(4000, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`)
})



module.exports = server;

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1)
    })
});