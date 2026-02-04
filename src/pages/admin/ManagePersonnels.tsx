import React, { useEffect, useState } from "react";
import type { Personnel } from './types/types';
import { fetchPersonnel } from './api/fetchData';
import { resolveImageUrl } from "../../utils/image";

// Optional UI components (adjust to your setup)
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

  const handleView = (id: string) => {
    // Replace with your routing logic
    // example (Inertia): router.visit(`/personnel/${id}`)
    // example (React Router): navigate(`/personnel/${id}`)
    console.log("View personnel:", id);
  };

  if (loading) {
    return <div className="p-4">Loading personnels...</div>;
  }

  return (
    <div className="  ">
    

      <Table className="rounded-md">
        <TableHeader className="bg-gray-100 rounded-md">
          <TableRow >
            <TableHead className=" font-semibold">Image</TableHead>
            <TableHead className=" font-semibold">Personnel ID</TableHead>
            <TableHead className=" font-semibold">Name</TableHead>
            <TableHead className=" font-semibold">Role</TableHead>
            <TableHead className="text-right font-semibold">Action</TableHead>
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
                {/* Image */}
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

                {/* Personnel ID */}
                <TableCell>{personnel.personnelId}</TableCell>

                {/* Name */}
                <TableCell>
                  {personnel.firstName} {personnel.lastName}
                </TableCell>

                {/* Role */}
                <TableCell className="capitalize">
                  {personnel.role}
                </TableCell>

                {/* Action */}
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
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
    </div>
  );
}

export default ManagePersonnels;
