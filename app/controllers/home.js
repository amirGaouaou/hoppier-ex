const express = require('express');
var request = require('request');
const router = express.Router();
const Question = require('../models/question');
const fs = require('fs');

module.exports = (app) => {
  app.use('/', router);
};

let mockSnacks;
let products;
let answers = {}

const solveAll = () => {
  let productMap = {}

  // Loop through mock snacks, and add them to a hashmap
  mockSnacks.forEach((snack) => {
    let faveSnacks = snack.fave_snack.split(new RegExp('\, | and '));
    if (typeof faveSnacks === String) {
      productMap[fave] = faveSnacks;
    } else {
      faveSnacks.forEach((fave) => {
        productMap[fave] = snack
      })
    };
  });

  let realSnacks = [];
  let emails = []
  totalPrice = 0

  //Loop through real snacks and see if the snack exists if it does, save the necessary info for answers
  products.forEach((prod) => {
    const foundProd = productMap[prod.title];
    if (foundProd) {
        realSnacks.push({ title: prod.title, image: prod.images[0].src });
        emails.push({ title: foundProd.email })
        totalPrice += parseFloat( prod.variants[0].price );
    }
  });
  // save all the answers
  answers.questionA = realSnacks;
  answers.questionB = emails;
  answers.questionC = `The total cost would be ${totalPrice}$`;
}

const getData = (req, res, next) => {
  if (!mockSnacks) {
    const options = {
      method: 'GET',
      json: true,
      uri: 'https://s3.amazonaws.com/misc-file-snack/MOCK_SNACKER_DATA.json',
    };
    request(options, (error, response, data) => {
      if (error || !data) {
        res.send(404)
      }
      mockSnacks = data;
      //Had a 403 when I tried to fetch... so I downloaded it.
      products = JSON.parse(fs.readFileSync('./products.json')).products;
      solveAll();
      next();
    });
  } else {
    next();
  }
};
// mid layer to get the data, if its not 
router.use(getData);

// Routing 
router.get('/', (req, res, next) => {
  var questions = [
    new Question({
      title: 'Question A', 
      description: 'a) List the real stocked snacks you found under the snackers fave_snack?', 
      link:'/questiona'
    }),
    new Question({
      title: 'Question B',
      description: 'b) What\'re the emails of the snackers who listed those as a \'fave_snack\'?',
      link: '/questionb'
    }),
    new Question({
      title: 'Question C',
      description: 'c) If all those snackers we\'re to pay for their \'fave_snack\'what\'s the total price?',
      link: '/questionc'
    })
  ];
  res.render('index', {
  title: 'Hoppier exercice',
  questions: questions
  });
});

router.get('/mockdata', (req, res, next) => {
  res.send(mockSnacks);
});

router.get('/products', (req, res, next) => {
  res.send(products);
});

router.get('/questiona', (req, res, next) => {
  res.render('response',{
    question: new Question({
      title: 'Question A',
      description: 'a) List the real stocked snacks you found under the snackers fave_snack?'
    }),
    answers: answers.questionA
  });
});

router.get('/questionb', (req, res, next) => {
  res.render('response', {
    question: new Question({
      title: 'Question B',
      description: 'b) What\'re the emails of the snackers who listed those as a \'fave_snack\'?',
    }),
    answers: answers.questionB
  });
});


router.get('/questionc', (req, res, next) => {
  res.render('response', {
    question: new Question({
      title: 'Question C',
      description: 'c) If all those snackers we\'re to pay for their \'fave_snack\'what\'s the total price?',
    }),
    answer: answers.questionC
  });
});


