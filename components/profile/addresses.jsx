"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./sideBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin, Plus, User, Phone, Home, X, Check } from "lucide-react";
import { toast } from "sonner";
import countries from "@/public/countries.json";

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
        toast.error("Please fill all required fields");
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
    setShowAddForm(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 p-6 md:p-12 bg-slate-50/30">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1 tracking-tight">
                My Addresses
              </h1>
              <p className="text-sm text-slate-500">
                Manage your shipping and billing addresses
              </p>
            </div>
            <Button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setShowEditForm(false);
              }}
              className={`px-5 h-10 rounded-lg font-medium transition-all duration-200 text-sm ${
                showAddForm
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              {showAddForm ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </>
              )}
            </Button>
          </div>

          {/* ADD FORM */}
          {showAddForm && (
            <div className="mb-8 bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                      New Address
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add a new shipping or billing address
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <AddressForm
                  formData={addFormData}
                  setFormData={setAddFormData}
                  onSave={handleAddSave}
                />
              </div>
            </div>
          )}

          {/* EDIT FORM */}
          {showEditForm && (
            <div className="mb-8 bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Edit className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                        Edit Address
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Update your address information
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingAddress(null);
                    }}
                    className="w-9 h-9 p-0 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-8">
                <AddressForm
                  formData={editFormData}
                  setFormData={setEditFormData}
                  onSave={handleEditSave}
                />
              </div>
            </div>
          )}

          {/* Address List */}
          {!showAddForm && !showEditForm && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {addresses.length > 0 ? (
                addresses.map((a) => (
                  <div
                    key={a.id}
                    className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all duration-200 overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Home className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                              {a.title || "Address"}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">{a.country}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Button
                            onClick={() => handleEdit(a)}
                            className="w-8 h-8 p-0 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            onClick={() => handleRemove(a.id)}
                            className="w-8 h-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="flex items-center text-slate-700">
                          <User className="h-3.5 w-3.5 mr-2 text-slate-400" />
                          {a.firstName} {a.lastName}
                        </div>
                        <div className="flex items-start text-slate-700">
                          <MapPin className="h-3.5 w-3.5 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                          <span className="leading-relaxed">
                            {a.address}
                            <br />
                            {a.district}, {a.city} {a.zip}
                          </span>
                        </div>
                        {a.phone && (
                          <div className="flex items-center text-slate-700">
                            <Phone className="h-3.5 w-3.5 mr-2 text-slate-400" />
                            {a.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-7 w-7 text-slate-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1 tracking-tight">
                    No addresses yet
                  </h3>
                  <p className="text-sm text-slate-500 mb-5">
                    Add your first address to get started
                  </p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-5 h-10 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddressForm({ formData, setFormData, onSave }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2 space-y-2">
          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            <span className="text-red-400 mr-1">*</span>
            Address Title
          </Label>
          <div className="relative">
            <Input
              placeholder="Home, Work, etc."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="h-11 rounded-lg border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 pl-10 text-sm"
            />
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            <span className="text-red-400 mr-1">*</span>
            First Name
          </Label>
          <div className="relative">
            <Input
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="h-11 rounded-lg border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 pl-10 text-sm"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            <span className="text-red-400 mr-1">*</span>
            Last Name
          </Label>
          <div className="relative">
            <Input
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="h-11 rounded-lg border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 pl-10 text-sm"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Address */}
        <div className="md:col-span-2 space-y-2">
          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            <span className="text-red-400 mr-1">*</span>
            Address
          </Label>
          <div className="relative">
            <Input
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="h-11 rounded-lg border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 pl-10 text-sm"
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* District */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            <span className="text-red-400 mr-1">*</span>
            District
          </Label>
          <Input
            value={formData.district}
            onChange={(e) =>
              setFormData({ ...formData, district: e.target.value })
            }
            className="h-11 rounded-lg border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-sm"
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            <span className="text-red-400 mr-1">*</span>
            City
          </Label>
          <Input
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            className="h-11 rounded-lg border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-sm"
          />
        </div>

        {/* Zip */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            Postal Code
          </Label>
          <Input
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            className="h-11 rounded-lg border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-sm"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Phone</Label>
          <div className="relative">
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="h-11 rounded-lg border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 pl-10 text-sm"
            />
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            <span className="text-red-400 mr-1">*</span>
            Country
          </Label>
          <Input
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            className="h-11 rounded-lg border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-sm"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-slate-100">
        <Button
          onClick={onSave}
          className="px-6 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-sm"
        >
          <Check className="h-4 w-4 mr-2" />
          Save Address
        </Button>
      </div>
    </div>
  );
}