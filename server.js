const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee1"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    askQuestions();
});

function askQuestions() {
    inquirer.prompt({
        message: "what would you like to do?",
        type: "list",
        choices: [
            // Choice to add an employee
            "add employee",
            // Choice to view all employees
            "view all employees",
            // Choice to add a department
            "add department",
            // Choice to view all departments
            "view all departments",
            // Choice to add a role
            "add role",
            // Choice to exit
            "Exit"
        ],
        name: "choice"
    }).then(answers => {
        console.log(answers.choice);
        switch (answers.choice) {

            case "view all departments":
                viewDepartments()
                break;

            case "add employee":
                addEmployee()
                break;

            case "add department":
                addDepartment()
                break;

            case "view all departments":
                viewDepartments()
                break;

            case "add role":
                addRole()
                break;

            case "view all employees":
                viewEmployees()
                break;

            case "update employee role":
                updateEmployeeRole();
                break;

            default:
                connection.end()
                break;
        }
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (_err, data) {
        console.table(data);
        askQuestions();
    })
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (_err, data) {
        console.table(data);
        askQuestions();
    })
}

function addEmployee() {
    inquirer.prompt([{
            type: "input",
            name: "firstN",
            message: "first name?"
        },
        {
            type: "input",
            name: "lastN",
            message: "last name?"
        },
        {
            type: "number",
            name: "roleNum",
            message: "employees role number?"
        },
        {
            type: "number",
            name: "managerNum",
            message: "manager's role number?"
        }
    ]).then(function(res) {
        connection.query('INSERT INTO employee (firstN, lastN, roleNum, managerNum) VALUES (?, ?, ?, ?)', [res.firstName, res.lastName, res.roleId, res.managerId], function(err, _data) {
            if (err) throw err;
            console.table("Success!");
            askQuestions();
        })
    })
}

function addDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "department",
        message: "What is the name of the department you want to add?"
    }, ]).then(function(res) {
        connection.query('INSERT INTO department (name) VALUES (?)', [res.department], function(err, _data) {
            if (err) throw err;
            console.table("Success!");
            askQuestions();
        })
    })
}

function addRole() {
    inquirer.prompt([
        {
            message: "title?",
            type: "input",
            name: "title"
        }, {
            message: "salary?",
            type: "number",
            name: "salary"
        }, {
            message: "Department number?",
            type: "number",
            name: "departmentNum"
        }
    ]).then(function (response) {
        connection.query("INSERT INTO roles (title, salary, departmentNum) values (?, ?, ?)", [response.title, response.salary, response.departmentNum], function (_err, data) {
            console.table(data);
        })
        askQuestions();
    })

}
