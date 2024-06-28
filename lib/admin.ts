import { auth } from "@clerk/nextjs/server";

const adminIds = ["user_2hlN2lL1cwQ9UdEVovPJW4DN7nx"];

export const isAdmin = () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  //   return userId === "user_2hlN2lL1cwQ9UdEVovPJW4DN7nx";
  return adminIds.indexOf(userId) !== -1;
};
