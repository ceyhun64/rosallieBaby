"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./sideBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const [addFormData, setAddFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    address: "",
    district: "",
    city: "",
    zip: "",
    phone: "",
    country: "",
  });

  const [editFormData, setEditFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    address: "",
    district: "",
    city: "",
    zip: "",
    phone: "",
    country: "",
  });

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await fetch("/api/address");
        if (!res.ok) throw new Error("Failed to fetch addresses");
        const data = await res.json();
        setAddresses(data.addresses || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    }
    fetchAddresses();
  }, []);

  const handleRemove = async (id) => {
    try {
      const res = await fetch(`/api/address/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete address");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };

  const handleAddSave = async () => {
    try {
      if (
        !addFormData.firstName ||
        !addFormData.lastName ||
        !addFormData.address ||
        !addFormData.district ||
        !addFormData.city ||
        !addFormData.country
      ) {
        toast.error("Lütfen tüm zorunlu alanları (*) doldurun.");
        return;
      }
      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addFormData),
      });

      if (!res.ok) throw new Error("Failed to create address");
      const created = await res.json();
      setAddresses((prev) => [...prev, created.address]);
      toast.success("Address added successfully");
      setShowAddForm(false);
      setAddFormData({
        title: "",
        firstName: "",
        lastName: "",
        address: "",
        district: "",
        city: "",
        zip: "",
        phone: "",
        country: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add address");
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setEditFormData(address);
    setShowEditForm(true);
  };

  const handleEditSave = async () => {
    try {
      const res = await fetch(`/api/address/${editingAddress.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) throw new Error("Failed to update address");
      const updated = await res.json();
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddress.id ? updated.address : a))
      );
      toast.success("Address updated successfully");
      setShowEditForm(false);
      setEditingAddress(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update address");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="w-full max-w-3xl md:mt-32 md:ms-20 px-4">
        {/* Başlık ve Add Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowAddForm((prev) => !prev)}
          >
            {showAddForm ? (
              <span className="text-xl font-bold">×</span>
            ) : (
              "+ Add New Address"
            )}
          </Button>
        </div>

        {/* ADD FORM */}
        {showAddForm && (
          <div className="mb-6 p-4 border rounded-md bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-3">New Address</h3>
            <AddressForm
              formData={addFormData}
              setFormData={setAddFormData}
              onSave={handleAddSave}
            />
          </div>
        )}

        {/* EDIT FORM */}
        {showEditForm && (
          <div className="mb-6 p-4 border rounded-md bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Edit Address</h3>
            <AddressForm
              formData={editFormData}
              setFormData={setEditFormData}
              onSave={handleEditSave}
            />
          </div>
        )}

        {/* Adres Listesi */}
        {!showAddForm && !showEditForm && (
          <div className="flex flex-col gap-4 mb-6">
            {addresses.length > 0 ? (
              addresses.map((a) => (
                <div
                  key={a.id}
                  className="border rounded-md p-4 bg-white shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{a.title}</h3>
                      <span className="text-sm text-gray-500">{a.country}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      {a.firstName} {a.lastName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{a.address}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {a.district} — {a.city} {a.zip}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{a.phone}</p>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(a)}
                      className="p-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleRemove(a.id)}
                      className="p-2 bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-md bg-blue-100 text-sm text-gray-600 mb-6">
                You have no saved addresses. Please add a new address.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== REUSABLE FORM COMPONENT =====
function AddressForm({ formData, setFormData, onSave }) {
  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      {/* ... form alanları aynı kalıyor ... */}
      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="addressTitle">
          <span className="text-red-500">*</span> Address Title
        </Label>
        <Input
          id="addressTitle"
          placeholder="(home, work, etc...)"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      {/* diğer inputlar */}
      <div className="md:col-span-2 flex justify-start mt-6">
        <Button
          type="submit"
          className="w-48 bg-green-700 hover:bg-green-800 rounded-none"
        >
          SAVE
        </Button>
      </div>
    </form>
  );
}
