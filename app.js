const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todoListDB');

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Set up EJS
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static("public"));

// Define the schema
const todoSchema = {
    name: String
};

const Todo = mongoose.model('Todo', todoSchema);

// Home route
app.get('/', async (req, res) => {
    try {
        const foundItems = await Todo.find({});
        res.render('list', { todoItems: foundItems });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving items");
    }
});

// Add new item
app.post('/', async (req, res) => {
    const newItem = new Todo({
        name: req.body.newItem
    });

    try {
        await newItem.save();  // Save new item with async/await
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving new item");
    }
});

// Delete an item
app.post('/delete', async (req, res) => {
    const itemId = req.body.checkbox;  // Get the item ID from the checkbox value

    try {
        await Todo.findByIdAndDelete(itemId);  // Use findByIdAndDelete instead of findByIdAndRemove
        console.log(`Deleted item with id: ${itemId}`);
        res.redirect('/');
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).send("Error deleting item");
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
