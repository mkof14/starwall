import Image from "next/image";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/SW3.png"
      alt="StarWall"
      width={2135}
      height={736}
      priority={priority}
      className={cn("h-8 w-auto sm:h-9", className)}
    />
  );
}
