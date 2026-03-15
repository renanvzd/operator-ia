import { Suspense } from "react";
import { HomeEditor } from "@/components/home-editor";
import { HomeShameLeaderboard } from "@/components/home-shame-leaderboard";
import { HomeShameLeaderboardSkeleton } from "@/components/home-shame-leaderboard-skeleton";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-10 py-8">
      <HomeEditor />

      <div className="mt-16 flex w-full max-w-[960px] flex-col gap-6">
        <Suspense fallback={<HomeShameLeaderboardSkeleton />}>
          <HomeShameLeaderboard />
        </Suspense>
      </div>
    </main>
  );
}
