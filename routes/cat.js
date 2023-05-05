const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Img = require('../models/Img');
const axios = require('axios')
const API_URL = 'https://api.thecatapi.com/v1/';
const API_KEY = 'live_kggDiFM48doTRSncyGRcEYy9ajBrutrL0qH80rYfWwq3FkKuNwGYWH47DGUMlR4J';

isLoggedIn = (req, res, next) => {
    if (res.locals.loggedIn) {
        next()
    } else {
        res.redirect('/login')
    }
}



/**
 * generate the cat image first, if the user like it, 
 * create a cat object and save it to user's object
 */
router.get('/cat', isLoggedIn,
    async (req, res) => {
        try {
            const url = `${API_URL}images/search`;
            const response = await axios.get(url, {
                headers: {
                    'x-api-key': API_KEY
                }
            });
            //create a img object
            const imageData = response.data[0];
            const imageUrl = imageData.url;
            const catImg = new Img({
                url: imageUrl,
                description: "",
                isliked: false,
            });
            await catImg.save();
            const user = res.locals.user;
            res.render('Cat/index', { imageUrl: catImg });
        } catch (error) {
            console.error('Error fetching image to vote on:', error);
            res.status(500).json({ error: 'Failed to fetch image to vote on' });
        }
    });

router.get('/cat/:id/add', isLoggedIn,
    async (req, res) => {
        try {
            const user = res.locals.user;
            const imgCat = await Img.find({ _id: req.params.id });
            await User.findByIdAndUpdate(user._id, {
                $push: { catImgs: imgCat },
            });
            res.redirect("/cat");
        } catch (error) {
            console.error('Error submitting vote:', error);
            res.status(500).json({ error: 'Failed to add cat img to users' });
        }
    });

router.get('/cat/show', isLoggedIn,
    async (req, res) => {
        try {
            const user = res.locals.user;
            const populatedUser = await User.findById(user._id).populate('catImgs');
            const catImgs = populatedUser.catImgs;
            console.log(catImgs);
            res.render('Cat/show', { Img: catImgs });

        } catch (error) {
            console.error('Error submitting vote:', error);
            res.status(500).json({ error: 'Failed to add cat img to users' });
        }
    });


module.exports = router;