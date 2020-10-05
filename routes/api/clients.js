const express   = require('express'),
      router    = express.Router(),
      passport  = require('passport'),
      jwt       = require('jsonwebtoken');

const { check, validationResult } = require('express-validator');

const Auth    = require('../../models/auth-model');
const Clients    = require('../../models/clients-model');

// get all clients
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const clients = await Clients.find().sort({ date: -1 });

        res.status(200).json(clients);
    } catch (err) {
        console.log("GET /", err);
        res.status(500).send('Server Error');
    }
});

// get a client
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const client = await Clients.findById(req.params.id);

        if(!client) return res.status(404).json({ msg: 'No client found' });

        res.status(200).json(client);
    } catch (err) {
        console.log("GET /:id", err);
        if(err.kind === 'ObjectId') return res.status(404).send({ msg: err.message });
        res.status(500).send('Server Error');
    }
});

// add a client
router.post('/', [
        passport.authenticate('jwt', { session: false }),
        [
            check('firstname', 'First name not provided').not().isEmpty(),
            check('lastname', 'Last name not provided').not().isEmpty(),
            check('address', 'Address not provided').not().isEmpty(),
            check('lawyer', 'Lawyer not provided').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const user = await Auth.findById(req.user.id).select('-password');
            const newClient = new Clients({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                address: req.body.address,
                tel: req.body.tel,
                lawyer: req.body.lawyer,
                addedby: req.user.id
            });

            const client = await newClient.save();
            res.status(200).json(client);
        } catch (err) {
            console.log("POST /", err);
            res.status(500).send('Server Error');
        }
    }
);

// update client
router.put('/:id', [
        passport.authenticate('jwt', { session: false }),
        [
            check('firstname', 'First name not provided').not().isEmpty(),
            check('lastname', 'Last name not provided').not().isEmpty(),
            check('address', 'Address not provided').not().isEmpty(),
            check('lawyer', 'Lawyer not provided').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {

            let client = await Clients.findByIdAndUpdate(
                { _id: req.params.id },
                {$set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    address: req.body.address,
                    tel: req.body.tel,
                    lawyer: req.body.lawyer,
                    addedby: req.user.id
                }});

            if(!client) return res.status(404).send({ msg: 'Invalid ID'});

            res.status(200).json(client);
        } catch (err) {
            console.log("PUT /:id", err);
            res.status(500).send('Server Error');
        }
    }
);

// add a note
router.post('/notes/:id', [
        passport.authenticate('jwt', { session: false }),
        [check('description', 'Description not provided').not().isEmpty()]
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const user = await Auth.findById(req.user.id).select('-password');
            const client = await Clients.findById(req.params.id);
            const newNote = {
                description: req.body.description,
                addedby: req.user.id
            };

            client.notes.unshift(newNote);
            await client.save();
            res.status(200).json(client.notes);
        } catch (err) {
            console.log("POST /notes/:id", err);
            res.status(500).send('Server Error');
        }
});

// delete a client
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const client = await Clients.findById(req.params.id);

        if(!client) return res.status(404).send({ msg: 'Client not found'});
        if(client.addedby.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized user'});

        await client.remove();
        res.status(200).json({ msg: 'Client removed'});
    } catch (err) {
        console.log("DELETE /:id", err);
        if(err.kind === 'ObjectId') return res.status(404).send({ msg: 'Post not found'});
        res.status(500).send('Server Error');
    }
});

module.exports = router;