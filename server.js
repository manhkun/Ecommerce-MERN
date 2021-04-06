require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    useTempFiles: true
}));

// Router
app.use('/user', require('./routes/user.router'));
app.use('/api', require('./routes/category.router'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/product.router'));


// Connect Mongo
const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log("Connected Mongo");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`);
})