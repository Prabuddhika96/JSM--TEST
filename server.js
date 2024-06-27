require("dotenv").config();
const express = require("express");
const { createTask } = require("./create-task-util");
const app = express();

app.use(express.json());

app.post("/webhook", async (req, res) => {
  console.log("Received webhook from Jira:");

  const { issue, webhookEvent } = req.body;

  if (
    webhookEvent !== "jira:issue_created" &&
    webhookEvent !== "jira:issue_updated"
  ) {
    return res.status(200).send("Event not handled");
  }

  const projectKey = issue.fields.project.key;

  // check project key
  if (projectKey !== "JI") {
    return res.status(200).send("Project not handled");
  }

  const summary = issue.fields.summary;

  const taskData = {
    fields: {
      project: {
        key: "JS4",
      },
      summary: summary,
      issuetype: {
        name: "Task",
      },
      customfield_1: issueKey,
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
