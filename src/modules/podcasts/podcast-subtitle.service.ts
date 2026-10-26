import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import openai from "../../config/openai.js";
import AppError from "../../utils/AppError.js";

// with ai

const execAsync = promisify(exec);

const reencodeAudio = async (inputPath: string, outputPath: string) => {
  await execAsync(
    `ffmpeg -i "${inputPath}" -vn -ac 1 -ar 16000 -c:a libopus -b:a 16k "${outputPath}" -y`
  );
};

const splitAudio = async (
  inputPath: string,
  outputDir: string,
  segmentTime: number = 3000
) => {
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
      const newH = Math.floor(total / 3600).toString().padStart(2, "0");
      const newM = Math.floor((total % 3600) / 60).toString().padStart(2, "0");
      const newS = Math.floor(total % 60).toString().padStart(2, "0");
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

    let fullSrt = "";
    let timeOffset = 0;

    for (const chunkPath of chunks) {
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
    throw new AppError("Failed to generate podcast subtitle", 500);
  }
};