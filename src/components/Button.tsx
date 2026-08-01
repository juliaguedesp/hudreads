import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
    icon?: LucideIcon;
    variant?: "primary" | "secondary" | "ghost" | "outline";
    className?: string;
    type?: "button" | "submit";
    disabled?: boolean;
    external?: boolean;
};

const variants = {
    primary: "bg-cream text-forest hover:opacity-90",
    secondary: "bg-forest text-cream hover:opacity-90",
    ghost: "border border-cream/40 text-cream hover:bg-cream/10",
    outline: "border border-forest/30 text-forest hover:bg-forest/5",
};

export function Button({
    href,
    onClick,
    children,
    icon: Icon,
    variant = "secondary",
    className,
    type = "button",
    disabled,
    external,
}: ButtonProps) {
    const classes = cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-md font-display transition-all duration-200 sm:text-base",
        variants[variant],
        disabled && "pointer-events-none opacity-50",
        className,
    );

    const content = (
        <>
            {children}
            {Icon && <Icon size={18} className="shrink-0" />}
        </>
    );

    if (href) {
        if (external || href.startsWith("http")) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes}
                >
                    {content}
                </a>
            );
        }
        return (
            <Link href={href} className={classes}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classes}
        >
            {content}
        </button>
    );
}