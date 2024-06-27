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
    console.log(`Issue Key: ${issueKey}`);
    console.log(`Summary: ${summary}`);

    // Example: Call Jira API to create an issue
    const jiraBaseUrl = "https://prabuddhika1996.atlassian.net";
    const createIssueUrl = `${jiraBaseUrl}/rest/api/3/issue`;

    const jiraAuth = {
      username: "prabuddhika1996@gmail.com",
      password: process.env.API_KEY, // Or use API token here
    };

    const issueData = {
      fields: {
        project: {
          key: "TT",
        },
        summary: "task from node js app",
        issuetype: {
          name: "Task",
        },
      },
    };

    const response = await axios.post(createIssueUrl, issueData, {
      auth: jiraAuth,
    });

    console.log("Issue created in Jira:", response.data);
    res
      .status(200)
      .send("Webhook received and issue created successfully in Jira");
  } catch (error) {
    console.error("Error creating issue in Jira:", error.message);
    res.status(500).send("Error processing webhook");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
