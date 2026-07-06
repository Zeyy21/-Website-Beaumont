import Link from "next/link";
import { AdminActionButton } from "@/components/admin-action-button";
import { Card, CardTitle, EmptyState, StatusBadge } from "@/components/dashboard-ui";
import { ButtonLink } from "@/components/ui";
import { getAdminJobs, quoteHref } from "@/lib/admin-quotes";
import { formatCurrency } from "@/lib/pricing";
import { markQuoteCompleted } from "@/app/admin/actions";
import { getDict } from "@/lib/i18n/server";
import { statusLabel } from "@/lib/i18n/dictionaries";

export function generateMetadata() {
  return { title: `${getDict().admin.jobs.title}${getDict().common.brandSuffix}` };
}

export default async function AdminJobsPage() {
  const t = getDict().admin.jobs;
  const jobs = await getAdminJobs();
  const needsScheduling = jobs.filter((job) => job.status === "accepted");
  const scheduled = jobs.filter((job) => job.status === "scheduled");
  const completed = jobs.filter((job) => job.status === "completed");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <CardTitle>{t.title}</CardTitle>
          <p className="mt-1 max-w-2xl text-sm text-soil/60">
            {t.description}
          </p>
        </div>
        <ButtonLink href="/admin" variant="outline" size="sm">
          {t.inbox}
        </ButtonLink>
      </div>

      {!jobs.length ? (
        <EmptyState
          title={t.noJobsTitle}
          body={t.noJobsBody}
        />
      ) : (
        <div className="space-y-8">
          <JobSection title={t.needsScheduling} jobs={needsScheduling} />
          <JobSection title={t.scheduled} jobs={scheduled} />
          <JobSection title={t.completed} jobs={completed} />
        </div>
      )}
    </div>
  );
}

function JobSection({
  title,
  jobs,
}: {
  title: string;
  jobs: Awaited<ReturnType<typeof getAdminJobs>>;
}) {
  if (!jobs.length) return null;
  const dict = getDict();
  const t = dict.admin.jobs;

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <CardTitle>{title}</CardTitle>
        <span className="rounded-full bg-sand/40 px-3 py-1 text-xs font-semibold text-soil/60">
          {jobs.length}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {jobs.map((job) => (
          <Card key={job.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <Link
                  href={quoteHref(job.id)}
                  className="font-display text-2xl text-oak hover:text-cinnamon"
                >
                  {job.requester_name ?? t.jobFallback}
                </Link>
                <p className="mt-1 text-sm text-soil/50">
                  {job.address ?? t.addressNotRecorded} -{" "}
                  {job.service_name ?? t.serviceNotRecorded}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={job.status} label={statusLabel(dict, job.status)} />
                <span className="font-display text-2xl text-oak">
                  {Number(job.total) > 0
                    ? formatCurrency(Number(job.total))
                    : t.noPrice}
                </span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-oak/10 pt-5">
              <ButtonLink href={quoteHref(job.id)} size="sm">
                {t.openJob}
              </ButtonLink>
              {job.status === "scheduled" && (
                <AdminActionButton
                  id={job.id}
                  action={markQuoteCompleted}
                  label={t.markCompleted}
                  doneLabel={dict.admin.inbox.completed}
                  variant="outline"
                />
              )}
              <span className="text-sm text-soil/50">
                {t.scheduledPrefix}
                {job.scheduled_for ? formatDateTime(job.scheduled_for) : dict.common.notSet}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
