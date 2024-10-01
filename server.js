require('dotenv').config()

const express = require('express')
const app = express()
const port = 8080
const requestLogger = require('./middlewares/request_logger')
const db = require('./db')
const expressLayouts = require('express-ejs-layouts')


app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(express.urlencoded({extended: false}))

app.use(expressLayouts)

app.use(requestLogger)

// home sorts from most popular 
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

app.get('/share', (req, res) => {
    res.render('share_form')
})

app.post('/shared', (req,res) => {
    let formDetails = [
        req.body.item_name,
        req.body.price,
        req.body.category,
        req.body.description,
        req.body.image,
        req.body.deal_source
    ]
    

    const sql = `
    INSERT INTO deals
    (item_name, price, category, description, image, deal_source)
    VALUES
    ($1, $2, $3, $4, $5, $6);
    `

    db.query(sql, formDetails, (err, result) => {
        if (err) {
            console.log(err);
        }

        res.redirect('/')
    })
    
})

app.get('/login', (req,res) => {
    res.render('login_form')
})

app.listen(port, () => {
    console.log(`we live`)
})