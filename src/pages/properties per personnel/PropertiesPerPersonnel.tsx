import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveImageUrl } from '@/utils/image'

// UI Components (ShadCN)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// API
import { fetchPersonnelPropertySummary } from './fetchdata';

// Types
import type { PersonnelPropertySummary } from "./types";

function PropertiesPerPersonnel() {
  const navigate = useNavigate();

  // ==============================
  // State
  // ==============================
  const [personnels, setPersonnels] = useState<PersonnelPropertySummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search + Pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Backend pagination info
  const [totalPages, setTotalPages] = useState(1);

  // ==============================
  // Fetch Data
  // ==============================
  const loadPersonnels = async () => {
    try {
      setLoading(true);

      const res = await fetchPersonnelPropertySummary(search, page, 10);

      setPersonnels(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Failed to load personnel summary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reload when search/page changes
  useEffect(() => {
    loadPersonnels();
  }, [search, page]);

  // ==============================
  // Render
  // ==============================
  return (
    <div className="p-6 space-y-6 font-poppins">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Properties Per Personnel
        </h1>
        <p className="text-sm text-gray-500">
          View how many properties are assigned to each personnel.
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search personnel by name or ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page when searching
          }}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border-l border-r border-b border-gray-200">
        <Table>
          <TableHeader className="bg-gray-200 rounded-2xl">
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Photo</TableHead>
              <TableHead>Personnel ID</TableHead>
              <TableHead className="font-med">Full Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Properties</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Loading personnels...
                </TableCell>
              </TableRow>
            ) : personnels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No personnels found.
                </TableCell>
              </TableRow>
            ) : (
              personnels.map((p, index) => (
                <TableRow key={p._id}>
                   <TableCell className="font-semibold">
                    {(page - 1) * 5 + index + 1}
                  </TableCell>
                    <TableCell>
                      <img
                        src={resolveImageUrl(p.personnelImage)}
                        alt={p.fullName}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    </TableCell>
                  <TableCell>{p.personnelId}</TableCell>
                  <TableCell className="font-med">
                    {p.fullName}
                  </TableCell>
                  <TableCell>{p.designationName}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        p.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status.toUpperCase()}
                    </span>
                  </TableCell>

                  {/* Property Count */}
                  <TableCell>
                    <span className="font-bold">
                      {p.propertyCount}
                    </span>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-gray-300 cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/personnelproperty/${p._id}/properties`
                        )
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </Button>

        <p className="text-sm text-gray-600">
          Page <span className="font-bold">{page}</span> of{" "}
          <span className="font-bold">{totalPages}</span>
        </p>

        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default PropertiesPerPersonnel;
