import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useLogout } from "features/auth/useLogout";
import { useProfile } from "features/profile/useProfile";
import { Spinner, Delay } from "components/ui";
import { Header } from "./Header";
import { Footer } from "./Footer";

type DefaultLayoutProps = {
  readonly requireAuth?: boolean;
  readonly loading?: boolean;
};
export const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,
  requireAuth = true,
  loading = false,
}) => {
  const router = useRouter();
  const { logout } = useLogout();
  const { profile, error: profileError } = useProfile();

  useEffect(() => {
    if (requireAuth && profileError != null) {
      router.push("/login");
    }
  }, [requireAuth, profileError, router]);

  const contentIsDrawable = useMemo(() => {
    if (loading) return false;
    if (requireAuth && profile == null) return false;
    return true;
  }, [profile, requireAuth, loading]);

  return (
    <div className="w-full">
      <header>
        <Header
          logout={logout}
          userName={profile?.name}
          isAdmin={profile?.role === "admin"}
        />
      </header>
      <main>
        {contentIsDrawable ? (
          children
        ) : (
          <div className="w-full h-64 flex justify-center items-center">
            <Delay>
              <Spinner />
            </Delay>
          </div>
        )}
      </main>
      <footer className="my-4">
        <Footer />
      </footer>
    </div>
  );
};
