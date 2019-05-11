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
};

function displayAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        for(i=0;i<res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].deparment_name + " | " + res[i].price + " | " + res[i].stock_quantity);
            console.log("\n-------------------------------------------\n");
        };
    });
};