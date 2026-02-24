import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Loader2, Search } from "lucide-react";

import { fetchProperties } from "./Api";
import type { Property } from "./types";

/* ============================
    STATUS CONFIG
============================ */
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; badgeClass: string }
> = {
  serviceable: {
    label: "Serviceable",
    color: "bg-green-500",
    badgeClass: "bg-green-500 text-white",
  },
  unserviceable: {
    label: "Unserviceable",
    color: "bg-black",
    badgeClass: "bg-black text-white",
  },
  disposed: {
    label: "Disposed",
    color: "bg-gray-400",
    badgeClass: "bg-gray-400 text-white",
  },
  lost: {
    label: "Lost",
    color: "bg-red-500",
    badgeClass: "bg-red-500 text-white",
  },
};

function PropertyStatusPage() {
  /* ============================
      STATE
  ============================ */
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ============================
      FETCH DATA
  ============================ */
  const loadProperties = async () => {
    try {
      setLoading(true);

      const res = await fetchProperties({
        page: 1,
        limit: 1000,
        search,
      });

      setProperties(res.properties);
    } catch (error) {
      console.error("Failed to load property status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [search]);

  return (
    <div className="p-6 space-y-6 font-poppins">

      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Property Status
        </h1>
        <p className="text-muted-foreground">
          Monitor the condition breakdown of all registered properties.
        </p>
      </div>

      {/* ========================================================= */}
      {/* LEGEND */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center gap-4">
        {Object.values(STATUS_CONFIG).map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={`w-3 h-3 rounded-full ${s.color}`} />
            {s.label}
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* SEARCH */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 max-w-md">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search property number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ========================================================= */}
      {/* LOADING */}
      {/* ========================================================= */}
      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin w-5 h-5" />
          Loading property status report...
        </div>
      )}

      {/* ========================================================= */}
      {/* TABLE */}
      {/* ========================================================= */}
      {!loading && (
        <div className="rounded-2xl border shadow-sm overflow-hidden p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Property No.</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {properties.map((p, index) => {
                const config = STATUS_CONFIG[p.status] ?? {
                  label: p.status,
                  color: "bg-gray-300",
                  badgeClass: "bg-gray-300 text-white",
                };

                return (
                  <TableRow
                    key={p._id}
                    className="hover:bg-muted/30 transition"
                  >
                    {/* NUMBER */}
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>

                    {/* PROPERTY NO */}
                    <TableCell className="font-medium">
                      {p.propertyNo}
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                        <Badge className={config.badgeClass}>
                          {config.label}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* EMPTY */}
              {properties.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-8"
                  >
                    No properties found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default PropertyStatusPage;