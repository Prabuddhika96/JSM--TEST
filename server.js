require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const createTask = async (issueData) => {
  const username = process.env.JIRA_USERNAME;
  const apiToken = process.env.JIRA_API_TOKEN;
  const domain = process.env.JIRA_DOMAIN;

  // Base64 encode the credentials for Basic Authentication
  const token = Buffer.from(`${username}:${apiToken}`, "utf8").toString(
    "base64"
  );
  const authHeader = `Basic ${token}`;

  const baseUrl = `https://${domain}.atlassian.net`;
  const endpoint = `${baseUrl}/rest/api/3/issue`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
  };

  try {
    const response = await axios.post(endpoint, issueData, config);
    console.log("Issue created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating issue:", error.message);
    throw error;
  }
};

app.post("/webhook", async (req, res) => {
  console.log("Received webhook from Jira:");

  const { issue, webhookEvent } = req.body;

  // Ensure webhook event is of interest, e.g., issue created or updated
  if (
    webhookEvent !== "jira:issue_created" &&
    webhookEvent !== "jira:issue_updated"
  ) {
    return res.status(200).send("Event not handled");
  }

  const projectKey = issue.fields.project.key;

  // Ensure the project key is the one you're interested in
  if (projectKey !== "JI") {
    // replace with your actual service project key
    return res.status(200).send("Project not handled");
  }

  const issueKey = issue.key;
  const summary = issue.fields.summary;

  const taskData = {
    fields: {
      project: {
        key: "JS4", // Your target project key
      },
      summary: summary,
      issuetype: {
        name: "Task",
      },
      // customfield_XXXXX: issueKey, // Replace XXXXX with your actual custom field ID
    },
  };

  try {
    const response = await createTask(taskData);
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// --------------------------------------------------------

// const express = require("express");
// const bodyParser = require("body-parser");
// const axios = require("axios");
// const { createTask } = require("./create-task-util");
// require("dotenv").config();

// const app = express();
// app.use(bodyParser.json());

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// app.post("/webhook", async (req, res) => {
//   console.log("Received webhook from Jira:");

//   const { issue } = req.body;
//   const issueKey = issue.key;
//   const summary = issue.fields.summary;

//   const taskData = {
//     fields: {
//       project: {
//         key: "JS3",
//       },
//       summary: summary,
//       issuetype: {
//         name: "Task",
//       },
//     },
//   };

//   const data = {
//     fields: {
//       project: {
//         key: "JS3",
//       },
//       summary: "Task from Node.js",
//       issuetype: {
//         name: "Task",
//       },
//     },
//   };

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

// app.post("/issue-create", async function (req, res) {
//   const username = process.env.JIRA_USERNAME;
//   const apiToken = process.env.JIRA_API_TOKEN;
//   const domain = process.env.JIRA_DOMAIN;

//   console.log("API token : ".apiToken);

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
//         key: "JS3",
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

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// --------------------------------------------------------
