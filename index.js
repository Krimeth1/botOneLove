import { Client, GatewayIntentBits, Events, ChannelType } from 'discord.js'; 
import dotenv from 'dotenv'; 
dotenv.config();

// สร้าง Client ของบอท
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

// กำหนดเมื่อบอทเริ่มทำงาน
client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// ฟังก์ชันสำหรับคำสั่ง
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    // ส่งข้อมูลการใช้งานให้คุณในแชทส่วนตัว
    const logChannel = client.channels.cache.get('1359227037092675704'); 
    if (!logChannel) {
        console.error('ไม่พบช่องที่มี ID นี้');
    } else {
        logChannel.send(`ผู้ใช้ <@${interaction.user.id}> ใช้คำสั่ง ${interaction.commandName}`);
    }
    
    // ส่งข้อมูลผู้ใช้ในแชทส่วนตัวของคุณ
    const user = await client.users.fetch(process.env.ADMIN_USER_ID); // กำหนด ID ของคุณ
    if (user) {
        user.send(`ข้อมูลการใช้งานจากผู้ใช้ ${interaction.user.tag}:\nคำสั่งที่ใช้: ${interaction.commandName}`);
    }

    // สำหรับคำสั่ง "รวมพล"
    if (interaction.commandName === 'รวมพล') {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: 'คุณต้องอยู่ในห้องเสียงก่อน!', flags: 64 });
        }

        const members = voiceChannel.members;
        const targetChannelId = '1358757355306614928'; // แก้ไอดีห้องเอง
        const targetChannel = interaction.guild.channels.cache.get(targetChannelId);

        if (!targetChannel || targetChannel.type !== ChannelType.GuildVoice) { // ตรวจสอบห้องเสียง
            return interaction.reply({ content: 'ไม่พบห้องเสียงเป้าหมาย', flags: 64 });
        }

        for (const [memberId, member] of members) {
            try {
                console.log(`กำลังย้าย ${member.user.tag} ไปห้อง ${targetChannel.name}`);
                await member.voice.setChannel(targetChannel);
            } catch (error) {
                console.error(`ไม่สามารถย้าย ${member.user.tag} ไปห้อง ${targetChannel.name}`, error);
                await interaction.reply({ content: `ไม่สามารถย้าย ${member.user.tag} ไปห้อง ${targetChannel.name}`, flags: 64 });
            }
        }

        await interaction.reply({ content: `ดึงทุกคนไปห้อง <#${targetChannelId}> เรียบร้อยแล้ว!`, flags: 64 });
    }
    //ประกาศทั้งหมด
    if (interaction.commandName === 'ประกาศทั้งหมด') {
        const message = interaction.options.getString('ข้อความ');  // ข้อความที่จะประกาศ
        const image = interaction.options.getAttachment('รูปภาพ');  // รูปภาพ (ถ้ามี)
    
        if (!message) {
            return interaction.reply({ content: 'โปรดใส่ข้อความที่ต้องการประกาศ!', flags: 64 });
        }
    
        const textChannels = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText);  // ค้นหาช่องแชทข้อความ
    
        textChannels.forEach(channel => {
            channel.send(message);  // ส่งข้อความไปยังทุกช่องแชท
    
            // ถ้ามีไฟล์รูปภาพ
            if (image) {
                channel.send({ content: message, files: [image] });
            }
        });
    
        await interaction.reply({ content: 'ประกาศไปยังทุกช่องแชทแล้ว!', flags: 64 });
    }
    


        if (interaction.commandName === 'ลบข้อความทั้งหมดจากบอท') {
    // ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการลบข้อความ
    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
        return interaction.reply({ content: 'คุณไม่มีสิทธิ์ในการลบข้อความ!', flags: 64 });
    }

    // ค้นหาช่องแชทที่ผู้ใช้เรียกคำสั่ง
    const channel = interaction.channel;

    // ดึงข้อความทั้งหมดในช่องแชท (สูงสุด 100 ข้อความ)
    try {
        const messages = await channel.messages.fetch({ limit: 100 });

        // กรองเฉพาะข้อความที่ถูกส่งจากบอท
        const botMessages = messages.filter(msg => msg.author.id === client.user.id);

        if (botMessages.size > 0) {
            await channel.bulkDelete(botMessages);
            await interaction.reply({ content: 'ลบข้อความทั้งหมดจากบอทแล้ว!', flags: 64 });
        } else {
            await interaction.reply({ content: 'ไม่พบข้อความของบอทในช่องนี้', flags: 64 });
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'ไม่สามารถลบข้อความได้', flags: 64 });
    }
}

if (interaction.commandName === 'ลบข้อความทั้งหมด') {
    // ค้นหาทุกช่องแชทในเซิร์ฟเวอร์ที่เป็นข้อความ
    const textChannels = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText);

    // ลบข้อความของบอทในทุกช่องแชท
    textChannels.forEach(async (channel) => {
        try {
            // ดึงข้อความทั้งหมดในช่องแชท (สูงสุด 100 ข้อความ)
            const messages = await channel.messages.fetch({ limit: 100 });

            // กรองเฉพาะข้อความที่มาจากบอท
            const botMessages = messages.filter(msg => msg.author.id === client.user.id);

            if (botMessages.size > 0) {
                // ลบข้อความของบอท
                await channel.bulkDelete(botMessages, true); // true: ลบข้อความเก่ากว่า 14 วันได้
                console.log(`ลบข้อความจากบอทในช่อง ${channel.name}`);
            } else {
                console.log(`ไม่พบข้อความของบอทในช่อง ${channel.name}`);
            }
        } catch (error) {
            console.error(`ไม่สามารถลบข้อความในช่อง ${channel.name}:`, error);
        }
    });

    await interaction.reply({ content: 'ลบข้อความทั้งหมดจากบอทในทุกช่องแชทแล้ว!', flags: 64 });
}



    // คำสั่งสำหรับดูสถานะของเซิร์ฟเวอร์
    if (interaction.commandName === 'สเตตัสเซิร์ฟเวอร์') {
        const memberCount = interaction.guild.memberCount;
        const channelCount = interaction.guild.channels.cache.filter(ch => ch.type === ChannelType.GuildVoice).size;
        await interaction.reply({ content: `เซิร์ฟเวอร์นี้มีสมาชิกทั้งหมด: ${memberCount} คน และห้องเสียงเปิดใช้งาน ${channelCount} ห้อง`, flags: 64 });
    }

    // คำสั่งแสดงข้อมูลผู้ใช้
    if (interaction.commandName === 'ข้อมูลผู้ใช้') {
        const member = interaction.guild.members.cache.get(interaction.user.id);
        const memberInfo = `
        ชื่อผู้ใช้: ${member.user.tag}
        ยศ: ${member.roles.highest.name}
        เวลาที่ออนไลน์: ${member.presence ? member.presence.status : 'ไม่ออนไลน์'}
        จำนวนโพสต์ล่าสุด: ${member.user.createdAt.toLocaleString()}
        `;
        await interaction.reply({ content: memberInfo, flags: 64 });
    }

    // คำสั่งดูผู้เล่นที่ออนไลน์
    if (interaction.commandName === 'ผู้เล่นออนไลน์') {
        const onlineMembers = interaction.guild.members.cache.filter(member => member.presence && member.presence.status !== 'offline');
        const onlineList = onlineMembers.map(member => `${member.user.tag}`).join('\n');
        await interaction.reply({ content: `ผู้เล่นที่ออนไลน์:\n${onlineList}`, flags: 64 });
    }

    // คำสั่งย้ายผู้ใช้ไปห้อง
    if (interaction.commandName === 'ย้ายผู้ใช้ไปห้อง') {
        const targetUser = interaction.options.getUser('สมาชิก');  // สมาชิกที่ต้องการย้าย
        const targetChannelId = interaction.options.getString('ห้อง');  // ID ห้องที่ต้องการย้าย
        const targetChannel = interaction.guild.channels.cache.get(targetChannelId);

        if (!targetChannel || targetChannel.type !== ChannelType.GuildVoice) { // ตรวจสอบว่า targetChannel เป็นห้องเสียง
            return interaction.reply({ content: 'ไม่พบห้องเสียงเป้าหมาย', flags: 64 });
        }

        const member = interaction.guild.members.cache.get(targetUser.id);  // นำ ID ของผู้ใช้มารับข้อมูลสมาชิก
        if (!member.voice.channel) {
            return interaction.reply({ content: 'สมาชิกที่แท็กต้องอยู่ในห้องเสียงก่อน!', flags: 64 });
        }

        try {
            await member.voice.setChannel(targetChannel);
            await interaction.reply({ content: `ย้ายสมาชิก <@${targetUser.id}> ไปห้อง <#${targetChannelId}> เรียบร้อยแล้ว!`, flags: 64 });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'ไม่สามารถย้ายผู้ใช้ได้', flags: 64 });
        }
    }
});

// เข้าสู่ระบบด้วย token
client.login(process.env.TOKEN);
