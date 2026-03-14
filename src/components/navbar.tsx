import Link from "next/link";

const navbar =
  "flex items-center justify-between w-full h-14 px-10 border-b border-border-primary bg-bg-page";

const logo = "flex items-center gap-2 font-mono text-lg";

function Navbar() {
  return (
    <header className={navbar}>
      <div className={logo}>
        <span className="text-accent-green font-bold">&gt;</span>
        <span className="text-text-primary font-medium">devroast</span>
      </div>
      <Link
        href="/leaderboard"
        className="font-mono text-[13px] text-text-secondary hover:text-text-primary transition-colors"
      >
        leaderboard
      </Link>
    </header>
  );
}

export { Navbar, navbar };
