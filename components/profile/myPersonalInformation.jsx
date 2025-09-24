"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Sidebar from "./sideBar";
import Loading from "@/components/layout/loading";
import Unauthorized from "../layout/unauthorized";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MyPersonalInformation() {
  const isMobile = useIsMobile();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user);
        setFormData({
          firstName: data.user.name || "",
          lastName: data.user.surname || "",
          phone: data.user.phone || "",
          email: data.user.email || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update user");
      const data = await res.json();
      setUser(data.user);
      toast.success("Information updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update information");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!user) return <Unauthorized />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar username={user.name + " " + user.surname} />

      {/* Content */}
      <div className="w-full max-w-2xl md:mt-32 md:ms-20 p-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 text-start">
          My Personal Information
        </h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSave}
        >
          {/* First Name */}
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
              className="w-full"
              required
            />
          </div>

          {/* Last Name */}
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
              className="w-full"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <div className="flex rounded-md border border-gray-300 overflow-hidden">
              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border-r border-gray-300">
                <img
                  src="https://flagcdn.com/tr.svg"
                  alt="Turkey Flag"
                  className="w-5 h-auto mr-2"
                />
                <select className="bg-gray-100 appearance-none outline-none">
                  <option>+90</option>
                </select>
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone number"
                className="flex-1 border-none rounded-none focus-visible:ring-0"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">
              <span className="text-red-500">*</span> Email
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue={user.email}
              disabled
              className="bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Save Button */}
          <div className="md:col-span-2 flex justify-start mt-6">
            <Button
              type="submit"
              className="w-48 bg-green-700 hover:bg-green-800 rounded-none"
              disabled={saving}
            >
              {saving ? "Saving..." : "SAVE"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
