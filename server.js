'use strict'
const config = require('./config')
var firebase_admin = require("firebase-admin")
const mongoose = require('mongoose')
const app = require('./app')
const port = process.env.PORT || config.API_PORT
const serviceAccount = require("./firebase/key.json");
app.listen(port, () => {
    console.log(`MCards API ready on port  ${port}`)
})
mongoose.connect(config.DB_URL_PRODUCTION, (err, res) => {
    if (err)
        throw err
    console.log("Conexion a la base de datos establecida")
    firebase_admin.initializeApp({
      credential: firebase_admin.credential.cert(serviceAccount),
      databaseURL: "https://mcards-7449e.firebaseapp.com"
    });
 
})
