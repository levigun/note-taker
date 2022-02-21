const express = require('express');
const fs = require('fs');
const path = require('path');
// Helper method for generating unique ids
const uuid = require('./helper/uuid');


const app = express();
const PORT =  process.env.PORT || 3001;

// middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// GET route for notes page
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route to get all the notes from the database
app.get('/api/notes', (req, res) => 
    res.sendFile(path.join(__dirname,"./db/db.json"))
);

// POST new note to save on the request body and add to db.json file
app.post('/api/notes', (req, res) => {
    // destructuring for item in req.body
    const { title, text } = req.body;
    // if statement for all properties are entered
    if (title && text) {
        // variables for the object that we will save
        const newNotes = {
            title,
            text,
            id: uuid(),
        };


        const notes = JSON.parse(fs.readFileSync('./db/db.json'));
        notes.push(newNotes);

        // Write the string to a file
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => 
            err
                ? console.err(err)
                : console.log (`Not with the title of ${newNotes.title} jas been added to JSON file`)
        );

        res.status(201).json(newNotes);
    } else {
        res.status(500).json('Error in adding and saving new notes');
    }

})

// DELETE the notes that are not wanted
app.delete("/api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json'));
    const delNotes = notes.filter((removeNote) => removeNote.id !== req.params.id);
    fs.writeFileSync('./db/db.json', JSON.stringify(delNotes));
    res.json(delNotes);
});

// GET route for homepage
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
