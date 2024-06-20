This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## เริ่มproject

layout file เปลี่ยนfont Inter เป็นNunito
https://ui.shadcn.com/docs/installation/next
shadcn/ui :collection of re-usable components
npx shadcn-ui@latest init

เทส tailwind
เปิด terminal อีกอัน ติดตั้ง
npx shadcn-ui@latest add button
หลังจากติดตั้งแล้วจะเจอ component\ui button.tsx

ใน page.tsx ให้import และเรียกใช้งาน เลือกใช้ช้อยตาม button.tsx ได้
import { Button } from "@/components/ui/button"

สร้าง Authentication ใช้ lib clerk
https://dashboard.clerk.com/apps/new?signed_up=true

copy Api Key
ไปที่.gitignore เพิ่ม .env

สร้างไฟล์.env เอาapi key ที่ได้มาวางที่นี่
และติดตั้ง สิ่งที่ใช้ในprojectนี้
npm install @clerk/nextjs

import {ClerkProvider}from '@clerk/nextjs' ตามdocs next.js ในclerk ที่layout.tsx ที่อยู่ในapp (root)
โดย return ClerkProvider ที่func RootLayout จะทำให้คอมโพเนนต์สามารถเข้าถึงสถานะผู้ใช้ (เช่น ผู้ใช้เข้าสู่ระบบหรือยัง, ข้อมูลผู้ใช้) ได้ง่ายขึ้น โดยไม่ต้องส่งผ่าน props หรือใช้ state management แยกต่างหาก

เชื่อมต่อ middleware.ts สร้าง file middleware.ts ที่root level app และวางcode ลงไป
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

> header.tsx
> ใส่image โดยใช้ รูปภาพจาก https://kenney.nl/assets/shape-characters

> ดูรูปได้ที่ https://github.com/AntonioErdeljac/lingo-early-access/tree/master/public

> import รูปเข้าในfolder public

ในsignInButton docs clerk ใหม่ จะใช้ <SignInButton mode="modal"
              fallbackRedirectUrl="/learn"
              signUpFallbackRedirectUrl="/learn"/></SignInButton> แทน
<SignInButton
mode="modal"
afterSignInUrl="/learn"
afterSignUpUrl="/learn"> </SignInButton>

หลังจากนั้น ไปทำsignin out ที่หน้าlanding page ด้วย ((marketing)>page.tsx)

https://flagpack.xyz/ libเลือกภาษา เลือกเป็นfigma และทำfooter

สร้างfolder (main) ในapp สร้างไฟล์ layout.tsx และ folder learn>page.tsx เพื่อสร้างหน้าหลักหลังจากlogin หรือsingupแล้ว

https://ui.shadcn.com/
npx shadcn-ui@latest add sheet สำหรับทำhamberger mobile ในpage sidebar

สร้างไฟล์ stcikyWrapper,FeedWraper ไว้ที่Component เพื่อใช้ร่วมกับ learn pages

ติดตั้ง database Neon
https://neon.tech/
create new project >ใส่ชื่อ database and project name lingo >create project

copy string in project Dashbord
paste in .env in vscode DB_URL

setup Neon
ไปที่docs drizzle orm เลือก postgreSQL
https://orm.drizzle.team/docs/get-started-postgresql#neon

npm i drizzle-orm @neondatabase/serverless
npm i -D drizzle-kit

package.json เพิ่มscript "db:studio":"npx drizzle-kit studio",
"db:push":"npx drizzle-kit push:pg"
ลองรัน npm run db:push ฟ้อง error เพราะเว็บไซต์มีการupdateใหม่ ใช้เป็น"db:push":"npx drizzle-kit push" แทน runอีกครั้ง
ถ้าเจอerror เพราะversion react ต่างกัน ให้บังคับการติดตั้งแพ็กเกจโดยไม่สนใจข้อขัดแย้งของ peer dependencies ด้วย
npm install drizzle-orm @neondatabase/serverless drizzle-kit --legacy-peer-deps

สร้างfolder db ที่ root lingo
และสร้างไฟล์ drizzle.ts ในdb
import neon และ drizzle เข้าไฟล์
drizzle :เครื่องมือที่ช่วยในการจัดการและเชื่อมต่อกับฐานข้อมูลในแบบ Object-Oriented หรือเชื่อมต่อฐานข้อมูลเชิงวัตถุ โดยมีการแปลงข้อมูลในฐานข้อมูลให้เป็น Object ในโปรแกรมเพื่อทำให้การจัดการข้อมูลเป็นไปได้สะดวกขึ้นและเขียนโปรแกรมได้รวดเร็วขึ้น
เรียกใช้ database ที่ไฟล์ drizzle
สร้างไฟล์ schema เพื่อตั้งค่าข้อมูล

ติดตั้ง dotenv
npm i dotenv

สร้างไฟล์ drizzle.config.ts
import dotenv และ type config

\*ติดตั้ง import type { Config } from "drizzle-kit"; มีปัญหา ไม่สามารถใช้งานdriver "pg" ได้ ต้องเปลี่ยนไปใช้ import { defineConfig } from "drizzle-kit"; ตาม docs
และใช้ dialect: "postgresql", แทน driver:pg, รวมถึง ใช้url ใน dbCredentials แทนconnectionSring
(npm i -D pg)
ลองรันคำสั่ง npm run db:push เพื่อดูว่าในneon table มีtable name: courses ที่สร้างไว้ใน schema ไหม

จากนั้น เข้าถึง drizzle studio เพื่อกรอกข้อมูล npm run db:studio
ใส่ค่าที่ต้องการลงในtable

สร้าง folder ใน (main)> courses >page.tsx สำหรับ แสดงผล เมื่อกดรูปธงชาติในหน้า learn

ดึงข้อมูลจากdatabase
courses > สร้างfetch >db >queries.ts
import { cache } from "react"; cache คือการดึงข้อมูลเดิม แทนการเรียกฐานข้อมูลใหม่
และเรียกใช้ fetch ข้อมูล ที่courses>page.tsx

main> courses> list.tsx
use client
สร้าง func Card เพื่อส่งProp ไปใช้งานในlist

schema.txสร้าง func รับค่า userProgess และschema ที่จำเป็นต่อการใช้งาน สร้างเสร็จแล้ว npm run db:push เพื่อสร้างตาราง และ run db:studio เพื่อดูตารางในdrizzle

เรียกใช้ useTransition() สำหรับแสดงผลการเปลี่ยนแปลง UI อย่างนิ่มนวล

> [ตัวแปร, startTransition]=useTransition()

สร้าง folder action >userprogress.ts ในroot เพื่อเก็บค่า userprogress เป็น server

ติดตั้ง npx shadcn-ui@latest add sonner
เพื่อแสดงpopup แจ้งเตือน
ไปที่ app layout.tsx
import { Toaster } from "@/components/ui/sonner";

สร้างfolder scripts ที่root lingo >seed.ts
(สำหรับเชื่อมต่อ database ) (Backend server)
สร้างไฟล์เสร็จแล้ว รันด้วย node scripts/seed.ts

npm i -D tsx //run typescripts ใน node
packgage.json
เพิ่ม script "db:seed": "tsx ./scripts/seed.ts"
npm run db:seed เพื่อเชื่อมต่อ server

//เป็นตัวเลือก
ติดตั้ง bun toolkit สำหรับ runtime และสร้างrestAPI
https://bun.sh/
npm install -g bun
เปลี่ยน script
"db:seed": "bun ./scripts/seed.ts"
"db:studio": "bunx drizzle-kit studio",
"db:push": "bunx drizzle-kit push",
bun db:seed, bun db:studio

สร้าง unitBanner ในlearn folder

สร้างฟังก์ชันใน LessonButton

dasnboard วงกลม
ติดตั้ง npm i react-circular-progressbar

#Lesson Header สำหรับสร้างเกจpercent รวมถึง x และ heart ด้วย
สร้าง folder lesson>page สร้าง prop Quiz ,header
ติดตั้ง npx shadcn-ui@latest add progress

#Exit model
npx shadcn-ui@latest add dialog
npm i zustand
สร้าง folder ที่root lingo store >useExitModal.ts เพื่อset การเปิดปิด Modal และสร้างmodal exitmodal component เพื่อแจ้งเตือนข้อความก่อนปิดmodal

#challenge Cards
สร้างcard ตัวเลือกในหน้าlearn
