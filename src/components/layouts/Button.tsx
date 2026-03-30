import Link from "next/link";

type Variant = "primary" | "outline" | "cta" | "elevated";

const variantStyles: Record<Variant, string> = {
  // Navbar "Bora começar?" e hero "Bora começar?" — fundo preto, sombra rosa
  primary:
    "bg-[#1A1A1B] text-white shadow-[0px_4px_4px_2px_rgba(220,60,132,0.25)] hover:bg-[#2d2d2e]",
  // Navbar "Entrar" — borda teal, texto teal, sem fundo
  outline:
    "border border-[#13C1C5] text-[#13C1C5] bg-transparent hover:bg-[#E0F9FA]",
  // Navbar "Bora começar?" — fundo teal, sombra rosa
  cta: "bg-[#13C1C5] text-white shadow-[0px_4px_4px_2px_rgba(220,60,132,0.25)] hover:bg-[#0E8A8D]",
  // Hero "Entrar" — fundo branco, sombra de elevação, texto preto
  elevated:
    "bg-white text-[#1A1A1B] shadow-[0px_2px_3px_0px_rgba(0,0,0,0.3),0px_1px_4px_1px_rgba(0,0,0,0.15)] hover:shadow-md",
};

interface ButtonProps {
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  variant = "primary",
  href,
  onClick,
  children,
  className = "",
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-normal text-base transition-all cursor-pointer";
  const classes = `${base} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
