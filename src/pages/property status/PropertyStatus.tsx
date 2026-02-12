import React, { useEffect, useState } from "react";
import Dashboardheader from "@/components/Dashboardheader";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  /* ============================
      STATUS COUNTS
  ============================ */
  const total = properties.length;

  const serviceable = properties.filter(
    (p) => p.status === "serviceable"
  ).length;

  const unserviceable = properties.filter(
    (p) => p.status === "unserviceable"
  ).length;

  const disposed = properties.filter((p) => p.status === "disposed").length;

  const lost = properties.filter((p) => p.status === "lost").length;

  return (
    <div className="p-6 space-y-6 font-poppins">
      <Dashboardheader title="Property Status Report" />

      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Property Status Overview
        </h1>
        <p className="text-muted-foreground">
          Monitor the condition breakdown of all registered properties.
        </p>
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
                <TableHead>#</TableHead>
                <TableHead>Property No.</TableHead>

                {/* TOTAL */}
                <TableHead>Total</TableHead>

                {/* STATUS COUNTS */}
                <TableHead>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500 w-3 h-3 rounded-full" />
                    Serviceable
                  </div>
                </TableHead>

                <TableHead>
                  <div className="flex items-center gap-2">
                    <span className="bg-black w-3 h-3 rounded-full" />
                    Unserviceable
                  </div>
                </TableHead>

                <TableHead>
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-400 w-3 h-3 rounded-full" />
                    Disposed
                  </div>
                </TableHead>

                <TableHead>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500 w-3 h-3 rounded-full" />
                    Lost
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* SUMMARY ROW */}
              <TableRow className="bg-muted/40 font-semibold">
                <TableCell>-</TableCell>
                <TableCell>ALL PROPERTIES</TableCell>

                <TableCell>
                  <Badge variant="outline">{total}</Badge>
                </TableCell>

                <TableCell>
                  <Badge className="bg-green-500 text-white">
                    {serviceable}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge className="bg-black text-white">
                    {unserviceable}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant="ghost" className="text-gray-600">
                    {disposed}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant="destructive">{lost}</Badge>
                </TableCell>
              </TableRow>

              {/* PROPERTY ROWS */}
              {properties.map((p, index) => (
                <TableRow
                  key={p._id}
                  className="hover:bg-muted/30 transition"
                >
                  {/* NUMBER INDICATOR */}
                  <TableCell>{index + 1}</TableCell>

                  {/* PROPERTY NO */}
                  <TableCell className="font-medium">
                    {p.propertyNo}
                  </TableCell>

                  {/* TOTAL ALWAYS 1 */}
                  <TableCell>
                    <Badge variant="outline">1</Badge>
                  </TableCell>

                  {/* STATUS COUNTS (SHOW EVEN IF 0) */}
                  <TableCell>
                    <Badge className="bg-green-500 text-white">
                      {p.status === "serviceable" ? 1 : 0}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge className="bg-black text-white">
                      {p.status === "unserviceable" ? 1 : 0}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="ghost" className="text-gray-600">
                      {p.status === "disposed" ? 1 : 0}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="destructive">
                      {p.status === "lost" ? 1 : 0}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}

              {/* EMPTY */}
              {properties.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
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
