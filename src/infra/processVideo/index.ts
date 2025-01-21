import archiver from 'archiver';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';

console.log('Processo iniciado:');

const videoPath = path.join(__dirname, 'Marvel_DOTNET_CSHARP.mp4');
const outputFolder = path.join(__dirname, 'images/');

const ffprobePath = path.join(__dirname, 'ffprobe.exe');
const ffmpegPath = path.join(__dirname, 'ffmpeg.exe');
ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);

const createZip = () => {
  const imagesZipPath = path.join(__dirname, 'images.zip');
  const output = fs.createWriteStream(imagesZipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  output.on('close', () => {
    console.log('Processo finalizado.');
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(outputFolder, false);
  archive.finalize();
};

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

ffmpeg.ffprobe(videoPath, (err, videoInfo) => {
  if (err) {
    console.error('Error analyzing video:', err);
    return;
  }

  const { duration } = videoInfo.format;
  const interval = 20; // seconds

  let currentTime = 0;

  const processFrame = () => {
    if (currentTime >= duration) {
      createZip();
      return;
    }

    console.log(`Processando frame: ${currentTime}`);

    const outputPath = path.join(outputFolder, `frame_at_${currentTime}.jpg`);
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [currentTime],
        filename: `frame_at_${currentTime}.jpg`,
        folder: outputFolder,
        size: '1920x1080',
      })
      .on('end', () => {
        currentTime += interval;
        processFrame();
      })
      .on('error', (err) => {
        console.error('Error processing frame:', err);
      });
  };

  processFrame();
});
