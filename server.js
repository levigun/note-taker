const express = require('express');
const fs = require('fs');
const path = require('path');
// custome middleware?
const dbData = require('./db/db.json');
// Helper method for generating unique ids
const uuid = require('./helper/uuid');

const app = express();
const PORT = 3001;

// middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

// GET route for homepage
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route to get all the notes from the database
app.get('/api/notes', (req, res) => res.json(dbData));

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
            review_id: uuid(),
        };

        // pushing the new entered notes to the db.json file
        dbData.push(newNotes);

        // convert the data to a string so that we can save it
        const noteString = JSON.stringify(newNotes, undefined, 3);

        // Write the string to a file
        fs.writeFile('./db/db.json', noteString, (err) => 
            err
                ? console.err(err)
                : console.log (`Not with the title of ${newNotes.title} jas been added to JSON file`)
        );

        const response = {
            status: 'Success',
            body: newNotes,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in adding and saving new notes');
    }

})

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
