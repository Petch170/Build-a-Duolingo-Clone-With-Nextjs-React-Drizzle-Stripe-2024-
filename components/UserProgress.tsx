import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { InfinityIcon } from "lucide-react";
import { courses } from "@/db/schema";

type Props = {
  // activeCourse: { imageSrc: string; title: string };
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

const UserProgress = ({
  activeCourse,
  points,
  hearts,
  hasActiveSubscription,
}: Props) => {
  return (
    <div className=" flex items-center justify-between gap-x-2 w-full">
      {/* UserProgress */}
      <Link href="/courses">
        <Button variant="ghost">
          <Image
            src={activeCourse.imageSrc}
            alt={activeCourse.title}
            className=" rounded-md border"
            width={32}
            height={32}
          />
        </Button>
      </Link>
      <Link href="/shop">
        <Button className=" text-rose-500">
          <Image src="/points.svg" height={28} width={28} alt="Points" />
          {points}
        </Button>
      </Link>
      <Link href="/shop">
        <Button className=" text-rose-500">
          <Image src="/heart.svg" height={22} width={22} alt="Hearts" />
          {hasActiveSubscription ? (
            <InfinityIcon className=" h-4 w-4 stroke-[3]" />
          ) : (
            hearts
          )}
        </Button>
      </Link>
    </div>
  );
};

export default UserProgress;
