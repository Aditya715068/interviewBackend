const express = require('express');
const router = express.Router();
const sessionService = require('./session.service');

// routes
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;

function login (req, res, next) {c
    sessionService.login(req.body, req.connection.remoteAddress)
        .then(data => data ? res.json(data) : res.status(404).json({message: 'No login with such token'}))
        .catch(err => next(err));
}

function logout(req, res, next) {
    sessionService.logout(req.body, req.connection.remoteAddress)
        .then(data => data ? res.json(data) : res.status(404).json({message: 'Something went wrong!'}))
        .catch(err => next(err));
}