/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();

/* Models */
const Friend = require('../models/friend');

/* RESTful Architecture */
/* Show all Friends */
router.get('/', (req, res, next) => {
  Friend.find()
    .populate({ path: 'secretFriend', select: 'name' })
    .then((friends) => {
      res.json(friends);
    })
    .catch((err) => {
      res.json(err);
    });
});

/* Create a new friend into the database */
router.post('/', (req, res, next) => {
  const { name, email } = req.body;
  const friend = { name, email };
  Friend.create(friend)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

/* Shuffle all friends */
/* Even though the application is a simple one, we do not want to have a wise one
cracking into the client code to get his or hers bestie, cheating our algorithms, do we?
So let's leave the shuffling to the back end. */

router.get('/secret', (req, res, next) => {
  const rnd = size => Math.floor(Math.random() * size);

  Friend.find()
    .then((friends) => {
      /* I will refactor this code into a helper after. */
      const idList = friends.reduce((acc, friend) => {
        acc.push(friend._id);
        return acc;
      }, []);
      friends.forEach((friend) => {
        let idx = rnd(idList.length);

        const secretFriend = idList.splice(idx, 1)[0];
        console.log(friend, idx, secretFriend);
        Friend.findOneAndUpdate({ _id: friend._id }, { secretFriend })
          .then(res => console.log(">>>>", res));
      });
      res.json({ message: 'All done! Have a happy celebration of friendship! ' });
    })
    .then(res => console.log('inside next then'))
    .catch(() => {
      res.json({ message: 'Uh-oh, something went wrong. Terribly wrong' });
    });
});

/* Edit a specific friend */
router.get('/:friendId', (req, res, next) => {
  const friendId = req.params.id;
  Friend.findOne({ _id: friendId })
    .then((friend) => {
      res.json(friend);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.patch('/:friendId', (req, res, next) => {
  const friendId = req.params.id;
  const { name, email } = req.body;
  const friend = { name, email };

  Friend.findOneAndUpdate({ _id: friendId }, friend)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

/* Delete Friend, because, who knows... */
router.delete('/:friendId', (req, res, next) => {
  const friendId = req.params.id;
  Friend.findOneAndDelete(friendId)
    .then(() => {
      res.json({ message: 'Your friend has been removed from the draw. :(' });
    })
    .catch((err) => {
      res.json(err);
    });
});


module.exports = router;
