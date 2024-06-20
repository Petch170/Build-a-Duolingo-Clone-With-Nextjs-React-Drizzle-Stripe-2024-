import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import SidebarItem from "./sidebaritem";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        " flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href="/learn">
        <div className=" pt-8 pl-4 pb-7 flex items-center gap-x-3 ">
          <Image src="/mascot.svg" height={80} width={80} alt="Mascot" />
          <h1 className=" text-2xl font-extrabold text-green-600 tracking-wide">
            Lingo
          </h1>
        </div>
      </Link>

      {/* รับ props จาก SidebarItem */}
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem lable="Learn" href="/learn" iconSrc="/learn.svg" />
        <SidebarItem
          lable="Leaderboard"
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SidebarItem lable="quests" href="/quests" iconSrc="/quests.svg" />
        <SidebarItem lable="shop" href="/shop" iconSrc="/shop.svg" />
      </div>
      <div className=" p-4">
        <ClerkLoading>
          <Loader />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
    </div>
  );
};
