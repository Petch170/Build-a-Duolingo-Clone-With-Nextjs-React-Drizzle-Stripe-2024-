"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

//hook onclick onchange ...

type Props = {
  lable: string;
  iconSrc: string;
  href: string;
};
const SidebarItem = ({ lable, iconSrc, href }: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Button
      variant={active ? "sidebarOutline" : "sidebar"}
      className=" justify-start h-[52px]"
      asChild
    >
      <Link href={href}>
        <Image
          src={iconSrc}
          alt={lable}
          className="mr-5"
          height={32}
          width={32}
        />
        {lable}
      </Link>
    </Button>
  );
};

export default SidebarItem;
