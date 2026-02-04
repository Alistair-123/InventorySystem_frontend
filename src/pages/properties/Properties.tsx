/* eslint-disable @typescript-eslint/no-unused-vars */
import Dashboardheader from "@/components/Dashboardheader";
import React, { useState } from "react";
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

function Property() {
  const [isOpen, setIsOpen] = useState(false);

  /* 🔹 MOCK DATA — replace with API later */
  const items = [
    { id: "ITEM-001", name: "Laptop" },
    { id: "ITEM-002", name: "Printer" },
  ];

  const personnels = [
    { id: "PERS-001", name: "Juan Dela Cruz" },
    { id: "PERS-002", name: "Maria Santos" },
  ];

  const offices = [
    { id: "OFF-001", name: "IT Office" },
    { id: "OFF-002", name: "Admin Office" },
  ];

  const acquisitions = [
    { id: "ACQ-001", name: "Purchased" },
    { id: "ACQ-002", name: "Donated" },
  ];

  return (
    <div className="font-poppins">
      <Dashboardheader title="Property Management" />

      <div className="flex items-center justify-between p-4">
        <Input
          type="text"
          placeholder="Search Properties..."
          className="w-[300px]"
        />
        <Button onClick={() => setIsOpen(true)}>Add Property</Button>
      </div>

      {/* TABLE */}
      <div className="p-8">
        <Table>
          <TableCaption>List of Properties</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Property ID</TableHead>
              <TableHead className="font-semibold">Item Name</TableHead>
              <TableHead className="font-semibold">Acquisition Date</TableHead>
              <TableHead className="font-semibold">Acquisition Name</TableHead>
              <TableHead className="font-semibold">Value</TableHead>
              <TableHead className="font-semibold">Personnel</TableHead>
              <TableHead className="font-semibold">Office</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{/* data here later */}</TableBody>
        </Table>
      </div>

      {/* MODAL */}
      <Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create Property"
  className="max-w-3xl"
>
  <div className="space-y-6 p-6">
    {/* ================= BASIC INFO ================= */}
    <section>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Basic Information
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Property ID</Label>
          <Input placeholder="PROP-001" />
        </div>

        <div>
          <Label>Item Name</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Item" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>

    {/* ================= ACQUISITION ================= */}
    <section>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Acquisition Details
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Date</Label>
          <Input type="date" />
        </div>

        <div>
          <Label>Acquisition Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {acquisitions.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Value</Label>
          <Input type="number" placeholder="₱0.00" />
        </div>
      </div>
    </section>

    {/* ================= ASSIGNMENT ================= */}
    <section>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Assignment
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Personnel</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Personnel" />
            </SelectTrigger>
            <SelectContent>
              {personnels.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Office</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Office" />
            </SelectTrigger>
            <SelectContent>
              {offices.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>

    {/* ================= STATUS ================= */}
    <section>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Property Status
      </h3>

      <div className="max-w-xs">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="serviceable">🟢 Serviceable</SelectItem>
            <SelectItem value="unserviceable">🔴 Unserviceable</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>

    {/* ================= ACTIONS ================= */}
    <div className="flex justify-end gap-2 pt-4 border-t">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button>Save Property</Button>
    </div>
  </div>
</Modal>

    </div>
  );
}

export default Property;
