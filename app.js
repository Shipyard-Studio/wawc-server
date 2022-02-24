const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const cors = require('cors');

const app = express();

let whitelist = ['https://www.wristaficionado.io/', 'localhost:3000']

let corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
 

let corsOptions = {
  origin: 'https://www.wristaficionado.io/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, letious SmartTVs) choke on 204
}

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

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

// Signup Route
app.post('/signup', cors(corsOptionsDelegate), (req, res) => {

  let host = req.get('host');
  console.log(host)

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
    .then(response => res.send(response))
      
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })

})

const PORT = process.env.PORT || 5555;
app.listen(PORT, console.log(`Server started on ${PORT}`));

