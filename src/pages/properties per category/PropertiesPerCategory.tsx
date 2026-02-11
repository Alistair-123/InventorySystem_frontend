import React, { useEffect, useState } from "react";
import { fetchCategorySummary, fetchCategoryProperties } from "./fetchData";
import type {
  CategorySummary,
  Property,
  PaginatedPropertiesResponse,
} from "./types";

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Loader2, Search } from "lucide-react";

function PropertiesPerCategory() {
  /* =========================================================
     CATEGORY SUMMARY STATE
  ========================================================= */
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* =========================================================
     DRILL DOWN STATE
  ========================================================= */
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategorySummary | null>(null);

  const [properties, setProperties] = useState<Property[]>([]);
  const [propLoading, setPropLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [propSearch, setPropSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  /* =========================================================
     FETCH CATEGORY SUMMARY
  ========================================================= */
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategorySummary(search);
      setCategories(data);
      console.log("CATEGORY SUMMARY RESPONSE:", data);

    } catch (error) {
      console.error("Failed to load category summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [search]);

  /* =========================================================
     FETCH PROPERTIES INSIDE CATEGORY
  ========================================================= */
  const loadCategoryProperties = async (categoryId: string) => {
    try {
      setPropLoading(true);

      const res: PaginatedPropertiesResponse =
        await fetchCategoryProperties({
          categoryId,
          page,
          limit: 5,
          search: propSearch,
          status: statusFilter,
        });

      setProperties(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setPropLoading(false);
    }
  };

  /* =========================================================
     OPEN MODAL ON CATEGORY CLICK
  ========================================================= */
  const handleOpenCategory = (cat: CategorySummary) => {
    setSelectedCategory(cat);
    setOpen(true);

    // Reset drilldown filters
    setPage(1);
    setPropSearch("");
    setStatusFilter("");
    
  };

  /* =========================================================
     AUTO RELOAD WHEN PAGINATION/FILTERS CHANGE
  ========================================================= */
useEffect(() => {
  if (selectedCategory) {
    loadCategoryProperties(selectedCategory.categoryId);
  }
}, [page, propSearch, statusFilter, selectedCategory]);

  return (
    <div className="p-6 space-y-6 font-poppins">
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Properties Per Category
        </h1>
        <p className="text-muted-foreground">
          Summary breakdown of all recorded properties grouped by category.
        </p>
      </div>

      {/* ========================================================= */}
      {/* SEARCH BAR */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 max-w-md">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ========================================================= */}
      {/* LOADING STATE */}
      {/* ========================================================= */}
      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin w-5 h-5" />
          Loading category report...
        </div>
      )}

      {/* ========================================================= */}
      {/* CATEGORY TABLE */}
      {/* ========================================================= */}
      {!loading && categories.length > 0 && (
        <div className="rounded-2xl border shadow-sm overflow-hidden p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Total</TableHead>

              <TableHead>
  <div className="flex items-center gap-2">
    <span className="bg-green-500 w-3 h-3 rounded-full "></span>
    Serviceable
  </div>
</TableHead>

<TableHead>
  <div className="flex items-center gap-2">
    <span className="bg-black w-3 h-3 rounded-full "></span>
    Unserviceable
  </div>
</TableHead>

<TableHead>
  <div className="flex items-center gap-2">
    <span className="bg-gray-200 w-3 h-3 rounded-full "></span>
    Disposed
  </div>
</TableHead>

<TableHead>
  <div className="flex items-center gap-2">
    <span className="bg-red-500 w-3 h-3 rounded-full "></span>
    Lost
  </div>
</TableHead>


              </TableRow>
            </TableHeader>

            <TableBody>
              {categories.map((cat, index) => (
                <TableRow
                 key={cat.categoryId}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => handleOpenCategory(cat)}
                >
                  {/* Count */}
                  <TableCell>{index + 1}</TableCell>

                  {/* Category */}
                  <TableCell className="font-semibold">
                    {cat.categoryName}
                  </TableCell>

                  {/* Total */}
                  <TableCell>
                    <Badge variant="outline">{cat.total}</Badge>
                  </TableCell>

                  <TableCell>
  <Badge className="bg-green-500 text-white hover:bg-green-600">
    {cat.serviceable}
  </Badge>
</TableCell>

<TableCell>
  <Badge className="bg-black text-white hover:bg-black/80">
    {cat.unserviceable}
  </Badge>
</TableCell>

<TableCell>
  <Badge variant="ghost" className="text-gray-500">
    {cat.disposed}
  </Badge>
</TableCell>

<TableCell>
  <Badge variant="destructive">
    {cat.lost}
  </Badge>
</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ========================================================= */}
      {/* EMPTY STATE */}
      {/* ========================================================= */}
      {!loading && categories.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
          No categories found.
        </div>
      )}

      {/* ========================================================= */}
      {/* DRILL DOWN MODAL */}
      {/* ========================================================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent  className="
    font-poppins
    max-w-6xl
    w-[100vh]    h-[90vh]
    flex flex-col
  ">
          <DialogHeader>
            <DialogTitle>
              Properties in {selectedCategory?.categoryName}
            </DialogTitle>
          </DialogHeader>

          {/* Filters */}
          <div className="flex gap-3">
            <Input
              placeholder="Search property number..."
              value={propSearch}
              onChange={(e) => setPropSearch(e.target.value)}
            />

            <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="serviceable">Serviceable</SelectItem>
                  <SelectItem value="unserviceable">Unserviceable</SelectItem>
                  <SelectItem value="disposed">Disposed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
          </div>

          {/* Properties Table */}
          {propLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-6">
              <Loader2 className="animate-spin w-5 h-5" />
              Loading properties...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property No</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {properties.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{p.propertyNo}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>

            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PropertiesPerCategory;
