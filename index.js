import fs from "fs";
import ytdl from "ytdl-core";
import cliProgress from "cli-progress";
const videoURL = "https://www.youtube.com/watch?v=J38Yq85ZoyY";

async function runDownloader() {
  const progress = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  let downloadStarted = false;

  const info = await ytdl.getInfo(videoURL);
  const videoTitle = info.player_response.videoDetails.title;

  //   const viableFormats = info.formats.filter(
  //     (format) => format.hasVideo && format.hasAudio && format.container === "mp4"
  //   );
  //   const bestFormat = viableFormats.reduce((acc, cur) =>
  //     acc.width > cur.width ? acc : cur
  //   );

  //   if (bestFormat) {
  //     console.log("Identified target stream - download will begin shortly");
  //   }

  //   const video = ytdl(videoURL);
  const video = ytdl(videoURL, {
    filter: (format) =>
      format.hasVideo && format.hasAudio && format.container === "mp4",
  });
  video.pipe(
    fs.createWriteStream(`/Users/neall/Documents/Videos/${videoTitle}.mp4`)
  );
  video.on("progress", (chunkLength, downloaded, total) => {
    if (!downloadStarted) {
      downloadStarted = true;
      progress.start(total, 0);
    }

    progress.update(downloaded);

    if (downloaded === total) {
      progress.stop();
    }
  });

  //   ytdl(videoURL, { format: bestFormat }).pipe(
  //     fs
  //       .createWriteStream(`${videoTitle}.mp4`)
  //       .on("progress", (chunk, downloaded, total) => {
  //         console.log(chunk, downloaded, total);
  //       })
  //   );

  // ytdl(videoURL).pipe(
  //   fs.createWriteStream("chapter4.mp4")
  // );
}

runDownloader();
