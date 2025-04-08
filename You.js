import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

// สร้าง Client ของบอท
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// เมื่อบอทเริ่มทำงาน
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    
    // ใส่ ID ของเซิร์ฟเวอร์และ ID ของช่องแชทที่ต้องการส่งข้อความไป
    const guildId = ''; // ID ของเซิร์ฟเวอร์
    const channelId = ''; // ID ของช่องแชทที่ต้องการส่งข้อความไป

    
    // ตัวเลือกการส่งข้อความ: 
    // true = ส่งข้อความรัวๆ
    // false = ส่งข้อความปกติ
    const isSendRapidly = true;  // เปลี่ยนค่าเป็น true หรือ false ตามต้องการ

    // ดึงข้อมูลเซิร์ฟเวอร์ (guild) จาก ID
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        console.error('ไม่พบเซิร์ฟเวอร์');
        return;
    }

    // ดึงข้อมูลช่องแชทจาก ID
    const channel = guild.channels.cache.get(channelId);
    if (!channel) {
        console.error('ไม่พบช่องแชท');
        return;
    }

    // ส่งข้อความตามตัวเลือก
    if (isSendRapidly) {
        // ส่งข้อความรัวๆ (หลายข้อความในเวลาใกล้เคียง)
        for (let i = 0; i < 1000; i++) {  // ปรับจำนวนข้อความที่ต้องการส่ง
            channel.send(`ทดสอบข้อความ ลำดับที่ ${i + 1}`).catch(console.error);
        }
        console.log('ข้อความรัวๆ ถูกส่งเรียบร้อย');
    } else {
        // ส่งข้อความปกติ (ทีละข้อความ)
        channel.send('ข้อความปกติถูกส่งเรียบร้อย').catch(console.error);
        console.log('ข้อความปกติถูกส่งเรียบร้อย');
    }
});

// เข้าสู่ระบบด้วย token
client.login(process.env.TOKEN);
