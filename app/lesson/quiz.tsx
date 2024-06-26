"use client";

import { challenges, challengesOptions, userSubsciption } from "@/db/schema";
import { useState, useTransition } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./questionBubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import Confetti from "react-confetti";
import { upsertChallengeProgress } from "@/actions/challengeProgess";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/userprogress";
import { useAudio, useWindowSize, useMount } from "react-use";
import Image from "next/image";
import { ResultCard } from "./resultcard";
import { useRouter } from "next/navigation";
import { useHeartsModal } from "@/store/useHeartModal";
import { usePracticeModal } from "@/store/usePracticeModal";

type Props = {
  initialPercentage: number;
  initialHeart: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengesOptions: (typeof challengesOptions.$inferSelect)[];
  })[];
  // userSubscription: any;
  userSubscription:
    | (typeof userSubsciption.$inferSelect & {
        isActive: boolean;
      })
    | null;
};

export const Quiz = ({
  initialPercentage,
  initialHeart,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });

  const { width, height } = useWindowSize();

  const router = useRouter();

  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });

  //ใส่เสียงหลังจากกดคำตอบในแต่ลtข้อว่าถูก/ผิด
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });

  const [inCorrectAudio, _i, inCorrectControls] = useAudio({
    src: "/incorrect.wav",
  });

  const [pending, startTransition] = useTransition();
  const [lessonId] = useState(initialLessonId);

  //header.tsx change heart
  //   const [hearts, setHearts] = useState(50 || initialHeart);
  const [hearts, setHearts] = useState(initialHeart);

  // hesder.tsx เกจเปอร์เซ็นต์ ระหว่าง x กับ heart เปลี่ยนสีเกจได้ที่ component>ui>progress.tsx
  //   const [percentage, setPercentage] = useState(60 || initialPercentage);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });

  const [challenges] = useState(initialLessonChallenges);

  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none"); // status in type props challenge.tsx //change word in (" ") check footer with <Button/>

  const challenge = challenges[activeIndex];
  const options = challenge?.challengesOptions ?? [];

  //ในonNext เช็คตัวเลือกในchallenge ให้feedback ว่าตอบถูกหรือผิด
  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;

    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }
    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);

    if (!correctOption) {
      return;
    }

    if (correctOption && correctOption.id === selectedOption) {
      // console.log("correct option!");
      //check กับchallengeProgress error heart
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              // console.error("Missing hearts"); //ใช้ openHeartModal แทน เมื่อheart หมด จะเด้งหน้าให้ซื้อหัวใจ
              openHeartsModal();
              return;
            }

            correctControls.play(); //ใส่เสียง
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            // this is practice in challengeProgress heart = new heart
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong, Please try again "));
      });
    } else {
      //const reduceHearts ใน userprogress.ts
      // console.error("Incorrect option!");
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "heart") {
              // console.error("Missing heart");
              openHeartsModal();
              return;
            }

            inCorrectControls.play(); //ใส่เสียง
            setStatus("wrong");

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1));
            }
          })
          .catch(() => toast.error("Someing went wrong. Plese try agian"));
      });
    }
  };

  //เสร็จquiz 1 บท จะแจ้งเตือนข้อความในdiv  พร้อมเสียง (schema.challenges ในseed.ts )
  // <div> Finish the challenge</div>
  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
        />
        {/* <div> Finish the challenge</div> */}
        <div className=" flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image
            src="/finish.svg"
            alt="Finish"
            className=" hidden lg:block"
            height={100}
            width={100}
          />
          <Image
            src="/finish.svg"
            alt="Finish"
            className=" block lg:hidden"
            height={50}
            width={50}
          />
          <h1 className=" text-xl lg:text-3xl font-bold text-neutral-700">
            Great job! <br /> You&apos;ne completed the lesson.
          </h1>
          <div className=" flex items-center gap-x-4 w-full">
            <ResultCard
              variant="points"
              value={challenges.length * 10} //challengeprogress.ts > update userProgress .points
            />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer //click continue redirect to page learn
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;

  return (
    <>
      {inCorrectAudio}
      {correctAudio}
      <Header
        heart={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className=" flex-1">
        <div className=" h-full flex items-center justify-center">
          <div className=" lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className=" text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {/* Which of these is an apple?
               */}
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption} //{undefined}
                disabled={pending} //false
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status} //"completed"
        onCheck={onContinue}
      />
    </>
  );
};
