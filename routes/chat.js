const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Res = require('../models/Response');


isLoggedIn = (req, res, next) => {
    if (res.locals.loggedIn) {
        next()
    } else {
        res.redirect('/login')
    }
};
router.get('/chat', isLoggedIn,
    async (req, res) => {
        res.render('Chat/index', { Res: "" });
    });

// create the obejct and pass by
createPrompt = async (req, res, next) => {
    const prompts =
        `You need to answer this question as you are a five years old child: ${req.body.prompt}`;


    response =
        await axios.post('http://gracehopper.cs-i.brandeis.edu:3500/openai',
            { prompt: prompts })
    content = response.data.choices[0].message.content;

    // assign the content
    const responseOb = new Res({
        prompt: req.body.prompt,
        answer: response.data.choices[0].message.content,
        createId: response.data.created
    });
    res.locals.content = response.data.choices[0].message.content;
    res.locals.resId = response.data.created;

    await responseOb.save();
    next();
}
router.post('/chat/:id', isLoggedIn, createPrompt,
    async (req, res) => {
        try {
            const user = res.locals.user;
            const resObject = await Res.find({ createId: res.locals.resId });
            await User.findByIdAndUpdate(user._id, {
                $push: { questions: resObject },
            });

            res.render('Chat/index', { Res: resObject });
        } catch (error) {
            console.error(error);
        }

    });
//show all the question
router.get('/chat/show', isLoggedIn,
    async (req, res) => {
        try {
            const user = res.locals.user;
            const populatedUser = await User.findById(user._id).populate('questions');
            const resObject = populatedUser.questions;

            res.render('Chat/show', { Res: resObject });
        } catch (error) {
            console.error(error);
        }
    })


module.exports = router;