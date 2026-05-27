import type { Metadata } from "next";
import LetterLayout from "@/components/LetterLayout";

export const metadata: Metadata = {
  title: "关于",
};

export default function AboutPage() {
  return (
    <main className="pt-12 pb-24">
      <LetterLayout
        greeting="你好，"
        closing={
          <>
            行走的人
            <br />
            于杭州，2025
          </>
        }
      >
        <p>
          这个摄影集始于一个简单的念头——把走过的路、遇见的光，好好收在一处。
        </p>
        <p>
          不为了展览，不为了点赞，只是为了记得。记得清晨五点的山雾，
          记得转角处陌生人的微笑，记得夏日午后窗台上的猫。
        </p>
        <p>
          这里没有完美的构图，没有严谨的曝光。只有按下快门那一刻，
          心里泛起的一点涟漪。
        </p>
        <p>
          如果你也喜欢在街巷里漫步，在晨昏时分等待光线，那我们大概
          可以隔着一张照片碰个杯。
        </p>
      </LetterLayout>

      <div className="text-center text-sm text-[var(--color-muted)] mt-8 pb-16 space-y-2">
        <p>📷 Leica M6 / Fujifilm X-T5</p>
        <p>
          📧{" "}
          <a
            href="mailto:hello@jiaofu.me"
            className="text-[var(--color-accent)] hover:underline"
          >
            hello@jiaofu.me
          </a>
        </p>
      </div>
    </main>
  );
}
