const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "tasks.json");

const addTask = (title, description) => {
  const tasks = loadTasksFromFile();
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasksToFile(tasks);
  console.log("✓ Task added successfully!\n");
  console.log(`ID: ${newTask.id}, Title: "${newTask.title}"`);
};

const getAllTasks = () => {
  return loadTasksFromFile();
};

const markTaskComplete = (taskId) => {
  const tasks = loadTasksFromFile();
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = true;
    saveTasksToFile(tasks);
    console.log(`✓ Task ${taskId} marked as complete!`);
  } else {
    console.log(`✗ Task with ID ${taskId} not found.`);
  }
};

const deleteTask = (taskId) => {
  let tasks = loadTasksFromFile();
  const initLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== taskId);
  if (tasks.length < initLength) {
    saveTasksToFile(tasks);
    console.log(`✓ Task ${taskId} deleted.`);
  } else {
    console.log(`✗ Task with ID ${taskId} not found.`);
  }
};

const saveTasksToFile = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

const loadTasksFromFile = () => {
  try {
    const tasks = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(tasks);
  } catch (error) {
    return [];
  }
};

module.exports = {
  addTask,
  getAllTasks,
  markTaskComplete,
  deleteTask,
  saveTasksToFile,
  loadTasksFromFile,
};
