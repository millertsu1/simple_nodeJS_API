import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';


const app = express();
app.use(bodyParser.json());

const readData = () =>{
    try{
        const data = fs.readFileSync('./receipts.json');
        return JSON.parse(data);
    }catch(e){
        return console.log(e);;
    }
};

const writeData = (data) =>{
    try{
        fs.writeFileSync('./receipts.json', JSON.stringify(data));
    }catch(e){
        return console.log(e);
    }
};

//?  END-POINTS

app.get('/', (req, res)=>{
    res.send(' Bienvenido a mi API de recetas');
});

app.get('/receipts', (req, res) => {
    const data = readData();
    res.json(data.receipts);
});

app.get('/receipts/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const receipt = data.receipts.find((receipt) => receipt.id === id);
    res.json(receipt);
});

app.post('/receipts', (req, res) => {
    const data = readData();
    const body = req.body;
    const newReceipt = {
        id: data.receipts.length + 1,
        ...body,
    };
    data.receipts.push(newReceipt);
    writeData(data);
    res.json({ message: 'Receipt created successfully' });
});

app.get('/receipts/:id',(req, res) =>{
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const receiptIndex = data.receipts.findIndex( receipt => receipt.id === id);

    if(receiptIndex != -1){
        data.receipts[receiptIndex] ={
            ...data.receipts[receiptIndex],
            ...body
        };
        writeData(data);
        res.json({message:"Receipt updated successfully"});
    }else{
        res.status(404).send({error: "receipt no found"})
    }
})

app.listen(3000, ()=>{
    console.log('server listen on port 3000');
});