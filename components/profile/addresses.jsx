"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./sideBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2 } from "lucide-react";

export default function Addresses() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: "Home",
      firstName: "Ceyhun",
      lastName: "Türkmen",
      address:
        "Atatürk Street No:12 Apartment:4, Bahçelievler, 34200, Istanbul, Turkey",
      district: "Bahçelievler",
      city: "Istanbul",
      zip: "34200",
      phone: "+90 505 123 45 67",
      country: "Turkey",
    },
    {
      id: 2,
      title: "Work",
      firstName: "Ceyhun",
      lastName: "Türkmen",
      address: "Sanayi Street No:5 Floor:2, Kartal, 34860, Istanbul, Turkey",
      district: "Kartal",
      city: "Istanbul",
      zip: "34860",
      phone: "+90 532 987 65 43",
      country: "Turkey",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [formData, setFormData] = useState({
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
    if (editingAddress) {
      setFormData(editingAddress);
    } else {
      setFormData({
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
    }
  }, [editingAddress]);

  const handleRemove = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (id) => {
    const addressToEdit = addresses.find((a) => a.id === id);
    setEditingAddress(addressToEdit);
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddress.id ? formData : a))
      );
    } else {
      setAddresses((prev) => [...prev, { ...formData, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
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
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-full max-w-3xl md:mt-32 ms-20 mt-20 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
          <Button
            variant={"outline"}
            className="flex items-center gap-2"
            onClick={() => {
              setShowForm((prev) => !prev);
              setEditingAddress(null);
            }}
          >
            {showForm ? (
              <span className="text-xl font-bold">×</span> // Close icon
            ) : (
              <>
                <span className="text-xl font-bold">+</span>{" "}
                {/* Add new address icon */}
                Add New Address
              </>
            )}
          </Button>
        </div>

        {!showForm && (
          <>
            {addresses.length > 0 ? (
              <div className="flex flex-col gap-4 mb-6">
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    className="border rounded-md p-4 bg-white shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{a.title}</h3>
                        <span className="text-sm text-gray-500">
                          {a.country}
                        </span>
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
                        onClick={() => handleEdit(a.id)}
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
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-md bg-blue-100 text-sm text-gray-600 mb-6">
                You have no saved addresses. Please add a new address.
              </div>
            )}
          </>
        )}

        {showForm && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {editingAddress ? "Edit Address" : "New Address"}
            </h3>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="addressTitle">
                  <span className="text-red-500">*</span> Address Title
                </Label>
                <Input
                  id="addressTitle"
                  placeholder="(home, work, etc...)"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="firstName">
                  <span className="text-red-500">*</span> First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="lastName">
                  <span className="text-red-500">*</span> Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="address">
                  <span className="text-red-500">*</span> Address
                </Label>
                <Textarea
                  id="address"
                  rows={3}
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="district">
                  <span className="text-red-500">*</span> District
                </Label>
                <Input
                  id="district"
                  placeholder="District"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="ZIP Code"
                  value={formData.zip}
                  onChange={(e) =>
                    setFormData({ ...formData, zip: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="country">
                  <span className="text-red-500">*</span> Country
                </Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    setFormData({ ...formData, country: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Turkey">Turkey</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="city">
                  <span className="text-red-500">*</span> City
                </Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) =>
                    setFormData({ ...formData, city: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Istanbul">Istanbul</SelectItem>
                    <SelectItem value="Ankara">Ankara</SelectItem>
                    <SelectItem value="Izmir">Izmir</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <div className="flex rounded-md border border-gray-300 overflow-hidden">
                  <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border-r border-gray-300">
                    <img
                      src="https://flagcdn.com/tr.svg"
                      alt="Turkey Flag"
                      className="w-5 h-auto mr-2"
                    />
                    +90
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    className="flex-1 border-0 rounded-none focus-visible:ring-0"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex justify-start mt-6">
                <Button
                  onClick={handleSave}
                  className="w-48 bg-green-700 hover:bg-green-800 rounded-none"
                >
                  SAVE
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
