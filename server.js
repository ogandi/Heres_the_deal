require('dotenv').config()

const express = require('express')
const app = express()
const port = 8080
const requestLogger = require('./middlewares/request_logger')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const setUserSession = require('./middlewares/set_user_session')
const methodOverride = require('method-override')
const ensureLoggedIn = require('./middlewares/ensure_logged_in')


const sessionRoutes = require('./routes/session_router')
const dealRoutes = require('./routes/deals_router')

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

app.use(dealRoutes)

app.use(sessionRoutes)

app.listen(port, () => {
    console.log(`we live`)
})