const express = require('express');
const router = express.Router();
const QueryBuilder = require('node-querybuilder');
const settings = require('./connect');
const jwt = require('jsonwebtoken');
const requireAuth = require('./jwt');


router.post('/get-all-genres', async (req, res, next) => {
    const qb = new QueryBuilder(settings, 'mysql', 'single');
    qb.select("id, title").from('genres')
        .get((err, result) => {
            qb.disconnect();
            res.status(200).json({
                ok: true,
                result: result
            });
        });
});

router.post('/get-script-by-id/:scriptId', async (req, res, next) => {
    const scriptId = req.params.scriptId;
    const qb = new QueryBuilder(settings, 'mysql', 'single');
    qb.select("*").from('scripts')
        .where('id', scriptId)
        .get((err, result) => {
            qb.disconnect();
            res.status(200).json({
                ok: true,
                result: result[0]
            });
        });
});

router.post('/get-all-scripts', async (req, res, next) => {
    const qb = new QueryBuilder(settings, 'mysql', 'single');
    qb.select("*").from('scripts')
        .get((err, result) => {
            qb.disconnect();
            res.status(200).json({
                ok: true,
                result: result
            });
        });
});


module.exports = router;