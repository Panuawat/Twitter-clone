import Notification from "../models/notifiction.model.js";

export const getNotifications = async (req,res) => {
    try {
        const userId = req.user._id;//สร้างตัวแปร userId เพื่อเก็บรหัสผู้ใช้ (user id) ของผู้ใช้ที่เข้าสู่ระบบ ซึ่งมาจาก req.user._id
        const notifications = await Notification.find({to:userId}) //ค้นหาการแจ้งเตือนทั้งหมดที่ถูกส่งถึงผู้ใช้ที่เข้าสู่ระบบ โดยใช้ Notification.find({ to: userId })
        .populate({
            path:'from',
            select:'username profileImg'
        })

        await Notification.updateMany({to:userId},{read:true});//ปรับปรุงสถานะการอ่านของการแจ้งเตือนทั้งหมดที่ถูกส่งถึงผู้ใช้ที่เข้าสู่ระบบให้เป็นอ่านแล้ว

        res.status(200).json(notifications)
    } catch (error) {
        console.log("Error in getNotifications function", error.message);
        res.status(500).json({error:"Internal Server Error"})
    }   
}

export const deleteNotifications = async (req,res) => {
    try {
        const userId = req.user._id;//ดึงข้อมูล ID ของผู้ใช้ที่เข้าสู่ระบบจาก req.user ซึ่งมักจะถูกกำหนดโดย middleware ก่อนหน้านี้

        await Notification.deleteMany({to:userId});//ใช้เมธอด deleteMany() เพื่อลบเอกสาร (document) ใน collection ของ Notification ที่มีฟิลด์ to เท่ากับ userId
        res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotifications function", error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}
// export const deleteNotification = async (req,res) => {
//     try {
//         const notificationId = req.params.id
//         const userId = req.user._id;
//         const notification = await Notification.findById(notificationId);

//         if (!notification) {
//             return res.status(404).json({error:"Notification not found"})
//         }
//         if (notification.to.toString() !== userId.toString()) {
//             return res.status(403).json({error:"You are not allowed to delete this notification"})
//         }

//         await Notification.findByIdAndDelete(notificationId);
//         res.status(200).json({ message:"Notification deleted successfully" })

//     } catch (error) {
//         console.log("Error in deleteNotification function", error.message);
//         res.status(500).json({error:"Internal Server Error"})
//     }
// }