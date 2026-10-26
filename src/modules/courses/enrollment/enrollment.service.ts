import prisma from "../../../config/prisma.js";
import AppError from "../../../utils/AppError.js";
import {
  findEnrollment,
  findEnrollmentById,
  createEnrollment,
  deleteEnrollment,
  findMyEnrollments,
  decrementEnrollmentCount,
} from "./enrollment.repository.js";
import { findCourseById } from "../course.repository.js";
import { findWalletByUserId } from "../../wallet/wallet.repository.js";
import { createNotificationService } from "../../notifications/notification.service.js";
import { clearCourseCache } from "../../../utils/cache.utils.js";

export const enrollInCourseService = async (
  userId: string,
  courseId: string
) => {
  try {
    const course = await findCourseById(courseId);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    const fullCourse = await prisma.course.findUnique({
      where: { id: courseId },
      select: { status: true, isFree: true, price: true },
    });

    if (!fullCourse || fullCourse.status !== "APPROVED") {
      throw new AppError("Course is not available for enrollment", 404);
    }

    const existing = await findEnrollment(userId, courseId);
    if (existing) {
      throw new AppError("You are already enrolled in this course", 409);
    }

    if (fullCourse.isFree) {
      const enrollment = await createEnrollment(userId, courseId);
      await prisma.course.update({
        where: { id: courseId },
        data: { enrollmentCount: { increment: 1 } },
      });

      await createNotificationService({
        userId: course.teacher.id,
        type: "COURSE_ENROLLED",
        title: "دانشجوی جدید",
        message: `یه دانشجو توی دوره "${course.title}" ثبت‌نام کرد`,
        data: { courseId, enrollmentId: enrollment.id },
      });

      await createNotificationService({
        userId,
        type: "PURCHASE",
        title: "ثبت‌نام موفق",
        message: `توی دوره "${course.title}" ثبت‌نام کردی`,
        data: { courseId, enrollmentId: enrollment.id },
      });

      return enrollment;
    }

    const wallet = await findWalletByUserId(userId);

    if (!wallet) {
      throw new AppError("Wallet not found. Please topup first.", 404);
    }

    if (wallet.balance < fullCourse.price) {
      throw new AppError(
        `Insufficient wallet balance. You need ${(fullCourse.price - wallet.balance).toLocaleString()} more toman.`,
        402
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: fullCourse.price } },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "PURCHASE",
          amount: -fullCourse.price,
          referenceId: courseId,
          description: `خرید دوره: ${course.title}`,
        },
      });

      const enrollment = await tx.enrollment.create({
        data: { userId, courseId },
        select: {
          id: true,
          userId: true,
          courseId: true,
          progress: true,
          enrolledAt: true,
        },
      });


      await tx.course.update({
        where: { id: courseId },
        data: { enrollmentCount: { increment: 1 } },
      });

      return enrollment;
    });


    await createNotificationService({
      userId: course.teacher.id,
      type: "COURSE_ENROLLED",
      title: "دانشجوی جدید",
      message: `یه دانشجو توی دوره "${course.title}" ثبت‌نام کرد`,
      data: { courseId, enrollmentId: result.id },
    });

    await createNotificationService({
      userId,
      type: "PURCHASE",
      title: "خرید موفق",
      message: `دوره "${course.title}" با موفقیت خریداری شد`,
      data: { courseId, enrollmentId: result.id },
    });

    await clearCourseCache()

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const getMyEnrollmentsService = async (userId: string) => {
  try {
    return await findMyEnrollments(userId);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

export const getEnrollmentByIdService = async (
  enrollmentId: string,
  userId: string
) => {
  try {
    const enrollment = await findEnrollmentById(enrollmentId);

    if (!enrollment) {
      throw new AppError("Enrollment not found", 404);
    }

    if (enrollment.userId !== userId) {
      throw new AppError("You can only view your own enrollments", 403);
    }

    return enrollment;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};

// cancle enrollment
export const cancelEnrollmentService = async (
  enrollmentId: string,
  userId: string
) => {
  try {
    const enrollment = await findEnrollmentById(enrollmentId);

    if (!enrollment) {
      throw new AppError("Enrollment not found", 404);
    }

    if (enrollment.userId !== userId) {
      throw new AppError("You can only cancel your own enrollments", 403);
    }

    await deleteEnrollment(enrollmentId);
    await decrementEnrollmentCount(enrollment.courseId);

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};