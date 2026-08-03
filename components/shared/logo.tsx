import Image from "next/image";

/** The Toolly brand mark (public/logo.png), used in the header and footer. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="Toolly"
      width={size}
      height={size}
      className="rounded-xl"
      priority
    />
  );
}
