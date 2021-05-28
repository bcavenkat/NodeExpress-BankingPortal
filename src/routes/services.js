const express = require('express');
const router = express.Router();


const {accounts, writeJSON } = require('../data.js');

router.get('/transfer', function (request, response) {
    response.render('transfer'); 
});

router.post('/transfer', (request, response) => {
    //console.log("inside the submit");
    //console.log(request.body);
    accounts[request.body.from].balance -= request.body.amount;
    accounts[request.body.to].balance += parseInt(request.body.amount, 10);
    //console.log(accounts);
    writeJSON();
    response.render('transfer', {message: 'Transfer Completed'});
});

router.get('/payment', function (request, response) {
    response.render('payment', { account: accounts.credit }); 
});

router.post('/payment', (request, response) => {
    accounts.credit.balance -= request.body.amount;
    accounts.credit.available += parseInt(request.body.amount);
    writeJSON();
    response.render('payment', {message: 'Payment Successful', account: accounts.credit});
});

module.exports = router;


