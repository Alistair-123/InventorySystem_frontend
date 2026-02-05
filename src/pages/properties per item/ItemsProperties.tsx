import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchPropertiesPerItem } from "./fetchdata";
import type { PropertiesPerItemResponse } from "./types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function PropertiesPerItemPage() {
  const { itemId } = useParams();

  const [data, setData] =
    useState<PropertiesPerItemResponse | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 5;

  // ===============================
  // Load Properties Under Item
  // ===============================
  const loadProperties = async () => {
    if (!itemId) return;

    try {
      const res = await fetchPropertiesPerItem(
        itemId,
        search,
        page,
        limit
      );

      setData(res);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  // Load on mount + page change
  useEffect(() => {
    loadProperties();
  }, [itemId, page]);

  // Search button resets page
  const handleSearch = () => {
    setPage(1);
    loadProperties();
  };

  // Pagination
  const handleNext = () => {
    if (!data) return;
    if (page < data.pagination.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (!data) return <p className="p-6">Loading properties...</p>;

  return (
    <div className="p-6 space-y-6 font-poppins">
      {/* ===================== */}
      {/* ITEM HEADER */}
      {/* ===================== */}
      <div className="bg-white shadow rounded-lg p-5">
        <h1 className="text-2xl font-bold">
          {data.item.itemName}
        </h1>

        <p className="text-gray-500 text-sm">
          Item ID: {data.item.itemId}
        </p>

        <p className="text-gray-600 mt-2">
          {data.item.itemDescription}
        </p>
      </div>

      {/* ===================== */}
      {/* SEARCH */}
      {/* ===================== */}
      <div className="flex gap-3">
        <Input
          placeholder="Search Property No or Status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* ===================== */}
      {/* PROPERTIES TABLE */}
      {/* ===================== */}
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-4">
          Properties ({data.pagination.totalProperties})
        </h2>

        <Table>
          <TableCaption>
            Property units under this item.
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Property No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Personnel</TableHead>
              <TableHead>Office</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.properties.length > 0 ? (
              data.properties.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-medium">
                    {p.propertyNo}
                  </TableCell>

                  <TableCell>
                    {new Date(p.acquisitionDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    {p.acquisitionType?.name}
                  </TableCell>

                  <TableCell>
                    ₱{p.acquisitionValue.toLocaleString()}
                  </TableCell>

                  <TableCell>
                    {p.personnel?.firstName}{" "}
                    {p.personnel?.lastName}
                  </TableCell>

                  <TableCell>
                    {p.office?.officeName}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.status === "serviceable"
                          ? "bg-green-100 text-green-700"
                          : p.status === "lost"
                          ? "bg-red-100 text-red-700"
                          : p.status === "disposed"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status.toUpperCase()}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No properties found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* ===================== */}
        {/* PAGINATION */}
        {/* ===================== */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={page === 1}
          >
            Previous
          </Button>

          <p className="text-sm text-gray-600">
            Page {data.pagination.currentPage} of{" "}
            {data.pagination.totalPages}
          </p>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={page === data.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PropertiesPerItemPage;
