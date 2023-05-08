#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import ytdl from "ytdl-core";
import cliProgress from "cli-progress";
const videoURL = "https://www.youtube.com/watch?v=J38Yq85ZoyY";

const program = new Command();

program
  .argument("<url>", "YouTube video URL to download")
  .option(
    "-n, --filename <filename>",
    "Name of output video file (without extension)"
  )
  .option(
    "-o, --output-dir <directory>",
    "Target directory in which video file should be saved"
  )
  .action(startDownload);
// .action(async (url, options) => {
//   console.log(url, options);
// });
program.parse();

const progress = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic
);

let downloadStarted = false;

function handleDownloadProgress(chunkLength, downloaded, total) {
  if (!downloadStarted) {
    downloadStarted = true;
    progress.start(total, 0);
  }
  progress.update(downloaded);
  if (downloaded === total) {
    progress.stop();
  }
}

async function getVideoTitle(videoURL) {
  // const info = await ytdl.getInfo(videoURL);
  // return info.player_response.videoDetails.title;
  const info = await ytdl.getBasicInfo(videoURL);
  return info.videoDetails.title;
}

async function startDownload(url, { filename, outputDir }) {
  const videoTitle = filename || (await getVideoTitle(url));
  const outputDirectory = outputDir || process.cwd();
  const outputTarget = `${outputDirectory}/${videoTitle}.mp4`;

  //   const viableFormats = info.formats.filter(
  //     (format) => format.hasVideo && format.hasAudio && format.container === "mp4"
  //   );
  //   const bestFormat = viableFormats.reduce((acc, cur) =>
  //     acc.width > cur.width ? acc : cur
  //   );

  // if (bestFormat) {
  //   console.log("Identified target stream - download will begin shortly");
  // } else {
  //   // handle unavailable case
  // }

  //   const video = ytdl(videoURL);

  const video = ytdl(url, {
    filter: (format) =>
      format.hasVideo && format.hasAudio && format.container === "mp4",
  });
  video.pipe(fs.createWriteStream(outputTarget));
  video.on("progress", handleDownloadProgress);
}
