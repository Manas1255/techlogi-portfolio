"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { useTranslations } from "@/i18n";
import { useCurrentUser } from "@/lib/auth";

/**
 * The dashboard.
 *
 * This app has no roles, so features live flat under `features/`. Add more with
 * `jinn-web domain <name>`.
 */
export function DashboardScreen() {
  const t = useTranslations();
  const user = useCurrentUser();

  return (
    <>
      <PageHeader
        title={t("dashboard.welcome", { name: user?.name ?? "" })}
        description={t("dashboard.subtitle")}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-h3">{t("dashboard.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title={t("dashboard.empty")}
            hint={t("dashboard.emptyHint")}
          />
        </CardContent>
      </Card>
    </>
  );
}
