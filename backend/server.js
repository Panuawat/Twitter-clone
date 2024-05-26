import express from 'express';
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js'
import notificationRoutes from './routes/notification.route.js'
import dotenv from 'dotenv'
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';


const app = express();
const PORT = process.env.PORT || 5000
const __dirname = path.resolve()

dotenv.config()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

app.use(cookieParser())
app.use(express.json({limit:'5mb'}))// to parse req.body
// limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({extended:true}))

app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)
app.use('/api/notifications',notificationRoutes)

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});

/*
ตัวอย่างการใช้งาน

1.การตั้งค่าคุกกี้ใน response:

app.get('/set-cookie', (req, res) => {
    res.cookie('name', 'value', { maxAge: 900000, httpOnly: true });
    res.send('Cookie is set');
});
2.การอ่านคุกกี้จาก request:

app.get('/read-cookie', (req, res) => {
    const cookieValue = req.cookies.name;
    res.send(`Cookie value: ${cookieValue}`);
});
การทำงานเบื้องหลัง
เมื่อมี request มาที่ /set-cookie:

คุกกี้ชื่อ name จะถูกตั้งค่าใน response header ด้วยค่า value และมีอายุ 15 นาที (maxAge: 900000 milliseconds)
คุกกี้นี้มี httpOnly: true ซึ่งหมายความว่าจะไม่สามารถเข้าถึงคุกกี้นี้ผ่าน JavaScript ในฝั่ง client
เมื่อมี request มาที่ /read-cookie:

cookie-parser จะอ่านคุกกี้จาก request header และแปลงให้เป็น object
ค่า req.cookies.name จะมีค่าที่ตั้งไว้ (value) และส่งกลับไปใน response
*/