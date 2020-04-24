const express = require('express');
const QueryBuilder = require('node-querybuilder');
const settings = require('./connect');
const jwt = require('jsonwebtoken');
const requireAuth = require('./jwt');

const router = express.Router();

router.post('/get-all-comments/:id', async (req, res, next) => {
    const scriptId = req.params.id;
    const qb = new QueryBuilder(settings, 'mysql', 'single');
    qb.select("*").from('comments c')
        .join("users u", "c.user_id=u.id", "left")
        .where('c.script_id', scriptId)
        .get((err, result) => {
            qb.disconnect();
            res.status(200).json({
                ok: true,
                result: result ? result : []
            });
        });
});

router.post('/create/:id', requireAuth, async (req, response, next) => {
    const scriptId = req.params.id;
    console.log(req.body);
    const qb = new QueryBuilder(settings, "mysql", "single");
    qb.returning("id").insert("comments", {...req.body, user_id: req.USER_ID, script_id: scriptId  }, (err, res) => {
        console.log(err, res);
        response.status(200).json({
            ok: true,
            result: res
        })
    });
});


module.exports = router;
