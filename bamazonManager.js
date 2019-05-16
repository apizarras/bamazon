require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASS,
    database: "bamazon_db"
});

connection.connect(function(err) {
    if(err) throw err;
    console.log("connected as id: "+connection.threadId);
    startManagerApp();
}); 

function startManagerApp() {
    inquirer
        .prompt ([
            {
                name: "action",
                type: "list",
                message: "Please select an option.\n",
                choices: ["View All", "View Low Inventory", "Add To Inventory", "Add New Product"]
            }
        ]).then(function(answer){
            if(answer.action==="View All") {
                showAll();
            } else 
            if (answer.action==="View Low Inventory") {
                viewLowInventory();
            } else
            if(answer.action==="Add To Inventory") {
                addToInventory();
            } else
            if (answer.action==="Add New Product") {
                addNewProduct();
            } else {
                askNext();
            };
        });
};

function showAll() {
    connection.query("SELECT * FROM PRODUCTS", function(err, res) {
        if(err) throw err;
        console.log("ID | Product Name | Department | Price | Stock On Hand\n")
        for(i=0; i<res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        };
    });
};

function viewLowInventory() {
    connection.query("SELECT * FROM PRODUCTS WHERE stock_quantity <= 5",
        function(err, res) {
            if(err) throw err;
            console.log("ID | Product Name | Department | Price | Stock On Hand\n")
            for(i=0; i<res.length; i++) {
                console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
            };
    });
};

function addNewProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the product you would like to add?"
        },
        {
            name: "department",
            type: "input",
            message: "What is the department that the product belongs?"
        },
        {
            name: "price",
            type: "input",
            message: "What is the price for the product?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units of the new product are there?"
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO products SET ?",
        {
            product_name: answer.name,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.quantity
        },
        function(err) {
            if(err) throw err;
            showAll();
        });
    });
};

function askNext() {
    inquirer.prompt ([
        {
            name: "name",
            type: "confirm",
            message: "Would you like to continue or exit?",
        }
    ]).then(function(choice) {
        if(choice.name) {
            startManagerApp();
        } else {
            connection.end();
        };
    });
};