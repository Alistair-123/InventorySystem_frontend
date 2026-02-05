import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// UI Components (ShadCN)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

// API
import { fetchPersonnelProperties } from './fetchdata';

// Types
import type { Property } from "./types";

function PersonnelProperties() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ Personnel ID from URL

  // ==============================
  // State
  // ==============================
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ==============================
  // Fetch Properties
  // ==============================
  const loadProperties = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const res = await fetchPersonnelProperties(id, page, 10);

      setProperties(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Failed to load personnel properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [id, page]);

  // ==============================
  // Render
  // ==============================
  return (
    <div className="p-6 space-y-6 font-poppins">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Personnel Properties
          </h1>
          <p className="text-sm text-gray-500">
            All properties assigned to this personnel.
          </p>
        </div>

        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>

      {/* Table */}
      <div className="border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Property No</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Office</TableHead>
              <TableHead>Acquisition Value</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Loading properties...
                </TableCell>
              </TableRow>
            ) : properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No properties assigned to this personnel.
                </TableCell>
              </TableRow>
            ) : (
              properties.map((prop, index) => (
                <TableRow key={prop._id}>
                  {/* Row Number */}
                  <TableCell className="font-semibold">
                    {(page - 1) * 10 + index + 1}
                  </TableCell>

                  {/* Property No */}
                  <TableCell>{prop.propertyNo}</TableCell>

                  {/* Item */}
                  <TableCell className="font-medium">
                    {prop.item?.itemName || "N/A"}
                  </TableCell>

                  {/* Office */}
                  <TableCell>
                    {prop.office?.officeName || "N/A"}
                  </TableCell>

                  {/* Value */}
                  <TableCell>
                    ₱{prop.acquisitionValue.toLocaleString()}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        prop.status === "serviceable"
                          ? "bg-green-100 text-green-700"
                          : prop.status === "unserviceable"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {prop.status.toUpperCase()}
                    </span>
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

export default PersonnelProperties;
