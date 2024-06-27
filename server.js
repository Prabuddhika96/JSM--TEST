const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/webhook", async (req, res) => {
  console.log("Received webhook from Jira:");

  try {
    const { issue } = req.body;
    const issueKey = issue.key;
    const summary = issue.fields.summary;

    console.log(`issue: ${issue}`);
    // console.log(`Issue Key: ${issueKey}`);
    // console.log(`Summary: ${summary}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
});

// app.post("/issue-create", async function (req, res) {
//   const username = process.env.JIRA_USERNAME;
//   const apiToken = process.env.JIRA_API_TOKEN;
//   const domain = process.env.JIRA_DOMAIN;

//   // Base64 encode the credentials for Basic Authentication
//   const token = Buffer.from(`${username}:${apiToken}`, "utf8").toString(
//     "base64"
//   );
//   const authHeader = `Basic ${token}`;

//   const baseUrl = `https://${domain}.atlassian.net`;
//   const endpoint = `${baseUrl}/rest/api/3/issue`;

//   const data = {
//     fields: {
//       project: {
//         key: "JS",
//       },
//       summary: "Task from Node.js",
//       issuetype: {
//         name: "Task",
//       },
//     },
//   };

//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: authHeader,
//     },
//   };

//   try {
//     const response = await axios.post(endpoint, data, config);
//     console.log("Issue created:", response.data);
//     return res.status(200).send(response.data);
//   } catch (error) {
//     console.error("Error creating issue:", error.message);
//     return res.status(500).send({ error: error.message });
//   }
// });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
