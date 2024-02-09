const express = require('express');
const app = express();
const morgan = require('morgan');

const PORT = process.env.PORT || 4000;

const phonebook = [
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.use(morgan('tiny'));

app.use(express.json());

app.get('/api/persons', (req, res) => {
    res.json(phonebook);
});

app.get('/info', (req, res) => {
    const currentTime = new Date();
    const numberOfEntries = phonebook.length;
    const responseText = `
        <p>Number of entries in the phonebook: ${numberOfEntries}</p>
        <p>Request received at: ${currentTime}</p>
        
    `;
    res.send(responseText);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = phonebook.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    phonebook = phonebook.filter(person => person.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    }
    if (phonebook.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    };
    phonebook = phonebook.concat(person);
    res.json(person);
});

const generateId = () => {
    const maxId = phonebook.length > 0 ? Math.max(...phonebook.map(p => p.id)) : 0;
    return maxId + 1;
};

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
