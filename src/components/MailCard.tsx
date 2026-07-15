import { PriorityMail } from "@/store/mailSlice";
import { openInGmail } from "@/lib/openInGmail";


const categoryColors: Record<string, string> = {
  Professional: "bg-blue-100 text-blue-800",
  Academic:     "bg-green-100 text-green-800",
  Logistics:    "bg-orange-100 text-orange-800",
};

const cleanSummary = (summary: string) =>
  summary.replace(/^\[[^\]]+\]\s*/, "");

const decodeEntities = (str: string) => {
  if (typeof document === "undefined") return str;
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

export default function MailCard({ mail }: { mail: PriorityMail }) {
  const badge = categoryColors[mail.category ?? ""] ?? "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {mail.sender_name ?? mail.sender_email}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{mail.sender_email}</p>
        </div>
        {mail.category && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${badge}`}>
            {mail.category}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
        {decodeEntities(cleanSummary(mail.summary))}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {new Date(mail.created_at).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric"
          })}
        </span>
        <button
          onClick={() => openInGmail(mail.url_link)}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Open in Gmail →
        </button>
      </div>
    </div>
  );
}