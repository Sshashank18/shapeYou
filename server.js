const express = require('express');

const app = express();

const { MONGOURI } = require('./config/credentials');

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true 
});

mongoose.connection.on('connected',()=>{
    console.log('Connected to Mongoose.');
});

mongoose.connection.on('error',(err)=>{
    console.log(err);
});

mongoose.set('useFindAndModify', false);



const trainerRouter = require('./routes/trainer').route;

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/trainer',trainerRouter);

const PORT = 3500;
app.listen(PORT,()=>console.log("Server Up and Running on http://127.0.0.1:"+PORT));

