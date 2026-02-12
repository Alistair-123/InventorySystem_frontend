import React from "react";

/* ✅ Support both Item + Property Status globally */
type StatusType =
  | "active"
  | "inactive"
  | "serviceable"
  | "unserviceable"
  | "disposed"
  | "lost";

const StatusDot = ({ status }: { status: StatusType }): React.ReactNode => {
  /* ✅ Color logic */
  const statusColor =
    status === "active" || status === "serviceable"
      ? "bg-green-500"
      : status === "inactive" || status === "unserviceable"
      ? "bg-red-500"
      : status === "disposed"
      ? "bg-gray-500"
      : "bg-yellow-500"; // lost

  return (
    <span className="flex items-center gap-2">
      {/* DOT */}
      <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />

      {/* TEXT */}
      <span className="capitalize">{status}</span>
    </span>
  );
};

export default StatusDot;
