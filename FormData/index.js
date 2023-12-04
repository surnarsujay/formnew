const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

// Serve the form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/form.html');
});

// Handle form submission
app.post('/submit', (req, res) => {
    const name = req.body.name;
    const city = req.body.city;

    // Save to MSSQL database
    const sql = require('mssql/msnodesqlv8');
    const config = {
        user: 'sa',
        password: '12345678',
        server: 'MSI\\SQLEXPRESS',
        database: 'ReactTeam'
    };

    sql.connect(config, err => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Connected to MSSQL');

        const request = new sql.Request();
        request.query(`INSERT INTO form (name, city) VALUES ('${name}', '${city}')`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Data saved successfully!');
            }

            sql.close();
            res.send('Form submitted successfully!');
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
