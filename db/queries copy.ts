// import { cache } from "react";

// import { auth } from "@clerk/nextjs/server";
// import { eq } from "drizzle-orm";
// import db from "@/db/drizzle";

// import {
//   challengeProgress,
//   courses,
//   lesson,
//   units,
//   userProgress,
// } from "@/db/schema";

// export const getCourses = cache(async () => {
//   const data = await db.query.courses.findMany();
//   return data;
// });

// export const getUnits = cache(async () => {
//   const { userId } = await auth();
//   const userProgress = await getUserProgress();

//   if (!userId || !userProgress?.activeCourseId) {
//     return [];
//   }

//   //ตรวจสอบและยืนยันว่าจำเป็นต้องมีหมายเลขคำสั่งซื้อไหม
//   const data = await db.query.units.findMany({
//     where: eq(units.coursesId, userProgress.activeCourseId),
//     with: {
//       lesson: {
//         with: {
//           challenges: {
//             with: {
//               challengeProgress: {
//                 where: eq(challengeProgress.userId, userId),
//               },
//             },
//           },
//         },
//       },
//     },
//   });
//   const normalizeData = data.map((unit) => {
//     const lessonWithCompletedStatus = unit.lesson.map((lessons) => {
//       const allCompletedChallenges = lessons.challenges.every((challenge) => {
//         return (
//           challenge.challengeProgress &&
//           challenge.challengeProgress.length > 0 &&
//           challenge.challengeProgress.every((progress) => progress.completed)
//         );
//       });
//       return { ...lessons, completed: allCompletedChallenges };
//     });

//     //เช็คตรงนี้ ใส่unit กับ units
//     return { ...unit, lesson: lessonWithCompletedStatus };
//   });
//   return normalizeData;
// });

// export const getUserProgress = cache(async () => {
//   const { userId } = await auth();
//   if (!userId) {
//     return null;
//   }
//   const data = await db.query.userProgress.findFirst({
//     where: eq(userProgress.userId, userId),
//     with: {
//       activeCourse: true,
//     },
//   });
//   return data;
// });

// export const getCourseById = cache(async (courseId: number) => {
//   const data = await db.query.courses.findFirst({
//     where: eq(courses.id, courseId),
//     //ดึงข้อมูลเกี่ยวกับ บทเรียน และหน่วยเรียน
//   });
//   return data;
// });

// export const getCourseProgress = cache(async () => {
//   const { userId } = await auth();
//   //ดึงข้อมูลความคืบหน้าของผู้ใช้จาก func getUserProgress
//   const userProgress = await getUserProgress();
//   if (!userId || !userProgress?.activeCourseId) {
//     return null;
//   }

//   const unitsInActiveCourse = await db.query.units.findMany({
//     orderBy: (units, { asc }) => [asc(units.order)],
//     where: eq(units.coursesId, userProgress.activeCourseId),
//     with: {
//       lesson: {
//         orderBy: (lesson, { asc }) => [asc(lesson.order)],
//         with: {
//           unit: true,
//           challenges: {
//             with: {
//               challengeProgress: {
//                 where: eq(challengeProgress.userId, userId),
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   //เปลี่ยนจากflatMap((units) => units.lesson).find((lesson)
//   const firstUncompletedLesson = unitsInActiveCourse
//     .flatMap((unit) => unit.lesson)
//     .find((lessons) => {
//       //ถ้ามีบางอย่างใช้งานไม่ได้ให้ตรวจสอบส่วนสุดท้าย
//       return lessons.challenges.some((challenge) => {
//         return (
//           !challenge.challengeProgress ||
//           challenge.challengeProgress.length === 0 ||
//           challenge.challengeProgress.some(
//             (progress) => progress.completed === false
//           )
//         );
//       });
//     });
//   return {
//     activeLesson: firstUncompletedLesson,
//     activeLessonId: firstUncompletedLesson?.id,
//   };
// });

// export const getLesson = cache(async (id?: number) => {
//   const { userId } = await auth();

//   if (!userId) {
//     return null;
//   }

//   const CourseProgress = await getCourseProgress();

//   const lessonId = id || CourseProgress?.activeLessonId;

//   if (!lessonId) {
//     return null;
//   }

//   const data = await db.query.lesson.findFirst({
//     where: eq(lesson.id, lessonId),
//     with: {
//       challenges: {
//         orderBy: (challenges, { asc }) => [asc(challenges.order)],
//         with: {
//           challengeOptions: true,
//           challengeProgress: {
//             where: eq(challengeProgress.userId, userId),
//           },
//         },
//       },
//     },
//   });

//   if (!data || !data.challenges) {
//     return null;
//   }

//   const normalizeChallenges = data.challenges.map((challenge) => {
//     //ถ้ามีบางอย่างใช้งานไม่ได้ให้ตรวจสอบส่วนสุดท้าย
//     const completed =
//       challenge.challengeProgress &&
//       challenge.challengeProgress.length > 0 &&
//       challenge.challengeProgress.every((progress) => progress.completed);

//     return { ...challenge, completed };
//   });
//   return { ...data, challenges: normalizeChallenges };
// });

// export const getLessonPercentage = cache(async () => {
//   const courseProgress = await getCourseProgress();

//   if (!courseProgress?.activeLessonId) {
//     return 0;
//   }

//   const lesson = await getLesson(courseProgress.activeLessonId);

//   if (!lesson) {
//     return 0;
//   }
//   const completedChallenges = lesson.challenges.filter(
//     (challenge) => challenge.completed
//   );
//   const percentage = Math.round(
//     (completedChallenges.length / lesson.challenges.length) * 100
//   );
//   return percentage;
// });
