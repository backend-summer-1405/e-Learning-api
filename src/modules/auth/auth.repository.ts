import prisma from "../../config/prisma.js"

export const findUserByEmail = (email : string ) => {
    return prisma.user.findUnique({
        where : {
            email,
        }
    })
}
