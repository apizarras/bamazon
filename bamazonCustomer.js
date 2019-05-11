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
    startStore();
}); 

//initiate app with list of products
function startStore() {
    displayAllProducts();
    // The first should ask them the ID of the product they would like to buy.
    // The second message should ask how many units of the product they would like to buy.
    
};

function displayAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        inquirer
          .prompt([
            {
                name: "choice",
                type: "rawlist",
                message: "Please select the product you would like to purchase.",
                choices: function() {
                    const choiceArray = [];
                    for(i=0;i<res.length;i++) {
                        choiceArray.push(res[i].product_name)
                    }
                    return choiceArray;
                }
            }
        ]).then(function(answer) {
            let choice;
            for(i=0;i<res.length;i++) {
                if(res[i].product_name===answer.choice) {
                    choice = res[i];
                };
            };
            inquirer
                .prompt ([
                    {
                        name: "quantity",
                        type: "input",
                        message: "How many would you like?",
                    }
                ]).then(function() {
                    checkInventory();
                })
        });
    });
};

function checkInventory(quantity) {
    //compare requested quantity to instock quantity
    if(answer.quantity>results.stock_quantity) {
        console.log("There isn't enough stock to meet your request. Try again.")
    } else {
        console.log("Your purchase total...");
    }
}
