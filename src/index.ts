#!/usr/bin/env node

import { Command } from "commander";
import { CommanderOptions } from "../types/types";
import fs from "fs";
import ytdl from "ytdl-core";
import cliProgress from "cli-progress";
import { sanitizeFilename } from "./utils/file-utils";

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

program.parse();

const progress = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic
);

let downloadStarted = false;

function handleDownloadProgress(
  chunkLength: number,
  downloaded: number,
  total: number
) {
  if (!downloadStarted) {
    downloadStarted = true;
    progress.start(total, 0);
  }
  progress.update(downloaded);
  if (downloaded === total) {
    progress.stop();
  }
}

async function startDownload(
  url: string,
  { filename, outputDir }: CommanderOptions
) {
  const info = await ytdl.getInfo(url);

  const videoTitle = sanitizeFilename(
    filename || info.player_response.videoDetails.title
  );
  const outputDirectory = outputDir || process.cwd();
  const outputTarget = `${outputDirectory}/${videoTitle}.mp4`;

  const viableFormats = info.formats.filter(
    (format) =>
      format.hasVideo &&
      format.hasAudio &&
      format.container === "mp4" &&
      format.width
  );
  const bestFormat = viableFormats.reduce((acc, cur) =>
    (acc.width || 0) > (cur.width || 0) ? acc : cur
  );

  if (bestFormat) {
    console.log("Identified target stream - beginning download");
  } else {
    console.error("Failed to identify target stream");
    return;
  }

  const video = ytdl.downloadFromInfo(info, { format: bestFormat });
  video.pipe(fs.createWriteStream(outputTarget));
  video.on("progress", handleDownloadProgress);
}
