import prisma from "../../config/prisma.js";


export const reactionTargetRepository = {
    exists: async (targetType: "NEWS", targetId: string) => {
        switch (targetType) {
            case "NEWS":
                return Boolean(
                    await prisma.news.findUnique({
                        where: { id: targetId },
                        select: { id: true },
                    }),
                );
        }
    },
};