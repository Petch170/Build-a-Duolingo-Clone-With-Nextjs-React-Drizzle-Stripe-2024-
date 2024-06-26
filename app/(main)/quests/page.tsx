import FeedWrapper from "@/components/FeedWrapper";
import UserProgress from "@/components/UserProgress";
import { Promo } from "@/components/promo";
import StickyWraper from "@/components/stickyWraper";
import { Progress } from "@/components/ui/progress";
import { quests } from "@/constants";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";

//ย้ายไปconstanst.ts
// const quests = [
//   {
//     title: "Earn 20 XP",
//     value: 20,
//   },
//   {
//     title: "Earn 50 XP",
//     value: 50,
//   },
//   {
//     title: "Earn 100  XP",
//     value: 100,
//   },
//   {
//     title: "Earn 500 XP",
//     value: 500,
//   },
//   {
//     title: "Earn 1000 XP",
//     value: 1000,
//   },
// ];

const QuestsPage = async () => {
  const userProgressData = getUserProgress();

  //stripe
  const userSubscriptionData = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWraper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        {/* sidebar */}
        {!isPro && <Promo />}
      </StickyWraper>
      <FeedWrapper>
        <div className=" w-full flex flex-col items-center">
          <Image src="/quests.svg" alt="Quests" height={90} width={90} />
          <h1 className=" text-center font-bold text-neutral-800 text-2xl my-6">
            Quests
          </h1>
          <p className=" text-muted-foreground text-center text-lg mb-6">
            Complete quests by earning points
          </p>

          {/* add quests */}
          <ul className=" w-full">
            {quests.map((quests) => {
              const progress = (userProgress.points / quests.value) * 100;

              // console.log({ progress, value: quests.value });

              return (
                <div
                  className=" flex items-center w-full p-4 gap-x-4 border-t-2"
                  key={quests.title}
                >
                  <Image
                    src="/points.svg"
                    alt="Points"
                    width={60}
                    height={60}
                  />
                  <div className=" flex flex-col gap-y-2 w-full">
                    <p className=" text-neutral-700 text-xl font-bold">
                      {quests.title}
                    </p>
                    <Progress value={progress} className=" h-3" />
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;
