// Importing required modules
const express = require("express");
const bodyParser = require("body-parser"); // Import body-parser to handle JSON payloads

// Create an Express application
const app = express();

// Use body-parser middleware to parse JSON payloads
app.use(bodyParser.json());

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/webhook", (req, res) => {
  console.log("Received webhook from Jira:");

  // Log the entire payload for demonstration
  console.log("req.body: ", req.body);

  // Extract specific data from req.body as needed
  const { issue } = req.body;

  // Example: Log issue key and summary
  const issueKey = issue.key;
  const summary = issue.fields.summary;
  console.log(`Issue Key: ${issueKey}`);
  console.log(`Summary: ${summary}`);

  // Store the summary in a variable
  const issueSummary = summary;

  // Send a response
  res.status(200).send("Webhook received successfully");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
