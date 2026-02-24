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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Loader2, Search, X } from "lucide-react";

/* ============================
    STATUS CONFIG
============================ */
const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; badgeClass: string }
> = {
  serviceable: {
    label: "Serviceable",
    dot: "bg-green-500",
    badgeClass: "bg-green-500 text-white",
  },
  unserviceable: {
    label: "Unserviceable",
    dot: "bg-black",
    badgeClass: "bg-black text-white",
  },
  disposed: {
    label: "Disposed",
    dot: "bg-gray-400",
    badgeClass: "bg-gray-400 text-white",
  },
  lost: {
    label: "Lost",
    dot: "bg-red-500",
    badgeClass: "bg-red-500 text-white",
  },
};

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
  const [visible, setVisible] = useState(false);
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
          limit: 10,
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
    setPage(1);
    setPropSearch("");
    setStatusFilter("");
    setOpen(true);
    // tiny delay so element is mounted before the transition fires
    setTimeout(() => setVisible(true), 10);
  };

  const handleClosePanel = () => {
    setVisible(false);
    // wait for the slide-out transition to finish before unmounting
    setTimeout(() => setOpen(false), 300);
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
              {categories.map((cat, index) => (
                <TableRow
                  key={cat.categoryId}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => handleOpenCategory(cat)}
                >
                  <TableCell>{index + 1}</TableCell>

                  <TableCell className="font-semibold">
                    {cat.categoryName}
                  </TableCell>

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
                    <Badge className="bg-gray-400 text-white hover:bg-gray-500">
                      {cat.disposed}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="destructive">{cat.lost}</Badge>
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
      {/* DRILL DOWN PANEL — full-width div overlay */}
      {/* ========================================================= */}
      {open && selectedCategory && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClosePanel}
          />

          {/* Panel */}
          <div
            className={`fixed inset-y-0 right-0 z-50 w-full max-w-4xl bg-white shadow-2xl flex flex-col font-poppins
              transition-transform duration-300 ease-in-out
              ${visible ? "translate-x-0" : "translate-x-full"}`}
          >

            {/* Panel Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {selectedCategory.categoryName}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Showing all properties under this category.
                </p>
              </div>
              <button
                onClick={handleClosePanel}
                className="text-muted-foreground hover:text-foreground transition mt-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 px-6 py-3 border-b bg-muted/20">
              {Object.values(STATUS_CONFIG).map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                  {s.label}
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex gap-3 px-6 py-4 border-b">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search property number..."
                  value={propSearch}
                  onChange={(e) => {
                    setPropSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value === "all" ? "" : value);
                  setPage(1);
                }}
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
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {propLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground py-6">
                  <Loader2 className="animate-spin w-5 h-5" />
                  Loading properties...
                </div>
              ) : (
                <div className="rounded-xl border overflow-hidden">
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
                          dot: "bg-gray-300",
                          badgeClass: "bg-gray-300 text-white",
                        };

                        return (
                          <TableRow key={p._id} className="hover:bg-muted/30 transition">
                            <TableCell className="text-muted-foreground">
                              {(page - 1) * 10 + index + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {p.propertyNo}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                                <Badge className={config.badgeClass}>
                                  {config.label}
                                </Badge>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}

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

            {/* Pagination */}
            <div className="flex justify-between items-center px-6 py-4 border-t">
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
          </div>
        </>
      )}
    </div>
  );
}

export default PropertiesPerCategory;