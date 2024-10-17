import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());

const users = [{ id: 1, username: 'manish', password: 'manish@123' }];

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Hey buddy::::${username}, your password is ${password}`);
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Create a token
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }

    return res.status(401).send('Invalid credentials');
});

// Protected route
app.get('/protected', (req, res) => {
    console.log("Authorization :::::"+req.headers);
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).send('Access denied');
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }

        res.send('This is a protected route');
    });
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
