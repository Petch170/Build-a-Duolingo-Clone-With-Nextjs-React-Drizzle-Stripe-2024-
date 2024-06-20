import FeedWrapper from "@/components/FeedWrapper";
import StickyWraper from "@/components/stickyWraper";
import UserProgress from "@/components/UserProgress";

import Header from "./header";

import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
} from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./Unit";
import { lessons, units as unitsSchema } from "@/db/schema";

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const unitsData = getUnits();

  const [userProgress, units, courseProgress, lessonPercentage] =
    await Promise.all([
      userProgressData,
      unitsData,
      courseProgressData,
      lessonPercentageData,
    ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  if (!courseProgress) {
    redirect("/courses");
  }

  return (
    <div className=" flex flex-row-reverse gap-[48px] px-6">
      <StickyWraper>
        {/* My Sticky Sidebar */}
        <UserProgress
          // activeCourse={{ title: "spanish", imageSrc: "/es.svg" }}
          activeCourse={userProgress.activeCourse}
          // hearts={5}
          hearts={userProgress.hearts}
          // points={100}
          points={userProgress.points}
          // hasActiveSubscription={false}
          hasActiveSubscription={false}
        ></UserProgress>
      </StickyWraper>
      <FeedWrapper>
        {/* My Feeed learn layout */}
        {/* <Header title="Spanish" /> */}
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className=" mb-10">
            {/* {JSON.stringify(unit)} */}
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              // activeLesson={undefined}
              activeLesson={
                courseProgress.activeLesson as
                  | (typeof lessons.$inferSelect & {
                      unit: typeof unitsSchema.$inferSelect;
                    })
                  | undefined
              }
              // activeLessonPercentage={0}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
