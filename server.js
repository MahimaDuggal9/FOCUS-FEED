const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/focus-feed', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

app.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Registration error:', error);  
        res.status(500).send('Registration failed: ' + error.message);  
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
