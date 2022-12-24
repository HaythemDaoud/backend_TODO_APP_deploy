const express = require('express');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 9090;

//connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine','ejs');
app.set('view engine','html');


app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/userp', require('./routes/profileRoute'));

app.use('/api/group', require('./routes/groupeRoute'));
app.use('/api/project', require('./routes/projectRoutes'));




app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));