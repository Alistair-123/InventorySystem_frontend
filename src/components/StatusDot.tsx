import React from 'react'


const StatusDot = ({ status }: { status: "active" | "inactive" }): React.ReactNode => {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          status === "active" ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="capitalize">{status}</span>
    </span>
  );
};

export default StatusDot;

  