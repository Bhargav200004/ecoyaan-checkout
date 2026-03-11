import React from "react";
import Head from "next/head";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "Ecoyaan – Sustainable Shopping",
  description = "Shop sustainable eco-friendly products",
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f7fce8 50%, #ecfdf5 100%)" }}>
        <Header />
        <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-5 lg:py-6 max-w-6xl pb-safe-main">
          {children}
        </main>
        <footer className="border-t bg-white/80 backdrop-blur py-5">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1.5">
              <span>🌿</span>
              <span>© 2024 Ecoyaan · Sustainable choices for a better planet</span>
              <span>🌿</span>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
