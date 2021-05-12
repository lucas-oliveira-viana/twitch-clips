import axios from 'axios'
import fs from 'fs'

const CLIENT_ID = 'xg1wz0opfxtq3nkfr1ttjq5rafe2rx' 

const PARAMETERS = {
    game: 'League of Legends',
    period: 'day',
    limit: 20
}

const URLClipsLast24HoursByGame = `https://api.twitch.tv/kraken/clips/top?period=${PARAMETERS.period}&trending=true&limit=${PARAMETERS.limit}&game=${PARAMETERS.game}&language=pt-br`

console.log({ URL_CLIPS: URLClipsLast24HoursByGame })

async function download() {
    const clips = (await axios.get(URLClipsLast24HoursByGame, {
        headers: {
            'Client-ID': CLIENT_ID,
            'Accept': 'application/vnd.twitchtv.v5+json'
        }
    })).data.clips

    const videosURLS = clips.map(clip => clip.thumbnails.medium.replace('-preview-480x272.jpg', '.mp4'));

    await Promise.all(
        videosURLS.map(url => { 
            return axios.get(url, { responseType: 'stream' }) 
          }
        ))
        .then(async responses => {
            const fileNames = await Promise.all(responses.map(async response => {
                
                return new Promise((resolve, reject) => {

                    if (!fs.existsSync("videos")){
                        fs.mkdirSync("videos");
                    }

                    const path = `videos/${removeTwitchVideoPrefix(response.config.url)}`;

                    response.data.pipe(fs.createWriteStream(path))
                        .on('finish', () => {
                            resolve(path)
                            console.log('Video Downloaded!')
                        });
                })
            }))
        })
}

function removeTwitchVideoPrefix(url) {
    const TWITCH_PREFIX = 'https://clips-media-assets2.twitch.tv/';
    return url.replace(TWITCH_PREFIX, '');
}

download();