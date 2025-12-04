"use client";

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverColor: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "X (Twitter)",
    href: "https://x.com/l1s_ai",
    bgColor: "bg-black",
    hoverColor: "hover:bg-slate-800",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  {
    name: "Threads",
    href: "https://www.threads.net/@sam_lung2077",
    bgColor: "bg-slate-900",
    hoverColor: "hover:bg-slate-700",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.17.408-2.265 1.33-3.084.9-.799 2.13-1.259 3.552-1.324 1.09-.05 2.096.082 2.991.39.02-.882-.095-1.643-.343-2.28-.324-.83-.87-1.455-1.62-1.856-.818-.437-1.878-.663-3.15-.672h-.013c-1.334.01-2.461.32-3.35.923-.93.63-1.58 1.53-1.932 2.68l-1.97-.551c.46-1.51 1.313-2.723 2.537-3.604 1.19-.857 2.65-1.32 4.342-1.377l.263-.002h.017c1.593.02 2.964.333 4.074.93 1.088.585 1.907 1.424 2.434 2.492.498 1.01.72 2.2.66 3.543-.005.106-.01.213-.017.319.654.288 1.236.64 1.74 1.054.86.706 1.502 1.57 1.91 2.572.67 1.647.656 4.14-1.395 6.15-1.836 1.798-4.103 2.574-7.343 2.6l-.142-.001z" />
      </svg>
    )
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/shanglol/",
    bgColor: "bg-[#1877F2]",
    hoverColor: "hover:bg-[#166FE5]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  },
  {
    name: "GitHub",
    href: "https://github.com/ImL1s",
    bgColor: "bg-[#24292F]",
    hoverColor: "hover:bg-[#1B1F23]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    )
  }
];

interface SocialLinksProps {
  variant?: "header" | "footer" | "floating";
  className?: string;
}

export function SocialLinks({ variant = "footer", className = "" }: SocialLinksProps) {
  if (variant === "floating") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:flex items-center justify-center w-10 h-10 ${link.bgColor} ${link.hoverColor} text-white rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105`}
            title={link.name}
          >
            {link.icon}
          </a>
        ))}
      </div>
    );
  }

  if (variant === "header") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center w-8 h-8 ${link.bgColor} ${link.hoverColor} text-white rounded-lg transition-all hover:scale-105`}
            title={link.name}
          >
            {link.icon}
          </a>
        ))}
      </div>
    );
  }

  // Footer variant (default)
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <p className="text-sm font-medium text-ink/60">Follow Me</p>
      <div className="flex items-center gap-3">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center w-10 h-10 ${link.bgColor} ${link.hoverColor} text-white rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-110`}
            title={link.name}
          >
            {link.icon}
          </a>
        ))}
      </div>
      <p className="text-xs text-ink/40">
        Built by{" "}
        <a
          href="https://x.com/l1s_ai"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink/60"
        >
          @l1s_ai
        </a>
      </p>
    </div>
  );
}
