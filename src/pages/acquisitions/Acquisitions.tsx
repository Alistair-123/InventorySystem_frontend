import Dashboardheader from "@/components/Dashboardheader";
import React, { useState, useEffect, useCallback } from "react";
import ConfirmAction from "@/components/ActionMenu";
import { useForm, Controller } from "react-hook-form";
import { MoreHorizontal } from "lucide-react";
import StatusDot from "@/components/StatusDot";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Modal from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axiosInstance";
import type { CreateAcquisition, GetAcquisition } from './types/types';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function Acquisitions() {
    const [isOpen, setIsOpen] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const [isError, setIsError] = useState(false);
      const [acquisition, setAcquisition] = useState<GetAcquisition[]>([]);
      const [page, setPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const limit = 20;
      const [search, setSearch] = useState("");
      const [mode, setMode] = useState<"create" | "edit">("create");
      const [pendingEditData, setPendingEditData] = useState<CreateAcquisition | null>(
        null
      );
      const [isProcessing, setIsProcessing] = useState(false);
      const [confirmOpen, setConfirmOpen] = useState(false);
      const [confirmType, setConfirmType] = useState<"delete" | "edit">("delete");
      const [selectedAcquisition, setSelectedAcquisition] = useState<GetAcquisition | null>(null);

           const fetchData = useCallback(async () => {
              try {
                setIsLoading(true);
                setIsError(false);
          
                const res = await axiosInstance.get("/acquisitiontype/getacquisitiontype", {
                  params: {
                    page,
                    limit,
                    search,
                  },
                });
          
                setAcquisition(res.data.data ?? []);
                setTotalPages(res.data.pagination.totalPages);
              } catch (error) {
                console.error(error);
                setIsError(true);
                setAcquisition([]);
              } finally {
                setIsLoading(false);
              }
            }, [page, limit, search]);
          
            useEffect(() => {
              fetchData();
            }, [fetchData]);
          
            const {
              register,
              handleSubmit,
              control,
              reset,
              formState: { isSubmitting },
            } = useForm<CreateAcquisition>({
              defaultValues: {
                acquisitionTypeName: "",
                status: "active",
              },
            });
          
            const onSubmit = async (data: CreateAcquisition) => {
              if (mode === "edit") {
                setPendingEditData(data);
                setConfirmType("edit");
                setConfirmOpen(true);
                return;
              }
          
              await axiosInstance.post("/acquisitiontype/createacquisitiontype", data);
              reset();
              setIsOpen(false);
              fetchData();
            };
          
            const handleEdit = (acquisition: GetAcquisition) => {
              setMode("edit");
              setSelectedAcquisition(acquisition);
          
              reset({
                acquisitionTypeName: acquisition.acquisitionTypeName,
                status: acquisition.status,
              });
          
              setIsOpen(true);
            };
          
            const handleDeleteClick = (acquisition: GetAcquisition) => {
              setSelectedAcquisition(acquisition);
              setConfirmType("delete");
              setConfirmOpen(true);
            };
          
            const handleConfirm = async () => {
              if (!selectedAcquisition) return;
          
              try {
                setIsProcessing(true);
          
                if (confirmType === "delete") {
                  await axiosInstance.delete(`/acquisitiontype/deleteacquisitiontype/${selectedAcquisition._id}`);
                  fetchData();
                }
          
                setConfirmOpen(false);
                setSelectedAcquisition(null);
              } catch (error) {
                console.error(error);
              } finally {
                setIsProcessing(false);
              }
            };
          
            const confirmEdit = async () => {
              if (!selectedAcquisition || !pendingEditData) return;
          
              try {
                setIsProcessing(true);
          
                await axiosInstance.put(
                  `/acquisitiontype/updateacquisitiontype/${selectedAcquisition._id}`,
                  pendingEditData
                );
          
                setConfirmOpen(false);
                setIsOpen(false);
                setPendingEditData(null);
                setSelectedAcquisition(null);
                reset();
                setMode("create");
          
                fetchData();
              } finally {
                setIsProcessing(false);
              }
            };
  return (
    <div className='font-poppins'>
      <Dashboardheader title="Acquisition Management" />
      <div className='flex items-center justify-between p-8'>
        <Input type="text" placeholder="Search Acquisition..." className="w-[300px] font-poppins"  onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset pagination on new search
          }}/>
        <Button className='cursor-pointer' onClick={() => setIsOpen(true)}>Add Acquisition</Button>
      </div>

      <div className='p-8'>
      <Table className='p-4 '>
        <TableCaption>List of Acquisition</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">#</TableHead>
            <TableHead className="w-50 font-semibold">Acquisition Type ID</TableHead>
            <TableHead className="font-semibold">Acquisition Type Name</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className='w-30 font-semibold'>Actions</TableHead>
         
          </TableRow>
        </TableHeader>
        <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading Acquisitions...
                </TableCell>
              </TableRow>
            )}

            {isError && !isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-500">
                  Failed to load Acquisitions.
                  <Button variant="link" className="ml-2" onClick={fetchData}>
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && acquisition.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-400">
                  No acquisitions found
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              acquisition.map((acquisition, index) => {
                const rowNumber = (page - 1) * limit + index + 1;

                return (
                  <TableRow key={acquisition._id}>
                    <TableCell className="w-12 text-muted-foreground">
                      {rowNumber}
                    </TableCell>

                    <TableCell>{acquisition.acquisitionTypeId}</TableCell>
                    <TableCell>{acquisition.acquisitionTypeName}</TableCell>
                    <TableCell>
                      <StatusDot status={acquisition.status} />
                    </TableCell>

                    <TableCell className="text-right pr-15">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(acquisition)}>
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDeleteClick(acquisition)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
      </Table>

       <div className="flex items-center justify-center gap-4 p-4">
                      <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((prev) => prev - 1)}
                      >
                        Previous
                      </Button>
            
                      <span className="text-sm">
                        Page {page} of {totalPages}
                      </span>
            
                      <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage((prev) => prev + 1)}
                      >
                        Next
                      </Button>
                    </div>
      </div>

             <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={mode === "edit" ? "Edit Acquisition" : "Create Acquisition"}
        className="max-w-none font-poppins"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-8">
          <div className="flex">
            <Label className="w-50">Acquisition Name</Label>
            <Input
              {...register("acquisitionTypeName", {
                required: "Acquisition name is required",
              })}
            />
          </div>

          <div className="flex">
            <Label className="w-50">Status</Label>

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      {" "}
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      Active
                    </SelectItem>
                    <SelectItem value="inactive">
                      {" "}
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {mode === "edit" ? "Save Changes" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

       <ConfirmAction
              open={confirmOpen}
              type={confirmType}
              title={
                confirmType === "delete" ? "Confirm Deletion" : "Confirm Changes"
              }
              description={
                confirmType === "delete" ? (
                  <>
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-red-500">
                      {selectedAcquisition?.acquisitionTypeName}
                    </span>
                    ? This action cannot be undone.
                  </>
                ) : (
                  <>
                    Are you sure you want to save changes to{" "}
                    <span className="font-semibold">{selectedAcquisition?.acquisitionTypeName}</span>?
                  </>
                )
              }
              confirmText={confirmType === "delete" ? "Delete" : "Confirm"}
              isLoading={isProcessing}
              onConfirm={confirmType === "delete" ? handleConfirm : confirmEdit}
              onCancel={() => {
                setConfirmOpen(false);
                setSelectedAcquisition(null);
              }}
            />
    </div>
  )
}

export default Acquisitions
