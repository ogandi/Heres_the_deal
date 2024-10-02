const express = require('express')
const db = require('../db')
const ensureLoggedIn = require('../middlewares/ensure_logged_in')
const router = express.Router()

router.get('/', (req, res) => {
    const sql = `
    SELECT *
    FROM deals;
    `

    db.query(sql, (err, result) => {
        if (err) {
        }

        if (result.rows.length === 0) {
            return res.render('home', { productDetails: [], userEmail: null })
        }
        const productDetails = result.rows
        const sql2 = `
        SELECT * 
        FROM users
        WHERE id = $1
        `
        db.query(sql2, [productDetails[0].user_id], (err, result) => {
            const userEmail = result.rows[0].email
            console.log(userEmail);


            res.render('home', { productDetails, userEmail })
        })
    })
})

router.get('/share', ensureLoggedIn, (req, res) => {
    res.render('share_form')
})

router.post('/shared', ensureLoggedIn, (req, res) => {
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

router.get('/edit/:id', (req, res) => {
    const sql = `
    SELECT * 
    FROM deals
    WHERE id = $1
    `
    db.query(sql, [req.params.id], (err, result) => {
        let productDetails = result.rows[0]

        res.render('edit_form', { productDetails })
    })

})

router.put('/edited/:productId', (req, res) => {
    let productDetails = [
        req.body.item_name,
        req.body.price,
        req.body.category,
        req.body.description,
        req.body.image,
        req.body.deal_source,
        req.params.productId
    ]

    const sql = `
    UPDATE deals
    SET
    item_name = $1, price = $2, category = $3, description = $4, image = $5, deal_source = $6
    WHERE id = $7
    `

    db.query(sql, productDetails, (err, result) => {
        if (err) {
            console.log(err);

        }
        res.redirect('/posts')
    })
})

router.delete('/delete/:productId', ensureLoggedIn, (req, res) => {
    const sql = `
    DELETE FROM deals
    WHERE id = $1 
    `
    db.query(sql, [req.params.productId], (err, result) => {
        if (err) {
            console.log(err);

        }
        res.redirect('/posts')
    })

})

router.get('/posts', (req, res) => {
    const sql = `
    SELECT item_name, price, category, description, image, deal_source, id
    FROM deals
    WHERE user_id = $1;
    `

    db.query(sql, [req.session.userId], (err, result) => {
        if (err) {
            console.log(err);

        }
        let productDetails = result.rows
        console.log(productDetails);


        res.render('user_posts', { productDetails })
    })
})

module.exports = router