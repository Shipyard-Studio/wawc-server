const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const cors = require('cors');
var morgan = require('morgan')

const app = express();


let whitelist = ['https://www.wristaficionado.io/', 'https://www.wristaficionado.io/', 'http://www.wristaficionado.io/', 'http://www.wristaficionado.io/', 'https://wristaficionado.io/', 'https://wristaficionado.io/', 'http://wristaficionado.io/', 'http://wristaficionado.io/', 'http://localhost:3000', 'http://localhost:5555']

var corsOptions = {
  origin: 'https://www.wristaficionado.io/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}



// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'))

// Static folder
// app.use(express.static(path.join(__dirname, 'public')));

mailchimp.setConfig({
  apiKey: `${process.env.EMAIL_TOKEN}`,
  server: "us14",
});

const addMember = async (member) => {
  const response = await mailchimp.lists.batchListMembers("4f1a7fee0c", {
    members: member,
  });
  return response;
};

app.options('*', cors(corsOptions), (req, res) => {
  res.sendStatus(200)
})

// Signup Route
app.post('/signup', cors(corsOptions), (req, res) => {

  const { email } = req.body;

  // Make sure fields are filled
  if (!email) {
    res.sendStatus(401);
    return;
  }

  // Construct req data
  const data = [
      {
        email_address: email,
        status: 'subscribed',
      }
    ];

  addMember(data)
    .then(response => res.sendStatus(200))
      
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })

})

const PORT = process.env.PORT || 5555;
app.listen(PORT, console.log(`Server started on ${PORT}`));

