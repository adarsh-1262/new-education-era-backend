const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expertRoutes = require('./routes/expertRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const parentRoutes = require('./routes/parentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const subadminRoutes = require('./routes/subadminRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middlewares/errorHandler');
const enrolmentRoutes = require("./routes/enrolmentRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const progressRoutes = require("./routes/progressRoutes");
const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");



// Connect to MongoDB
connectDB();

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN, // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // Allow sending cookies and headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions))

app.use(express.json()); // Middleware to parse JSON
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

// Routes
app.use('/api/student', authRoutes);
app.use('/api/expert', expertRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subadmin', subadminRoutes);

// Use the chat routes
app.use('/api', chatRoutes);

app.use("/api/enrolments", enrolmentRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/courses", courseRoutes);

app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
