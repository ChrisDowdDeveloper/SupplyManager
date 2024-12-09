require("dotenv").config(); // Load environment variables
const { PORT = 8080 } = process.env;
const app = require("./app");

function listener() {
  console.log(`Listening on Port ${PORT}!`);
}

// Start the server
app.listen(PORT, listener);
