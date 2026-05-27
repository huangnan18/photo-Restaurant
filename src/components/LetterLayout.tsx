import type { ReactNode } from "react";

interface LetterLayoutProps {
  greeting?: string;
  children: ReactNode;
  closing?: ReactNode;
}

export default function LetterLayout({
  greeting,
  children,
  closing,
}: LetterLayoutProps) {
  return (
    <article className="letter">
      {greeting && <p className="greeting">{greeting}</p>}
      <div className="body">{children}</div>
      {closing && <div className="closing">{closing}</div>}
    </article>
  );
}
