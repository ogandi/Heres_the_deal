require('dotenv').config()

const express = require('express')
const app = express()
const port = 8080
const requestLogger = require('./middlewares/request_logger')
const db = require('./db')
const expressLayouts = require('express-ejs-layouts')


app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(expressLayouts)

app.use(requestLogger)


app.get('/', (req, res) => {
    const sql = `
    SELECT *
    FROM deals;
    `

    db.query(sql, (err, result) => {
        if (err) {
            
        }
        productDetails = result.rows
        res.render('home', {productDetails})  
    })

})

app.listen(port, () => {
    console.log(`we live`)
})