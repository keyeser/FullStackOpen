require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Phonebook = require('./models/phonebook');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(express.static('dist'));
app.use(express.json());

// Routes
// Ottenere tutte le voci del telefono dal database
app.get('/api/persons', (req, res) => {
    Phonebook.find({})
        .then(phonebookEntries => {
            res.json(phonebookEntries);
        })
        .catch(error => {
            console.error(error);
            res.status(500).end();
        });
});

// Ottenere informazioni sul numero di voci nel telefono
app.get('/info', (req, res) => {
    Phonebook.countDocuments({})
        .then(count => {
            const currentTime = new Date();
            const responseText = `
                <p>Number of entries in the phonebook: ${count}</p>
                <p>Request received at: ${currentTime}</p>
            `;
            res.send(responseText);
        })
        .catch(error => {
            console.error(error);
            res.status(500).end();
        });
});

// Ottenere una singola voce del telefono tramite ID
app.get('/api/persons/:id', (req, res) => {
    Phonebook.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).end();
        });
});

// Eliminare una voce del telefono tramite ID
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    Phonebook.findByIdAndDelete(id)
        .then(() => {
            res.status(204).end();
        })
        .catch(error => {
            console.error(error);
            res.status(500).end();
        });
});

// Aggiungere una nuova voce al telefono
app.post('/api/persons', (req, res) => {
    const body = req.body;
    const newEntry = new Phonebook({
        name: body.name,
        number: body.number
    });
    newEntry.save()
        .then(savedEntry => {
            res.json(savedEntry);
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ error: error.message });
        });
});

// Avviare il server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
