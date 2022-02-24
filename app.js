const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { runMain } = require('module');

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

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
app.post('/signup', (req, res) => {
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

