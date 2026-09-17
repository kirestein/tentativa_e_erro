import Link from "next/link";
import { pdfPublicUrl } from "@/lib/storage";
import type { Activity } from "@/types/database";

export function ActivityCard({ activity }: { activity: Activity }) {
  const coverUrl = activity.cover_path ? pdfPublicUrl(activity.cover_path) : null;

  return (
    <Link
      href={`/atividades/${activity.id}`}
      className="flex gap-3 rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      {coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt=""
          className="h-20 w-16 shrink-0 rounded border object-cover"
        />
      )}
      <div className="min-w-0">
        <span className="mb-2 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
          {activity.theme}
        </span>
        <h3 className="font-semibold">{activity.title}</h3>
        {activity.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {activity.description}
          </p>
        )}
      </div>
    </Link>
  );
}
