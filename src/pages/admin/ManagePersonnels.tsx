import React, { useEffect, useState } from "react";
import type { Personnel } from "./types/types";
import { fetchPersonnel, fetchPersonnelById } from "./api/fetchData";
import { resolveImageUrl } from "../../utils/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function ManagePersonnels() {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPersonnel, setSelectedPersonnel] =
    useState<Personnel | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    const loadPersonnel = async () => {
      try {
        const data = await fetchPersonnel();
        setPersonnels(data);
      } catch (error) {
        console.error("Failed to fetch personnel:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPersonnel();
  }, []);

  const handleView = async (id: string) => {
    try {
      setViewLoading(true);
      const data = await fetchPersonnelById(id);
      setSelectedPersonnel(data);
    } catch (error) {
      console.error("Failed to fetch personnel:", error);
    } finally {
      setViewLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading personnels...</div>;
  }

  return (
    <div>
      {/* ================= VIEW CARD ================= */}
        {selectedPersonnel && (
  <div className="max-w-2xl mx-auto border rounded-lg p-4 bg-white shadow-sm">
    {/* Header */}
    <div className="flex items-center gap-5">
      <img
        src={resolveImageUrl(selectedPersonnel.personnelImage)}
        alt="Personnel"
        className="w-20 h-20 rounded-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "/image.png";
        }}
      />

      <div>
        <h2 className="text-2xl font-med">
          {selectedPersonnel.firstName}
          {selectedPersonnel.middleName
            ? ` ${selectedPersonnel.middleName}`
            : ""}{" "}
          {selectedPersonnel.lastName}
        </h2>

        

        <p className="text-sm capitalize">
          Role: {selectedPersonnel.role}
        </p>

        <p className="text-sm">
          Designation: {selectedPersonnel.designationName}
        </p>
      </div>
    </div>

    {/* Details */}
    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="font-medium">Personnel ID:</span>{" "}
        {selectedPersonnel.personnelId}
      </div>

      <div>
        <span className="font-medium">Personnel Type:</span>{" "}
        {selectedPersonnel.personnelType}
      </div>

      <div>
        <span className="font-medium">Status:</span>{" "}
        <span className="capitalize">
          {selectedPersonnel.status}
        </span>
      </div>

      <div>
        <span className="font-medium">Role:</span>{" "}
        {selectedPersonnel.role}
      </div>

      <div>
        <span className="font-medium">Created At:</span>{" "}
        {new Date(selectedPersonnel.createdAt).toLocaleString()}
      </div>

      <div>
        <span className="font-medium">Last Updated:</span>{" "}
        {new Date(selectedPersonnel.updatedAt).toLocaleString()}
      </div>
    </div>

    {/* Actions */}
    <div className="mt-6 text-right">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setSelectedPersonnel(null)}
      >
        Back to list
      </Button>
    </div>
  </div>
)}


      {/* ================= TABLE ================= */}
      {!selectedPersonnel && (
        <Table className="rounded-md">
          <TableHeader className="bg-gray-100 rounded-md">
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Personnel ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {personnels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No personnel found.
                </TableCell>
              </TableRow>
            ) : (
              personnels.map((personnel) => (
                <TableRow key={personnel._id}>
                  <TableCell>
                    <img
                      src={resolveImageUrl(personnel.personnelImage)}
                      alt="Personnel"
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/image.png";
                      }}
                    />
                  </TableCell>

                  <TableCell>{personnel.personnelId}</TableCell>

                  <TableCell>
                    {personnel.firstName} {personnel.lastName}
                  </TableCell>

                  <TableCell className="capitalize">
                    {personnel.role}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-black hover:text-white transition"
                      onClick={() => handleView(personnel._id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default ManagePersonnels;
