"use client";

import { createStripeUrl } from "@/actions/userSubscription";
import { refillHearts } from "@/actions/userprogress";
import { Button } from "@/components/ui/button";
import { POINTS_TO_REFILL } from "@/constants";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

// const POINTS_TO_REFILL = 10;  ย้ายไปใช้ในconstants.ts

type Props = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const Items = ({ hearts, points, hasActiveSubscription }: Props) => {
  const [pending, startTransition] = useTransition();

  const onRefillHearts = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
      return;
    }
    startTransition(() => {
      refillHearts().catch(() => toast.error);
    });
  };

  //unlimited hearts เมื่อกด upgrade hearts ในshop/page จะเด้งไปหน้า checkout stripe ส่งข้อมูลเทสจะredirect มาหน้าshop page
  const onUpgrade = () => {
    startTransition(() => {
      createStripeUrl()
        .then((response) => {
          if (response.data) {
            window.location.href = response.data;
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <ul className=" w-full">
      <div className=" flex items-center w-full p-4 gap-x-4 border-t-2">
        <Image src="/heart.svg" alt="Heart" height={60} width={60} />
        <div className=" flex-1">
          <p className=" text-neutral-700 text-base lg:text-xl font-bold">
            Refill Heart
          </p>
        </div>
        <Button
          onClick={onRefillHearts}
          disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
        >
          {hearts === 5 ? (
            "full"
          ) : (
            <div className=" flex items-center">
              <Image src="/points.svg" alt="Points" height={20} width={20} />
              {/* <p>50</p> */}
              <p>{POINTS_TO_REFILL}</p>
            </div>
          )}
        </Button>
      </div>

      {/* unlimited hearts */}
      <div className=" flex items-center w-full p-4 pt-8 gap-x-4 border-t-2">
        <Image src="/unlimited.svg" alt="Unlimited" height={60} width={60} />
        <div className=" flex-1">
          <p className=" text-neutral-700 text-base lg:text-xl font-bold">
            {" "}
            Unlimited hearts
          </p>
        </div>
        <Button onClick={onUpgrade} disabled={pending}>
          {/* {hasActiveSubscription ? "active" : "upgrade"}  // จะแจ้งerror เมื่อเปลี่ยนเป็น settings ให้ดูerror run dev ที่แจ้งเตือนในterminal*/}
          {hasActiveSubscription ? "settings" : "upgrade"}
        </Button>
      </div>
    </ul>
  );
};
