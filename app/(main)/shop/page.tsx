import FeedWrapper from "@/components/FeedWrapper";
import UserProgress from "@/components/UserProgress";
import StickyWraper from "@/components/stickyWraper";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Items } from "./item";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

const ShopPage = async () => {
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
          // hasActiveSubscription={false}
          // hasActiveSubscription={!!userSubscription?.isActive} //ใช้!!แปลงค่าเป็น boolean
          hasActiveSubscription={isPro}
        />
        {/* sidebar */}
        {!isPro && <Promo />}

        <Quests points={userProgress.points} />
      </StickyWraper>
      <FeedWrapper>
        <div className=" w-full flex flex-col items-center">
          <Image src="/shop.svg" alt="Shop" height={90} width={90} />
          <h1 className=" text-center font-bold text-neutral-800 text-2xl my-6">
            shop
          </h1>
          <p className=" text-muted-foreground text-center text-lg mb-6">
            Spend your points on cool stuff.
          </p>
          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
            // hasActiveSubscription={false}
            hasActiveSubscription={isPro}
          />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ShopPage;
