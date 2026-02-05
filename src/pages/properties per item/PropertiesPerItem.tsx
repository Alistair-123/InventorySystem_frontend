import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveImageUrl } from '@/utils/image';

import { fetchItemsWithTotals } from "./fetchdata";
import type { ItemWithTotals } from "./types";

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

function PropertiesPerItem() {
  const navigate = useNavigate();

  const [items, setItems] = useState<ItemWithTotals[]>([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [search, setSearch] = useState("");

  // ===============================
  // Fetch Items With Totals
  // ===============================
  const loadItems = async () => {
    try {
      setLoading(true);

      const res = await fetchItemsWithTotals();

      setItems(res);
    } catch (error) {
      console.error("Error fetching items with totals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // ===============================
  // Search Filter (Frontend)
  // ===============================
  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.itemId.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-6">Loading Items...</p>;

  return (
    <div className="p-6 space-y-6 font-poppins">
      {/* ===================== */}
      {/* PAGE HEADER */}
      {/* ===================== */}
      <div >
        <h1 className="text-2xl font-bold">Properties Per Item</h1>
        <p className="text-gray-500 text-sm">
          View all items and how many properties belong to each one.
        </p>
      </div>

      {/* ===================== */}
      {/* SEARCH BAR */}
      {/* ===================== */}
      <div className="flex gap-3 w-1/2">
        <Input
          placeholder="Search Item Name or Item ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ===================== */}
      {/* ITEMS TABLE */}
      {/* ===================== */}
      <div className="bg-white shadow rounded-lg p-5">
        <Table>
          <TableCaption>
            List of Items with total property units.
          </TableCaption>

          {/* TABLE HEADER */}
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Item ID</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Total Properties</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          {/* TABLE BODY */}
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow key={item.itemId}>
                  {/* Image */}
                  <TableCell>
                    <img
  src={resolveImageUrl(item.itemImage)}
  alt={item.itemName}
  className="w-12 h-12 rounded object-cover border"
/>

                  </TableCell>

                  {/* Item ID */}
                  <TableCell className="font-medium">
                    {item.itemId}
                  </TableCell>

                  {/* Item Name */}
                  <TableCell>{item.itemName}</TableCell>

                  {/* Description */}
                  <TableCell className="text-gray-600">
                    {item.itemDescription || "—"}
                  </TableCell>

                  {/* Total Properties */}
                  <TableCell>
                    <span className="font-semibold">
                      {item.totalProperties}
                    </span>
                  </TableCell>

                  {/* View Button */}
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(`/propertyitem/item/${item._id}`)
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default PropertiesPerItem;
