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
                };
            };
        });
    });
    // The first should ask them the ID of the product they would like to buy.
    // The second message should ask how many units of the product they would like to buy.
    
};

// function displayAllProducts() {
//     connection.query("SELECT * FROM products", function(err, res) {
//         if(err) throw err;
//         inquirer
//           .prompt([
//             {
//                 name: "choice",
//                 type: "rawlist",
//                 message: "Please select the product you would like to purchase.",
//                 choices: function() {
//                     const choiceArray = [];
//                     for(i=0;i<res.length;i++) {
//                         choiceArray.push(res[i].product_name)
//                     }
//                     return choiceArray;
//                 }
//             }
//         ]).then(function(answer) {
//             // let choice = "";
//             // console.log(res);
//             for(i=0;i<res.length;i++) {
//                 if(res[i].product_name===answer.choice) {
//                     var choice = res[i];
//                     console.log(res[i]);
//                     console.log("this is choice: " + choice);
//                 };
//             };
//         });
//     });
// };

// function askQuantity() {

// }
function checkInventory(quantity) {
    inquirer
        .prompt ([
            {
                name: "quantity",
                type: "input",
                message: "How many would you like?",
            }
        ]).then(function(answer) {
            let quantity = answer.quantity;
            let stockOnhand = res.stock_quantity;
            console.log("this is onhand: "+stockOnhand)
        });
    //compare requested quantity to instock quantity
    if(quantity>stockOnhand) {
        console.log("There isn't enough stock to meet your request. Try again.")
    } else {
        console.log("Your purchase total...");
    }
//exit connection
    connection.end();
};
