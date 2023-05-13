#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const cli_progress_1 = __importDefault(require("cli-progress"));
const file_utils_1 = require("./utils/file-utils");
const program = new commander_1.Command();
program
    .argument("<url>", "YouTube video URL to download")
    .option("-n, --filename <filename>", "Name of output video file (without extension)")
    .option("-o, --output-dir <directory>", "Target directory in which video file should be saved")
    .action(startDownload);
program.parse();
const progress = new cli_progress_1.default.SingleBar({}, cli_progress_1.default.Presets.shades_classic);
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
function startDownload(url, { filename, outputDir }) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield ytdl_core_1.default.getInfo(url);
        const videoTitle = (0, file_utils_1.sanitizeFilename)(filename || info.player_response.videoDetails.title);
        const outputDirectory = outputDir || process.cwd();
        const outputTarget = `${outputDirectory}/${videoTitle}.mp4`;
        const viableFormats = info.formats.filter((format) => format.hasVideo &&
            format.hasAudio &&
            format.container === "mp4" &&
            format.width);
        const bestFormat = viableFormats.reduce((acc, cur) => (acc.width || 0) > (cur.width || 0) ? acc : cur);
        if (bestFormat) {
            console.log("Identified target stream - beginning download");
        }
        else {
            console.error("Failed to identify target stream");
            return;
        }
        const video = ytdl_core_1.default.downloadFromInfo(info, { format: bestFormat });
        video.pipe(fs_1.default.createWriteStream(outputTarget));
        video.on("progress", handleDownloadProgress);
    });
}
//# sourceMappingURL=index.js.map