const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

// 路由文件
const users = require('./routes/users');
const assessments = require('./routes/assessments');
const consultants = require('./routes/consultants');
const bookings = require('./routes/bookings');
const activities = require('./routes/activities');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/v1/users', users);
app.use('/api/v1/assessments', assessments);
app.use('/api/v1/consultants', consultants);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/activities', activities);

// 根路由
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
