/*
? link a video tutorial: https://www.youtube.com/watch?v=BImKbdy-ubM */

import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors()); 

const readData = () =>{
    try{
        const data = fs.readFileSync("./db.json");
        return(JSON.parse(data));
    }catch(error){
        console.log(error);
        return { books: [] };
    }
};

const writeData = (data) =>{
    try{
        fs.writeFileSync("./db.json", JSON.stringify(data));
    }catch(error){
        console.log(error);
    }
};

//endpoints
app.get('/', (req, res)=>{
    res.send('Welcome to My Books API');
});

app.get('/books', (req,res) => {
    const data = readData();
    res.json(data.books);
});

app.get('/books/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id);
    res.json(book);
});

app.post('/books',(req, res) =>{
    const data = readData();
    const body = req.body;

    if (!body.name || !body.author || !body.year || !body.image || !body.viewUrl || !body.tag) {
        return res.status(400).send({ error: "Name, Author, Year, Image, View URL, and Tag are required" });
    }

    const newBook = {
        id: data.books.length ? data.books[data.books.length - 1].id + 1 : 1, // Generar un ID único
        ...body,
    };

    data.books.push(newBook);
    writeData(data);
    res.json(newBook);
})

app.put('/books/:id', (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
        // Actualiza el libro existente
        data.books[bookIndex] = {
            ...data.books[bookIndex],
            ...body
        };
        writeData(data);
        res.json({ message: "Book updated successfully" });
    } else {
        // Si no encuentra el libro, envía un error 404
        res.status(404).send({ error: "Book not found" });
    }
});

app.delete('/books/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
        data.books.splice(bookIndex, 1);
        writeData(data);
        res.json({ message: "Book deleted successfully" });
    } else {
        res.status(404).send({ error: "Book not found" });
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});