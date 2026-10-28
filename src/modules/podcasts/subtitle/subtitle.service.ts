import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import openai from "../../../config/openai.js";
import AppError from "../../../utils/AppError.js";

const execAsync = promisify(exec);


/**
 * فشرده‌سازی فایل صوتی به Opus 16kbps mono
 * (برای کاهش حجم قبل از ارسال به Whisper)
 */
const reencodeAudio = async (
  inputPath: string,
  outputPath: string
): Promise<void> => {
  await execAsync(
    `ffmpeg -i "${inputPath}" -vn -ac 1 -ar 16000 -c:a libopus -b:a 16k "${outputPath}" -y`
  );
};


const splitAudio = async (
  inputPath: string,
  outputDir: string,
  segmentTime: number = 3000
): Promise<string[]> => {
  await fs.promises.mkdir(outputDir, { recursive: true });

  await execAsync(
    `ffmpeg -i "${inputPath}" -f segment -segment_time ${segmentTime} -reset_timestamps 1 -c copy "${outputDir}/chunk_%03d.ogg" -y`
  );

  const files = await fs.promises.readdir(outputDir);

  return files
    .filter((f) => f.endsWith(".ogg"))
    .sort()
    .map((f) => path.join(outputDir, f));
};


const getAudioDuration = async (filePath: string): Promise<number> => {
  const { stdout } = await execAsync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
  );

  return parseFloat(stdout.trim());
};

const adjustSrtTimestamps = (srt: string, offsetSeconds: number): string => {
  return srt.replace(
    /(\d{2}):(\d{2}):(\d{2}),(\d{3})/g,
    (_, h, m, s, ms) => {
      const total =
        parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + offsetSeconds;
      const newH = Math.floor(total / 3600)
        .toString()
        .padStart(2, "0");
      const newM = Math.floor((total % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const newS = Math.floor(total % 60)
        .toString()
        .padStart(2, "0");

      return `${newH}:${newM}:${newS},${ms}`;
    }
  );
};



export const generatePodcastSubtitleService = async (
  audioFilePath: string,
  podcastId: string
): Promise<string> => {
  try {
    const tempDir = path.join("uploads", "podcasts", "temp", podcastId);
    const compressedPath = path.join(tempDir, "compressed.ogg");
    const chunksDir = path.join(tempDir, "chunks");

    await fs.promises.mkdir(tempDir, { recursive: true });

    await reencodeAudio(audioFilePath, compressedPath);

    const chunks = await splitAudio(compressedPath, chunksDir);

    if (chunks.length === 0) {
      throw new AppError("Failed to split audio into chunks", 500);
    }

    let fullSrt = "";
    let timeOffset = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunkPath = chunks[i];

      console.log(
        `🎙️ Processing chunk ${i + 1}/${chunks.length} for podcast ${podcastId}`
      );

      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(chunkPath),
        model: "whisper-1",
        language: "fa",
        response_format: "srt",
      });

      const adjustedSrt = adjustSrtTimestamps(
        transcription as unknown as string,
        timeOffset
      );

      fullSrt += adjustedSrt + "\n\n";

      const duration = await getAudioDuration(chunkPath);
      timeOffset += duration;
    }

    const subtitleDir = path.join("uploads", "podcasts", "subtitles");
    await fs.promises.mkdir(subtitleDir, { recursive: true });

    const subtitlePath = path.join(subtitleDir, `${podcastId}.srt`);
    await fs.promises.writeFile(subtitlePath, fullSrt, "utf-8");

    await fs.promises.rm(tempDir, { recursive: true, force: true });

    return `/uploads/podcasts/subtitles/${podcastId}.srt`;
  } catch (error) {
    console.error("Subtitle generation error:", error);

    const tempDir = path.join("uploads", "podcasts", "temp", podcastId);
    try {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    } catch {
    }

    if (error instanceof AppError) throw error;

    throw new AppError("Failed to generate podcast subtitle", 500);
  }
};