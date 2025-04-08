import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

// คำสั่งทั้งหมดที่ต้องการลงทะเบียน
const commands = [
    {
        name: 'รวมพล',
        description: 'ย้ายสมาชิกในห้องเสียงไปยังห้องที่กำหนด',
        options: [
        ]
    },
    {
        name: 'ข้อมูลผู้ใช้',
        description: 'แสดงข้อมูลพื้นฐานของผู้ใช้',
    },
    {
        name: 'ผู้เล่นออนไลน์',
        description: 'ดูรายชื่อผู้เล่นที่ออนไลน์',
    },
    {
        name: 'สเตตัสเซิร์ฟเวอร์',
        description: 'แสดงข้อมูลสถานะของเซิร์ฟเวอร์',
    },

    {
        name: 'ลบข้อความทั้งหมด',
        description: 'ลบข้อความทั้งหมดที่ประกาศจากบอท',
    },
    
    {
        name: 'ย้ายผู้ใช้ไปห้อง',
        description: 'ย้ายสมาชิกไปยังห้องที่กำหนด',
        options: [
            {
                type: 6,  // Type 6 คือ User
                name: 'สมาชิก',
                description: 'สมาชิกที่ต้องการย้าย',
                required: true
            },
            {
                type: 3,  // Type 3 คือ String
                name: 'ห้อง',
                description: 'ID ของห้องที่ต้องการย้าย',
                required: true
            }
        ]
    },
    {
        name: 'ประกาศทั้งหมด',
        description: 'แท็ก @everyone ในทุกห้องที่สามารถแชทได้',
        options: [
            {
                type: 3,  // Type 3 คือ String
                name: 'ข้อความ',
                description: 'ข้อความที่จะประกาศ',
                required: true
            },
            {
                type: 11,  // Type 11 คือ Attachment (ไฟล์)
                name: 'รูปภาพ',
                description: 'รูปภาพที่ต้องการประกาศ',
                required: false
            }
        ]
    }
];

// ลงทะเบียนคำสั่งกับ Discord API
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('เริ่มการลงทะเบียนคำสั่ง...');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands,
        });
        console.log('คำสั่งทั้งหมดถูกลงทะเบียนเรียบร้อย');
    } catch (error) {
        console.error(error);
    }
})();
