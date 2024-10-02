require('dotenv').config()

const express = require('express')
const app = express()
const port = 8080
const requestLogger = require('./middlewares/request_logger')
const db = require('./db')
const expressLayouts = require('express-ejs-layouts')
const bcrypt = require('bcrypt')
const session = require('express-session')
const setUserSession = require('./middlewares/set_user_session')
const methodOverride = require('method-override')
const ensureLoggedIn = require('./middlewares/ensure_logged_in')


app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(requestLogger)

app.use(express.urlencoded({ extended: false }))

app.use(methodOverride('_method'))

app.use(expressLayouts)

app.use(session({
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 3 },
    secret: 'pudding',
    resave: false,
    saveUninitialized: true
}))

app.use(setUserSession)


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
        res.render('home', { productDetails })
    })

})

app.get('/share', ensureLoggedIn, (req, res) => {
    res.render('share_form')
})

app.post('/shared', ensureLoggedIn, (req, res) => {
    let formDetails = [
        req.body.item_name,
        req.body.price,
        req.body.category,
        req.body.description,
        req.body.image,
        req.body.deal_source,
        req.session.userId
    ]


    const sql = `
    INSERT INTO deals
    (item_name, price, category, description, image, deal_source, user_id)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7);
    `

    db.query(sql, formDetails, (err, result) => {
        if (err) {
            console.log(err);
        }

        res.redirect('/')
    })

})


app.get('/signup', (req, res) => {
    res.render('sign_up_form')
})

app.post('/registered', (req, res) => {
    let email = req.body.email
    let plainTextPass = req.body.password
    saltRounds = 10

    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(plainTextPass, salt, (err, hash) => {
            const sql = `
            INSERT INTO users
            (email, password_digest)
            VALUES
            ($1, $2)
            `
            db.query(sql, [email, hash], (err, result) => {
                if (err) {
                    console.log();

                }
                res.redirect('/login')
            })
        })
    })
})



app.get('/login', (req, res) => {
    res.render('login_form')
})

app.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const sql = `
    SELECT *
    FROM users
    WHERE email = $1
    `

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.log(err);

        }
        if (result.rows.length === 0) {
            return res.send('user or pass not found')
        }

        const user = result.rows[0]
        bcrypt.compare(password, user.password_digest, (err, isCorrect) => {
            if (err) {
                console.log(err);

            }
            if (!isCorrect) {
                return res.send('user or pass not found')

            }
            req.session.userId = user.id
            res.redirect('/')
        })
    })
})

app.get('/edit/:id', (req,res) => {
    const sql = `
    SELECT * 
    FROM deals
    WHERE id = $1
    `
db.query(sql, [req.params.id], (err, result) => {
    let productDetails = result.rows[0]
    
    res.render('edit_form', {productDetails})
})

app.put('/edited/:productId', (req,res) => {
    let productDetails = [
    req.body.item_name,
    req.body.price,
    req.body.category,
    req.body.description,
    req.body.image,
    req.body.deal_source
    ]

    const sql = `
    UPDATE deals
    SET
    item_name = $1, price = $2, category = $3, description = $4, image = $5, deal_source = $6
    `

    db.query(sql, productDetails, (err,result) => {
        if (err) {
            console.log(err);
            
        }
        res.redirect('/posts')
    })
})


})

app.delete('/delete/:productId', (req,res) => {
    const sql = `
    DELETE FROM deals
    WHERE id = $1 
    `
    db.query(sql, [req.params.productId], (err,result) => {
        if (err) {
            console.log(err);
            
        }
        res.redirect('/posts')
    })

})


app.get('/posts', (req,res) => {
    const sql = `
    SELECT item_name, price, category, description, image, deal_source, id
    FROM deals
    WHERE user_id = $1;
    `

    db.query(sql, [req.session.userId], (err,result) => {
        if (err) {
            console.log(err);
            
        }
        let productDetails = result.rows
        console.log(productDetails);
        
        
        res.render('user_posts', {productDetails})
    })
})


app.delete('/logout', (req,res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            
        }
        res.redirect('/')
    })
})













app.listen(port, () => {
    console.log(`we live`)
})