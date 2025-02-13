import express from 'express'
import auth from "./src/auth"
import post from "./src/post"
import comment from "./src/comment"
import account from "./src/account"
import path from 'path';
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json({
    limit: '50mb'
}))
app.use(cors({
    credentials: true,
    origin: true
}));
app.use(cookieParser())

app.use('/', auth)
app.use('/', account)
app.use('/', post)
app.use('/', comment)

app.get("/image/:filename", (req, res) => {

    const { filename } = req.params

    res.sendFile(path.join(__dirname, `../upload/${filename}`))
})

app.listen(4000, () => {
    console.log("server running on port 4000");
})