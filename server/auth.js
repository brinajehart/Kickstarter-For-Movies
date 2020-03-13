const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
const QueryBuilder = require('node-querybuilder');
const settings = require('./connect');
const jwt = require('jsonwebtoken');
const requireAuth = require('./jwt');

const hash = pass => passwordHash.generate(pass)

router.post('/register-user', (req, res, next) => {
    const qb = new QueryBuilder(settings, 'mysql', 'single');
    const data = {
        display_name: req.body.display_name,
        email: req.body.email,
        password: hash(req.body.password).toString(),
        is_company: req.body.is_company
    };

    qb.returning('id').insert('users', data, (err, result) => {
        if (err) {
            console.log(err);
            res.status(200).json({
                ok: false,
                result: 'Pojavila se je napaka; Najverjetneje uporabnik že obstaja!'
            });
        }
        else {
            res.status(200).json({
                ok: true,
                result: 'Nov uporabnik je bil dodan!'
            });

        }
    });
});

router.post('/login-user', (req, res, next) => {
    const qb = new QueryBuilder(settings, 'mysql', 'single');

    qb.select("id, email, is_company, display_name, password").from('users')
        .where({ email: req.body.email })
        .get(async (error, result) => {
            qb.disconnect();
            if (error) {
                res.status(200).json({
                    ok: false,
                    result: 'Pojavila se je napaka pri iskanju uporabnika!'
                });
            } else {
                if (!result.length) {
                    res.status(200).json({
                        ok: false,
                        result: "Uporabnik ni bil najden!"
                    });
                } else {
                    let pass = result[0].password;
                    var passwordHash = require('password-hash/lib/password-hash');
                    if (passwordHash.verify(req.body.password, pass)) {
                        let jwtToken = jwt.sign({
                            email: result[0].email,
                            userId: result[0].id
                        }, "kfm-key-420", {
                            expiresIn: "1h"
                        });
                        res.status(200).json({
                            ok: true,
                            result: jwtToken,
                            is_company: result[0].is_company == "1",
                            display_name: result[0].display_name
                        });
                    } else {
                        res.status(200).json({
                            ok: false,
                            result: "Geslo ni pravilno!"
                        });
                    }

                }
            }
        });
});

router.post('/get-username', async (req, res, next) => {
    let token = await parseToken(req.body.tokenString);
    const qb = new QueryBuilder(settings, 'mysql', 'single');
    console.log(token, "129");
    qb.select("name, surname").from('users')
        .where('id', token._id)
        .get((err, result) => {
            qb.disconnect();
            res.status(200).json({
                ok: true,
                result: result
            });
        });
});


module.exports = router;