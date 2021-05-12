import fs from 'fs'
import concat from 'ffmpeg-concat'

const fileNames = fs.readdirSync("videos");

async function create() {
    await concat({
        output: `Twitch Clips ${new Date().toISOString()}.mp4`,
        videos: fileNames,
        transition: {
          name: 'fade',
          duration: 1000
        },
        frameFormat: 'png',
        tempDir: 'E:\\TempDir',
        cleanupFrames: true
    })

    console.log('Video Created!')
}