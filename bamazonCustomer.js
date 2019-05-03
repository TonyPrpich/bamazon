var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "127.0.0.1",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "deezdeez",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start()
})

function start() {
    inquirer.prompt([
        {
            type: "list",
            name: "initialOption",
            message: "What item would you like to purchase?",
            choices: ["Post an Item", "Bid on an Item", "Exit"]
        }
    ]).then(function (answer) {
        console.log(answer.initialOption);
        if (answer.initialOption === "Post an Item") {
            postItem();
        } else if (answer.initialOption === "Bid on an Item") {
            bidItem();
        } else {
            console.log("Goodbye")
            connection.end();
        }
    })
}
function postItem() {
    inquirer.prompt([
        {
            type: "input",
            name: "item",
            message: "What item would you like to sell?"
        },
        {
            type: "input",
            name: "description",
            message: "Please describe the item you are selling:"
        },
        {
            type: "input",
            name: "price",
            message: "What is the starting price for your item?"
        }
    ]).then(function (answers) {
        console.log("Creating a new listing...\n");
        connection.query(
            "INSERT INTO items SET ?",
            {
                item: answers.item,
                description: answers.description,
                StartingBid: answers.price,
                CurrentBid: answers.price
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " item inserted!\n");
                start();
            }
        )
    }
    )
}

function bidItem() {
    var itemsArray = [];
    connection.query("SELECT * FROM items", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            itemsArray.push(res[i].id.toString())
            console.log(" ID #: " + res[i].id + " Item: " + res[i].item + " Description: " + res[i].description + " Starting Bid: " + res[i].StartingBid + " Current Bid: " + res[i].CurrentBid)
        }
        inquirer.prompt([
            {
                type: "list",
                name: "itemSelect",
                message: "What item would you like to bid on?",
                choices: itemsArray
            },
            {
                type: "input",
                name: "bidAmount",
                message: "How much would you like to bid? "
            }

        ]).then(function (response) {
            var userChoice = res.find(o => o.id == response.itemSelect);
            if (userChoice.CurrentBid < response.bidAmount) {
                connection.query(
                    "UPDATE items set ? where ?",
                    [{
                        CurrentBid: response.bidAmount
                    },
                    {
                        id: response.itemSelect
                    }]


                ); console.log("Bid Successful!")
                start();
            } else {
                console.log("Please enter a higher bid.")
                bidItem();
            }
        })
    })
}