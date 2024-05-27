import jwt from "jsonwebtoken";

//สร้าง token ด้วย jwt.sign() โดยใช้ข้อมูล { userId } ซึ่งถูกเข้ารหัสใน token โดยใช้ process.env.JWT_SECRET เป็นคีย์ลับ และกำหนดให้ token มีอายุเป็น 15 วัน (หรือ 15 วันนับจากวันที่สร้าง token)
export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  // คุกกี้ชื่อ jwt ที่มีค่าเป็น JWT ที่สร้างขึ้น จะถูกตั้งค่าใน response header เพื่อส่งกลับไปยังผู้ใช้
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //15วัน
    httpOnly: true, //httpOnly: true ระบุว่า cookie จะถูกส่งกลับไปยังเซิร์ฟเวอร์เท่านั้น และไม่สามารถเข้าถึงได้ผ่าน JavaScript ซึ่งมีไว้เพื่อป้องกันการโจมตี XSS (Cross-Site Scripting)
    sameSite: "strict", //sameSite: "strict" ระบุว่า cookie จะส่งไปยังเซิร์ฟเวอร์เฉพาะในเครื่องเดียวกันเท่านั้น ซึ่งมีไว้เพื่อป้องกันการโจมตี CSRF (Cross-Site Request Forgery)
    secure: process.env.NODE_ENV !== "development", //ระบุว่า cookie จะถูกส่งไปยังเซิร์ฟเวอร์ที่มีการเชื่อมต่อด้วย HTTPS เท่านั้น ในระบบการพัฒนาจะไม่ใช้ HTTPS เนื่องจากใช้การเชื่อมต่อแบบ HTTP ดังนั้น cookie จะไม่ถูกส่งกลับไปยังเซิร์ฟเวอร์ ซึ่งมีไว้เพื่อป้องกันการรั่วไหลข้อมูลที่อาจเกิดขึ้นในระหว่างการพัฒนาโดยไม่ใช้ HTTPS
  });
};
/*

ภาพรวมการทำงาน

1.เมื่อผู้ใช้ลงชื่อเข้าใช้หรือสมัครสมาชิกสำเร็จ ฟังก์ชัน generateTokenAndSetCookie จะถูกเรียก
2.JWT จะถูกสร้างขึ้นด้วยข้อมูล userId และ secret key ที่กำหนดในสภาพแวดล้อม
3.JWT จะถูกตั้งค่าในคุกกี้ชื่อ jwt พร้อมกับ option ต่าง ๆ เพื่อเพิ่มความปลอดภัย
4.คุกกี้จะถูกส่งกลับไปยังผู้ใช้ และสามารถใช้ในการตรวจสอบสิทธิ์ (authentication) ในการร้องขอครั้งต่อ ๆ ไป

*/
