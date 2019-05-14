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
                console.log("this is result of 2nd connection: "+choice);
                
            //compare requested quantity to instock quantity
            let quantity = answer.quantity;
            let stockOnhand = choice.stock_quantity;
            console.log("this is onhand: "+stockOnhand);
            console.log("this is user requested quantity: "+quantity);
                if(parseInt(quantity)>stockOnhand) {
                    console.log("There isn't enough stock to meet your request. Try again.")
                } else {
                    //calculate quantity * price and give the total
                    //deduct quantity from stock_quantity
                    console.log("Your purchase total...");
                    //give the user option to start over again/purchase another product
                }
            });
        });
};
