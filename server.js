const express = require('express')
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser');

const VIEW_DIR = path.join(__dirname, 'view');
const TOAST_LIB_ROOT = path.join(__dirname, 'node_modules', 
    'jquery-toast-plugin', 'dist');

const app = express()

app.use('/', express.static(VIEW_DIR));
app.use('/lib/toast', express.static(TOAST_LIB_ROOT));

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(routes)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({ error: error.message})
})

app.listen(3000, () => {
    console.log('estou vivo')
} )