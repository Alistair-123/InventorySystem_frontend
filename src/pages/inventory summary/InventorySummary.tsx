import React, { useEffect, useState, useCallback } from "react"
import { fetchProperties, downloadPropertiesCSV, downloadPropertiesPDF } from "./fetchdata"
import type { PropertyDepreciation } from "./types"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  TrendingDown,
  Package,
  DollarSign,
  BarChart3,
  RefreshCw,
  Download,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value)
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

function getRemainingLifeBadge(years: number) {
  if (years <= 0)
    return <Badge variant="destructive">Fully Depreciated</Badge>
  if (years <= 2)
    return <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">{years}y remaining</Badge>
  if (years <= 5)
    return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">{years}y remaining</Badge>
  return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">{years}y remaining</Badge>
}

function DepreciationBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden cursor-default">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{pct.toFixed(1)}% depreciated</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  accent: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={`p-2.5 rounded-xl ${accent}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TableRowSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: 7 }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  )
}

export default function InventorySummary() {
  const [data, setData] = useState<PropertyDepreciation[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchProperties({ page, limit, search })
      setData(res.data)
      setTotal(res.total)
      setTotalPages(res.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, refreshKey])

  useEffect(() => {
    load()
  }, [load])

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  // Derived stats from current page data
  const totalAcquisition = data.reduce((s, r) => s + r.acquisitionValue, 0)
  const totalCurrent = data.reduce((s, r) => s + r.currentValue, 0)
  const totalDepreciated = data.reduce((s, r) => s + r.depreciated, 0)

  const startItem = (page - 1) * limit + 1
  const endItem = Math.min(page * limit, total)

  return (
    <div className="min-h-screen bg-background font-poppins">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventory Summary</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Property depreciation overview and remaining asset lifespans
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRefreshKey(k => k + 1)}
              disabled={loading}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Export
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => downloadPropertiesPDF(search)} >
                    Export as PDF
                  </DropdownMenuItem>

                  <DropdownMenuItem  onClick={() => downloadPropertiesCSV(search)}>
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Package}
            label="Total Properties"
            value={total.toLocaleString()}
            sub={`Page ${page} of ${totalPages}`}
            accent="bg-blue-500"
          />
          <StatCard
            icon={DollarSign}
            label="Acquisition Value"
            value={formatCurrency(totalAcquisition)}
            sub="Current page total"
            accent="bg-violet-500"
          />
          <StatCard
            icon={BarChart3}
            label="Current Value"
            value={formatCurrency(totalCurrent)}
            sub="After depreciation"
            accent="bg-emerald-500"
          />
          <StatCard
            icon={TrendingDown}
            label="Total Depreciated"
            value={formatCurrency(totalDepreciated)}
            sub="Value lost"
            accent="bg-rose-500"
          />
        </div>

        {/* Main Table Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold">Property Depreciation</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Showing {total > 0 ? `${startItem}–${endItem} of ${total}` : "0"} records
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search property or item..."
                  className="pl-8 h-8 text-sm"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="pl-6 font-semibold text-xs uppercase tracking-wider w-[120px]">
                      Property No.
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">
                      Item Name
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">
                      Acquisition
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">
                      Acq. Value
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">
                      Current Value
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider min-w-[160px]">
                      Depreciation
                    </TableHead>
                    <TableHead className="pr-6 font-semibold text-xs uppercase tracking-wider">
                      Life Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading
                    ? Array.from({ length: limit }).map((_, i) => (
                        <TableRowSkeleton key={i} />
                      ))
                    : data.length === 0
                    ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                          <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">No properties found</p>
                          {search && (
                            <p className="text-xs mt-1">
                              Try adjusting your search query
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                    : data.map((row, idx) => (
                      <TableRow
                        key={`${row.propertyNo}-${idx}`}
                        className="group hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="pl-6  text-md font-med">
                          {row.propertyNo}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {row.itemName ?? (
                            <span className="text-muted-foreground italic text-xs">Unnamed</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="text-xs font-medium">{formatDate(row.acquisitionDate)}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                              {row.acquisitionName ?? "—"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums">
                          {formatCurrency(row.acquisitionValue)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium tabular-nums">
                              {formatCurrency(row.currentValue)}
                            </p>
                            <p className="text-xs text-muted-foreground tabular-nums text-right text-red-400">
                              −{formatCurrency(row.depreciated)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[160px]">
                          <div className="space-y-1.5">
                            <DepreciationBar
                              value={row.depreciated}
                              max={row.acquisitionValue}
                            />
                            <p className="text-xs text-muted-foreground">
                              {row.acquisitionValue > 0
                                ? `${((row.depreciated / row.acquisitionValue) * 100).toFixed(1)}% depreciated`
                                : "N/A"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="pr-6">
                          {getRemainingLifeBadge(row.remainingLife)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          {/* Pagination Footer */}
          <Separator />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rows per page</span>
              <Select
                value={String(limit)}
                onValueChange={val => {
                  setLimit(Number(val))
                  setPage(1)
                }}
              >
                <SelectTrigger className="h-7 w-16 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map(n => (
                    <SelectItem key={n} value={String(n)} className="text-xs">
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setPage(1)}
                disabled={page === 1 || loading}
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground px-2 min-w-[80px] text-center">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages || loading}
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}