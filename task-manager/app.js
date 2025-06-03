const http = require("http");
const {
  addTask,
  getAllTasks,
  markTaskComplete,
  deleteTask,
} = require("./taskManager");

const server = () => {
  const port = 8080;

  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Welcome to the Task Manager!");
    } else if (req.method === "GET" && req.url === "/tasks") {
      const tasks = getAllTasks();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(tasks));
    } else if (req.method === "POST" && req.url === "/tasks") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          const { title, description } = JSON.parse(body);
          addTask(title, description);
          res.writeHead(201);
          res.end("Task added!");
        } catch (err) {
          res.writeHead(400);
          res.end("Invalid JSON");
        }
      });
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  server.listen(port, () => {
    console.log("Server running on http://localhost:8080");
  });
};

const userInput = process.argv.slice(2);
const userCommand = userInput[0];

switch (userCommand) {
  case "add":
    addTask(userInput[1], userInput[2]);
    break;
  case "list":
    const tasks = getAllTasks();
    console.log("=== Your Tasks ===\n");
    tasks.forEach((task) => {
      const status = task.completed ? "Completed ✓" : "Pending";
      console.log(
        `[${task.id}] ${task.title} (${status})\n  Description: ${
          task.description
        }\n  Created: ${new Date(task.createdAt).toLocaleString()}\n`
      );
    });
    break;
  case "complete":
    markTaskComplete(parseInt(userInput[1]));
    break;
  case "delete":
    deleteTask(parseInt(userInput[1]));
    break;
  case "server":
    server();
    break;
  default:
    console.log("Invalid command.");
}
