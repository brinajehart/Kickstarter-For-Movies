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

router.post('/get-script-by-id/:scriptId', requireAuth, async (req, res, next) => {
    const scriptId = req.params.scriptId;
    const qb = new QueryBuilder(settings, 'mysql', 'single');
    qb.select("*").from('scripts')
        .where('id', scriptId)
        .get((err, result) => {
            console.log(err, result);
            qb.disconnect();
            res.status(200).json({
                ok: true,
                result: result[0]
            });
        });
});

router.post('/get-all-scripts', async (req, res, next) => {
    const qb = new QueryBuilder(settings, 'mysql', 'single');
    qb.select("s.*, u.display_name, u.email").from('scripts s')
        .join("users u", "s.user_id=u.id", "left")
        .get((err, result) => {
            qb.disconnect();
            res.status(200).json({
                ok: true,
                result: result
            });
        });
});

router.post('/create', requireAuth, async (req, response, next) => {
    console.log(req.body);
    const qb = new QueryBuilder(settings, "mysql", "single");
    qb.returning("id").insert("scripts", {...req.body, user_id: req.USER_ID }, (err, res) => {
        console.log(err, res);
        response.status(200).json({
            ok: !!err,
            result: res
        })
    });
});

router.post('/update/:id', requireAuth, async (req, response, next) => {
    const { title, trailer, description, genre_id } = req.body;
    const update = { title, trailer, description, genre_id };
    const qb = new QueryBuilder(settings, "mysql", "single");
    qb.update("scripts", update, { id: req.params.id }, (err, res) => {
        console.log(err, res);
        response.status(200).json({
            ok: !!err,
            result: res
        })
    });
});


module.exports = router;