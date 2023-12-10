import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
require('dotenv').config();

const app=express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

const SECRET: string | undefined = process.env.SECRET_KEY;
const PASSWORD: string | undefined = process.env.PASSWORD;

if(!PASSWORD || !SECRET){
  throw new Error('ERROR OCCURED');
}

const userSchema = new mongoose.Schema({
    username: {type: String},
    password: String,
    highscore:Number
  });

const User = mongoose.model('User', userSchema);
const connectUrl=`mongodb+srv://mishrakartikey007:${encodeURIComponent(PASSWORD)}@clusterpk.n4nfhaf.mongodb.net/`;
mongoose.connect(connectUrl, {dbName: "userinfo" });


const authenticateJwt = (req:any, res:any, next:any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, SECRET, (err:any, user:any) => {
        if (err) {
          return res.sendStatus(403);
        }
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };

app.get('/',(req,res)=>{
    const indexPath = path.join(__dirname, '../client/index.html');
    res.sendFile(indexPath);
});

app.post('/signup',async (req,res)=>{
    const {username,password}=req.body;
    const user = await User.findOne({ username });
    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ username, password,highscore:0});
      await newUser.save();
      const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
    }
});

app.post('/login', async(req,res)=>{
    const { username, password } = req.headers;
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ username}, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
});

app.listen('3000',()=>{
    console.log("server running at port 3000!");
})