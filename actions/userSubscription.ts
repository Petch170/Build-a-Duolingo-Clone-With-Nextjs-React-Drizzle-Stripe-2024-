"use server";

import { getUserSubscription } from "@/db/queries";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";

const returnUrl = absoluteUrl("/shop");

export const createStripeUrl = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const userSubscription = await getUserSubscription();

  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: returnUrl,
    });
    return { data: stripeSession.url };
  }

  //สร้างsession ใหม่ ถ้าไม่มีการสมัครสมาชิก
  const strpeSession = await stripe.checkout.sessions.create({
    mode: "subscription", // กำหนดโหมดการชำระเงิน
    payment_method_types: ["card"],
    customer_email: user.emailAddresses[0].emailAddress, // ให้เมล์ผู้ใช้เป็นเมล์ลูกค้า
    //รายละเอียดของรายการที่จะสมัคร ชื่อ,ราคา,คำอธิบาย
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: "Lingo Pro",
            description: "Unlimited Hearts",
          },
          unit_amount: 2000,
          recurring: {
            interval: "month",
          },
        },
      },
    ],
    metadata: {
      userId, // if (!session?.metadata?.userId) ที่route.ts
    },
    success_url: returnUrl,
    cancel_url: returnUrl,
  });
  return { data: strpeSession.url };
};
