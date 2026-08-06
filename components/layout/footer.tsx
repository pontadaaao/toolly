import Link from "next/link";
import { categories } from "@/data/categories";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";

const footerLinks = [
  { href: "/about", label: "サイトについて" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/terms", label: "利用規約" },
  { href: "/privacy", label: "プライバシーポリシー" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-card">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Logo />
              Toolly
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              インストール不要・登録不要。仕事や日常で役立つ便利ツールを無料で利用できます。
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">カテゴリー</h3>
            <ul className="mt-3 space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">サイト情報</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">© {year} Toolly. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
