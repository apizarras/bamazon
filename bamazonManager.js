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

function addToInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        const stockQuantity = res.stock_quantity;
        console.log(stockQuantity);
        inquirer
          .prompt([
            {
                name: "choice",
                type: "rawlist",
                message: "Please select the product you would like to update.",
                choices: function() {
                    const choiceArray = [];
                    for(i=0;i<res.length;i++) {
                        choiceArray.push(res[i].product_name)
                    };
                    return choiceArray;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many items would you like to add to inventory?"
            }
        ]).then(function(answer) {
            let choice = answer.choice;
            const newQuantity = answer.quantity + stockQuantity;
            console.log("\nstock quantity "+newQuantity);
            console.log("\nquantity "+quantity);
            for(i=0;i<res.length;i++) {
                if(res[i].product_name===answer.choice) {
                    choice = res[i];
                    console.log(res[i]);
                    connection.query("UPDATE products SET ? WHERE ?",
                    [
                     {
                         quantity: quantity
                     }   ,
                     {
                         product_name: choice
                     }
                    ], function(err, result) {
                        console.log(result + " products updated\n");
                    });
                };
            };
        });
        showAll();
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