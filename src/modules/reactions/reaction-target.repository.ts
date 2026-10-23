import prisma from "../../config/prisma.js";
import type { ReactableType } from "@prisma/client";

export const reactionTargetRepository = {
    exists: async (
        targetType: ReactableType,
        targetId: string
    ): Promise<boolean> => {
        switch (targetType) {
            case "NEWS": {
                const news = await prisma.news.findUnique({
                    where: {
                        id: targetId
                    },
                    select: {
                        id: true
                    },
                });
                return Boolean(news);
            }

            case "COURSE": {
                const course = await prisma.course.findUnique({
                    where: {
                        id: targetId
                    },
                    select: {

                        id: true
                    },
                });
                return Boolean(course);
            }

            case "PODCAST": {
                const podcast = await prisma.podcast.findUnique({
                    where: {
                        id: targetId
                    },
                    select: {
                        id: true
                    },
                });
                return Boolean(podcast);
            }

            default:
                return false;
        }
    },
};