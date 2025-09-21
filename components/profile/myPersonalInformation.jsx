"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Sidebar from "./sideBar";
import Loading from "@/components/layout/loading";
import Unauthorized from "../layout/unauthorized";

export default function MyPersonalInformation() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/account/check");
      const data = await res.json();
      setUser(data.user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <Loading />;
  if (!user) return <Unauthorized />;

  return (
    <div className="flex min-h-screen">
      <Sidebar username={user.name + " " + user.surname} />
      <div className="w-full max-w-2xl md:mt-32 justify-center items-start ms-20 mt-20">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 text-start">
          My Personal Information
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-1">
            <Label htmlFor="firstName">
              <span className="text-red-500">*</span> First Name
            </Label>
            <Input id="firstName" defaultValue={user.name} className="w-full" />
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <Label htmlFor="lastName">
              <span className="text-red-500">*</span> Last Name
            </Label>
            <Input
              id="lastName"
              defaultValue={user.surname}
              className="w-full"
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
                className="flex-1 border-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-none focus-visible:outline-none"
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
            <Button className="w-48 bg-green-700 hover:bg-green-800 rounded-none">
              SAVE
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
