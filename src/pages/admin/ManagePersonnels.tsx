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
  <div className="max-w-3xl mx-auto">
    {/* Card Container with gradient border effect */}
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-lg overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative p-8">
        {/* Header Section */}
        <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
          {/* Avatar with ring */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-pulse opacity-75" />
            <img
              src={resolveImageUrl(selectedPersonnel.personnelImage)}
              alt="Personnel"
              className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              onError={(e) => {
                e.currentTarget.src = "/image.png";
              }}
            />
            {/* Status indicator */}
            <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${
              selectedPersonnel.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedPersonnel.firstName}
              {selectedPersonnel.middleName && ` ${selectedPersonnel.middleName}`}
              {" "}{selectedPersonnel.lastName}
            </h2>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
                {selectedPersonnel.role}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {selectedPersonnel.designationName}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                selectedPersonnel.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedPersonnel.status}
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setSelectedPersonnel(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Details Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detail Item Component */}
          {[
            { label: 'Personnel ID', value: selectedPersonnel.personnelId, icon: '🆔' },
            { label: 'Personnel Type', value: selectedPersonnel.personnelType, icon: '👤' },
            { label: 'Department Role', value: selectedPersonnel.role, icon: '💼' },
            { label: 'Status', value: selectedPersonnel.status, icon: '📊' },
            { 
              label: 'Joined', 
              value: new Date(selectedPersonnel.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }), 
              icon: '📅' 
            },
            { 
              label: 'Last Updated', 
              value: new Date(selectedPersonnel.updatedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }), 
              icon: '🔄' 
            },
          ].map((item, index) => (
            <div 
              key={index}
              className="group p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 capitalize truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Personnel details • Last viewed {new Date().toLocaleTimeString()}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedPersonnel(null)}
            className="hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to list
          </Button>
        </div>
      </div>
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
