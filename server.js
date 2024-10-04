const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');


app.use(express.json());
app.use(cors());
dotenv.config();

// connect to the database

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

// check if the db connection works
db.connect((err) => {
    if(err) return console.log("Error connecting to the database");

    console.log("Database connected successfully as id: ", db.threadId)


    
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on http://localhost:${process.env.PORT}`);

        // sending message to the browser
        console.log('Sending message to the browser ...')

        app.get('/', (req, res) => {
            res.send('Server started successfully!')
        })

        app.get('/patients', (req, res) => {
            
            const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    
            db.query(query, (err, results) => {
                if(err){
                    console.error('Error fetching patients:', err);
                    return res.status(500).json({error: 'Database query failed'});
                }
    
                // return results in Json format
                res.json(results);
            });
        });

        app.get('/providers', (req, res) => {
            const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
            db.query(query, (err, results) => {
                if(err){
                    console.error('Error fetching providers: ', err);
                    return res.status(500).json({error: 'Database query failed'});
                }

                res.json(results);
            })
        });

        app.get('/patientsByName', (req, res) => {
            const query = 'SELECT first_name FROM patients';
            db.query(query, (err, results) => {
                if(err){
                    console.error('Error fetching patients by first name: ', err);
                    return res.status(500).json({error: 'Database query failed'});
                }
                res.json(results);
            })
        });

        app.get('/providerSpecialty', (req, res) => {
            const query = 'SELECT provider_specialty FROM providers';
            db.query(query, (err, results) => {
                if(err){
                    console.error('Error fetching providers specialty: ', err);
                    return res.status(500).json({error: 'Database query failed'});
                }

                res.json(results);
            })
        });
    
    
    });
});