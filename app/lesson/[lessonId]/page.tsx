import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../quiz";
type Props = {
  params: {
    lessonId: number;
  };
};

const LessonIdPage = async ({ params }: Props) => {
  const lessondata = getLesson(params.lessonId);
  const userProgressData = getUserProgress();

  const userSubscriptionData = getUserSubscription();

  const [lesson, userProgress, userSubsciption] = await Promise.all([
    lessondata,
    userProgressData,
    userSubscriptionData,
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHeart={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubsciption}
      // userSubscription={null}
    />
  );
};

export default LessonIdPage;
