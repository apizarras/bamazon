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
    // The first should ask them the ID of the product they would like to buy.
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
                    };
                    return choiceArray;
                }
            }
        ]).then(function(answer) {
            let choice;
            // console.log(res);
            for(i=0;i<res.length;i++) {
                if(res[i].product_name===answer.choice) {
                    choice = res[i];
                    console.log(res[i]);
                    console.log("this is choice: " + choice.product_name);
                    console.log("")
                };
            };
            // The second message should ask how many units of the product they would like to buy.
            checkInventory(choice);
        });
    });
};

function checkInventory(choice) {
    inquirer
        .prompt ([
            {
                name: "quantity",
                type: "input",
                message: "How many would you like?",
            }
        ]).then(function(answer) {
            connection.query("SELECT * FROM products WHERE product_name=?", [choice], function(err, res) {
            //compare requested quantity to instock quantity
            const quantity = Number(answer.quantity);
            const stockOnhand = choice.stock_quantity;
            const price = choice.price;
            // console.log("this is onhand: "+stockOnhand);
            // console.log("You have selected a quantity of: "+quantity);
            console.log(typeof quantity);
                if(quantity>stockOnhand) {
                    console.log("There isn't enough stock to meet your request. Try again.");
                    startOver();
                } else {
                    //calculate quantity * price and give the total
                    // console.log(quantity);
                    // console.log(price);
                    const total = quantity * price;
                    //deduct quantity from stock_quantity
                    console.log("Your purchase total is: $" + total);
                    const newStockOnhand = stockOnhand - quantity;
                    console.log("Updating inventory count");
                    const query = connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newStockOnhand
                        },
                        {
                            product_name: choice.product_name
                        }
                    ],
                    function(err,res) {
                        console.log(res.affectedRows + " product updated!\n");
                    });
                    console.log(query.sql);
                    //give the user option to start over again/purchase another product
                    startOver();
                }
            });
        });
};

function startOver() {
    inquirer
        .prompt ([
            {
                name: "name",
                type: "confirm",
                message: "Would you like to purchase another product?",
            }
        ]).then(function(answer) {
            if(answer.name) {
                startStore();
            } else {
                connection.end();
            };
        });
};