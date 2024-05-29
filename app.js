const express = require('express');
const path = require('path');
const { title } = require('process');
const mongoose = require('mongoose')
const Blog = require('./models/blog');
const { contentType } = require('express/lib/response');

const app = express()
const username = 'blgusr';
const password = 'D*32SA%7CSvvi%C';
const URL = 'mongodb+srv://blgusr2:easypass@cluster0.dsueh7t.mongodb.net/BlogContent?retryWrites=true&w=majority&appName=Cluster0'



mongoose.connect(URL)
    .then((result) => {
        console.log('db connected');
        app.listen(3000)
    })
    .catch((err) => console.log(err));


app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended :true}));


app.post('/submit', (req,res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then( result => {
            console.log(result);
            res.redirect('blogs');
        })
        .catch(err => {
            res.status(500).send(err)
        })
    
})


app.get('/', (req,res) => {
    // console.log('request made');
    res.render('index', {title : 'Home'});
});

app.get('/blog', (req,res) => {

    let id = req.query.id;
    Blog.findById(id)
        .then( result =>{
            res.render('singleblog',{title:'single', blog : result})
        })
        .catch(err => {
            console.log(err);
        })

});

app.get('/about', (req,res) => {
    res.render('about', {title : 'About'})
});

app.get('/create' , (req,res) => {
    res.render('create', {title : 'Create Blog'})
});

app.get('/blogs', (req,res) => {

    Blog.find().sort( { createdAt : -1})
        .then(result => {
            res.render('blogs', {title : 'All Blogs', blogs : result});
        })
        .catch(err => {
            console.log(err);
        })    
})

app.use((req,res)=>{
    res.status(404).render('404' ,{title: 'page doesnt exist'});
})