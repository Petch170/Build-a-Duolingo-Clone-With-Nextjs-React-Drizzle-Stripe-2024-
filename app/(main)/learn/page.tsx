import FeedWrapper from "@/components/FeedWrapper";
import StickyWraper from "@/components/stickyWraper";
import UserProgress from "@/components/UserProgress";

import Header from "./header";

import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./Unit";
import { lessons, units as unitsSchema } from "@/db/schema";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const unitsData = getUnits();

  //heart :shoppage=learnpage
  const userSubscriptionData = getUserSubscription();

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription,
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    userSubscriptionData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  if (!courseProgress) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

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
          //ให้หัวใจในshop page ตรงกับ learn lage
          hasActiveSubscription={isPro}
        />

        {/* sidebar */}
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
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
