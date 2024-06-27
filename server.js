// Importing required modules
const express = require("express");

// Create an Express application
const app = express();

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/webhook", (req, res) => {
  console.log("Received webhook from Jira:");
  //   console.log(req.body); // Log the entire payload for demonstration

  //   // Extract specific data from req.body as needed
  //   const { issue } = req.body;

  //   // Example: Log issue key and summary
  //   console.log(`Issue Key: ${issue.key}`);
  //   console.log(`Summary: ${issue.fields.summary}`);

  //   res.status(200).send("Webhook received successfully");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
