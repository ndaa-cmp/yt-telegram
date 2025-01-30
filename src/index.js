require("../config.js")
const TelegramBot = require('node-telegram-bot-api');
const ytdl = require('@distube/ytdl-core');
const fs = require('node:fs');

// Ganti dengan token bot Anda dari BotFather
const token = global.token;
const bot = new TelegramBot(token, {polling: true});

// Baca cookies YouTube
const cookies = JSON.parse(fs.readFileSync('cookies.json'));

// Simpan URL video sementara
const userVideoCache = new Map();

// Handler untuk command /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Selamat datang! Kirim link YouTube untuk mendownload video atau audio.');
});

// Handler untuk URL YouTube
bot.onText(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const videoUrl = match[0];

    try {
        // Buat agent dengan cookies
        const agent = ytdl.createAgent(cookies);
        
        // Dapatkan info video
        const info = await ytdl.getInfo(videoUrl, { agent });
        const videoTitle = info.videoDetails.title;

        // Simpan URL untuk digunakan nanti
        userVideoCache.set(chatId, {
            url: videoUrl,
            title: videoTitle
        });

        // Buat inline keyboard
        const keyboard = {
            inline_keyboard: [
                [
                    { text: '🎥 Download Video', callback_data: 'video' },
                    { text: '🎵 Download Audio', callback_data: 'audio' }
                ]
            ]
        };

        // Kirim pesan dengan pilihan
        await bot.sendMessage(chatId, 
            `*${videoTitle}*\n\nPilih format yang ingin didownload:`, {
            parse_mode: 'Markdown',
            reply_markup: keyboard
        });

    } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(chatId, `Error: ${error.message}`);
    }
});

// Handler untuk callback query (pilihan user)
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const option = callbackQuery.data;
    const messageId = callbackQuery.message.message_id;

    try {
        const videoData = userVideoCache.get(chatId);
        if (!videoData) {
            throw new Error('Data video tidak ditemukan. Silakan kirim link lagi.');
        }

        // Update message to show processing
        await bot.editMessageText(`Memproses ${option === 'video' ? 'video' : 'audio'}... 🔄`, {
            chat_id: chatId,
            message_id: messageId
        });

        const agent = ytdl.createAgent(cookies);
        const fileName = `${Date.now()}.${option === 'video' ? 'mp4' : 'mp3'}`;
        const writeStream = fs.createWriteStream(fileName);

        // Set options berdasarkan pilihan
        const downloadOptions = {
            agent,
            cookies,
            quality: option === 'video' ? 'highest' : '360',
            filter: option === 'video' ? 'audioandvideo' : 'audioonly'
        };

        const download = ytdl(videoData.url, downloadOptions);

        let lastPercent = 0;
        download.on('progress', async (chunkLength, downloaded, total) => {
            const percent = Math.floor((downloaded / total) * 100);
            if (percent > lastPercent + 10) {
                lastPercent = percent;
                try {
                    await bot.editMessageText(
                        `Mendownload ${option === 'video' ? 'video' : 'audio'}: ${videoData.title}\nProgress: ${percent}% 📥`, {
                        chat_id: chatId,
                        message_id: messageId
                    });
                } catch (e) {
                    console.error('Error updating progress:', e);
                }
            }
        });

        download.pipe(writeStream);

        writeStream.on('finish', async () => {
            try {
                await bot.editMessageText(`Mengupload ke Telegram... ⬆️`, {
                    chat_id: chatId,
                    message_id: messageId
                });

                if (option === 'video') {
                    await bot.sendVideo(chatId, fileName, {
                        caption: `${videoData.title}\nRequested by: @${callbackQuery.from.username || callbackQuery.from.first_name}`
                    });
                } else {
                    await bot.sendAudio(chatId, fileName, {
                        caption: `${videoData.title}\nRequested by: @${callbackQuery.from.username || callbackQuery.from.first_name}`,
                        title: videoData.title
                    });
                }

                await bot.deleteMessage(chatId, messageId);
                fs.unlinkSync(fileName);
                userVideoCache.delete(chatId);

            } catch (error) {
                console.error('Error in finish handler:', error);
                bot.sendMessage(chatId, `Error saat upload: ${error.message}`);
            }
        });

        writeStream.on('error', async (error) => {
            console.error('Write stream error:', error);
            await bot.sendMessage(chatId, `Error saat download: ${error.message}`);
            if (fs.existsSync(fileName)) {
                fs.unlinkSync(fileName);
            }
        });

    } catch (error) {
        console.error('Callback error:', error);
        bot.answerCallbackQuery(callbackQuery.id, {
            text: `Error: ${error.message}`,
            show_alert: true
        });
    }
});

// Error handler
bot.on('error', (error) => {
    console.error('Bot error:', error);
});

console.log('Bot started! 🚀');