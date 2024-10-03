const express = require('express')
const db = require('../db')
const bcrypt = require('bcrypt')
const router = express.Router()

router.get('/signup', (req, res) => {
    res.render('sign_up_form')
})

router.post('/registered', (req, res) => {
    let email = req.body.email
    let username = req.body.username
    let plainTextPass = req.body.password
    let saltRounds = 10

    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(plainTextPass, salt, (err, hash) => {

            const sql = `
            INSERT INTO users
            (email, username, password_digest)
            VALUES
            ($1, $2, $3)
            `

            db.query(sql, [email, username, hash], (err, result) => {
                if (err) {
                    console.log(err);
                        return res.redirect('/signup')
                }
                res.redirect('/login')
            })
        })
    })
})

router.get('/login', (req, res) => {
    res.render('login_form')
})

router.post('/login', (req, res) => {

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

router.delete('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/')
    })
})

module.exports = router