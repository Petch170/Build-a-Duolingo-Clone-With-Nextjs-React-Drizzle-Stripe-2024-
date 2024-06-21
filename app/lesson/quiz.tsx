"use client";

import { challenges, challengesOptions } from "@/db/schema";
import { useState, useTransition } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./questionBubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { Console, error } from "console";
import { upsertChallengeProgress } from "@/actions/challengeProgess";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/userprogress";

type Props = {
  initialPercentage: number;
  initialHeart: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengesOptions: (typeof challengesOptions.$inferSelect)[];
  })[];
  userSubscription: any;
};

export const Quiz = ({
  initialPercentage,
  initialHeart,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}: Props) => {
  const [pending, startTransition] = useTransition();

  //header.tsx change heart
  //   const [hearts, setHearts] = useState(50 || initialHeart);
  const [hearts, setHearts] = useState(initialHeart);

  // hesder.tsx เกจเปอร์เซ็นต์ ระหว่าง x กับ heart เปลี่ยนสีเกจได้ที่ component>ui>progress.tsx
  //   const [percentage, setPercentage] = useState(60 || initialPercentage);
  const [percentage, setPercentage] = useState(initialPercentage);

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
              console.error("Missing hearts");
              return;
            }

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
              console.error("Missing heart");
              return;
            }

            setStatus("wrong");

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1));
            }
          })
          .catch(() => toast.error("Someing went wrong. Plese try agian"));
      });
    }
  };

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;

  return (
    <>
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
