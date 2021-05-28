const fs = require('fs');
const path = require('path');
const express = require('express');
const app = new express();

const accountData = fs.readFileSync(path.join(__dirname, 'json', 'accounts.json'), {encoding:'utf8'});
const accounts = JSON.parse(accountData);

const userData = fs.readFileSync(path.join(__dirname, 'json', 'users.json'), {encoding:'utf8'});
const users = JSON.parse(userData);

app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));

app.get('/', function(request, response) {
    response.render('index', {title: 'Account Summary', accounts: accounts});  
});

app.get('/savings', function (request, response) {
    response.render('account', { account: accounts.savings }); 
});

app.get('/checking', function (request, response) {
    response.render('account', { account: accounts.checking }); 
});

app.get('/credit', function (request, response) {
    response.render('account', { account: accounts.credit }); 
});

app.get('/profile', function (request, response) {
    response.render('profile', { user: users[0] }); 
});

app.get('/transfer', function (request, response) {
    response.render('transfer'); 
});

app.post('/transfer', (request, response) => {
    //console.log("inside the submit");
    //console.log(request.body);
    accounts[request.body.from].balance -= request.body.amount;
    accounts[request.body.to].balance += parseInt(request.body.amount, 10);
    //console.log(accounts);
    let accountsJSON = JSON.stringify(accounts, null, 4)
    //console.log(accountsJSON);
    fs.writeFileSync(path.join(__dirname, 'json','accounts.json'), accountsJSON, 'utf8');
    response.render('transfer', {message: 'Transfer Completed'});
});

app.get('/payment', function (request, response) {
    response.render('payment', { account: accounts.credit }); 
});

app.post('/payment', (request, response) => {
    accounts.credit.balance -= request.body.amount;
    accounts.credit.available += parseInt(request.body.amount);
    let accountsJSON = JSON.stringify(accounts, null, 4)
    fs.writeFileSync(path.join(__dirname, 'json','accounts.json'), accountsJSON, 'utf8');
    response.render('payment', {message: 'Payment Successful', account: accounts.credit});
});


app.listen(3000, () => { console.log('PS Project Running on port 3000!') });