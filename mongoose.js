const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/focus-feed', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema and model
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);

// Example of saving a user
const newUser = new User({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
});

newUser.save()
    .then(() => console.log('User saved successfully'))
    .catch(err => console.error('Error saving user:', err));
