import { Worker } from "bullmq";
import redisBullMQ from "../../../config/redis-bullmq.js";
import { generatePodcastSubtitleService } from "./subtitle.service.js";
import { updatePodcast } from "../podcast.repository.js";
import { clearPodcastCache } from "../../../utils/cache.utils.js";

export const subtitleWorker = new Worker(
  "subtitle-generation",
  async (job) => {
    const { podcastId, audioFilePath } = job.data;

    console.log(`Processing subtitle for podcast: ${podcastId}`);

    try {
      const subtitleUrl = await generatePodcastSubtitleService(
        audioFilePath,
        podcastId
      );

      await updatePodcast(podcastId, { subtitleUrl });
      await clearPodcastCache();

      console.log(`Subtitle generated for podcast: ${podcastId}`);

      return { success: true, subtitleUrl };
    } catch (error) {
      console.error(`Subtitle generation failed for ${podcastId}:`, error);
      throw error;
    }
  },
  {
    connection: redisBullMQ,
    concurrency: 2,
  }
);

subtitleWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

subtitleWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});