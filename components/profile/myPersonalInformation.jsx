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
import { Save, Mail, Phone, User, Check, Shield, CheckCircle } from "lucide-react";
import countries from "@/public/countries.json";
import { Skeleton } from "../ui/skeleton";

export default function MyPersonalInformation() {
  const isMobile = useIsMobile();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    countryCode: "90",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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
          countryCode: "90",
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

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fullPhone = formData.phone
        ? `+${formData.countryCode || "90"}${formData.phone}`
        : "";

      const payload = {
        ...formData,
        phone: fullPhone,
      };

      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update user");
      const data = await res.json();
      setUser(data.user);
      setHasChanges(false);
      toast.success("Your information has been updated successfully", {
        icon: <Check className="h-5 w-5" />,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update information. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!user) return <Unauthorized />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <Sidebar username={user.name + " " + user.surname} />

      <div className="flex-1 p-6 md:p-12 bg-slate-50/30">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-slate-900 mb-1 tracking-tight">
              Personal Information
            </h1>
            <p className="text-sm text-slate-500">
              Manage your personal details and contact information
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {/* Card Header */}
            <div className="px-8 py-6 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                    Account Details
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update your profile information
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* First Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-xs font-medium text-slate-600 flex items-center uppercase tracking-wide"
                  >
                    <span className="text-red-400 mr-1">*</span>
                    First Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="pl-10 h-11 rounded-lg border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-sm"
                      placeholder="Enter your first name"
                      required
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-xs font-medium text-slate-600 flex items-center uppercase tracking-wide"
                  >
                    <span className="text-red-400 mr-1">*</span>
                    Last Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="pl-10 h-11 rounded-lg border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-sm"
                      placeholder="Enter your last name"
                      required
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Phone - DÜZELTİLMİŞ VERSİYON */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-xs font-medium text-slate-600 uppercase tracking-wide"
                  >
                    Phone Number
                  </Label>
                  <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <div className="relative w-28 flex-shrink-0">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                      <select
                        className="w-full h-11 pl-10 pr-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 cursor-pointer appearance-none hover:bg-slate-50 transition-colors focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                        value={formData.countryCode || "90"}
                        onChange={(e) =>
                          handleInputChange("countryCode", e.target.value)
                        }
                      >
                        {countries.map((c) => (
                          <option key={c.iso} value={c.code}>
                            +{c.code} {c.country}
                          </option>
                        ))}
                      </select>
                      {/* Selected value display */}
                      <div className="absolute inset-0 pointer-events-none flex items-center pl-10 pr-2">
                        <span className="text-xs text-slate-700">
                          +{formData.countryCode || "90"}
                        </span>
                      </div>
                    </div>

                    {/* Phone Input */}
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="5XX XXX XX XX"
                      className="flex-1 h-11 rounded-lg border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-sm"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs font-medium text-slate-600 flex items-center uppercase tracking-wide"
                  >
                    <span className="text-red-400 mr-1">*</span>
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="pl-10 h-11 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200 text-sm"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Email address cannot be changed
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  {hasChanges && (
                    <span className="flex items-center text-amber-600">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
                      Unsaved changes
                    </span>
                  )}
                </div>
                <Button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  className="px-6 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">
                    Secure & Private
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Your information is encrypted and protected
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 mb-1 uppercase tracking-wide">
                    Email Verified
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Your email address has been confirmed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}