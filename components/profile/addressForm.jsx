"use client";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Save } from "lucide-react";

export default function AddressForm({ formData, setFormData, onSave }) {
  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      {/* Address Title */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="title" className="text-gray-700 font-medium">
          Address Title *
        </Label>
        <Input
          id="title"
          className="rounded-lg h-11 text-[15px]"
          placeholder="e.g., Home, Office…"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      {/* First Name */}
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-gray-700 font-medium">
          First Name *
        </Label>
        <Input
          id="firstName"
          className="rounded-lg h-11 text-[15px]"
          placeholder="John"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          required
        />
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-gray-700 font-medium">
          Last Name *
        </Label>
        <Input
          id="lastName"
          className="rounded-lg h-11 text-[15px]"
          placeholder="Doe"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="email" className="text-gray-700 font-medium">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          className="rounded-lg h-11 text-[15px]"
          placeholder="john.doe@example.com"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country" className="text-gray-700 font-medium">
          Country *
        </Label>
        <Input
          id="country"
          className="rounded-lg h-11 text-[15px]"
          placeholder="Germany"
          value={formData.country || ""}
          onChange={(e) =>
            setFormData({ ...formData, country: e.target.value })
          }
          required
        />
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city" className="text-gray-700 font-medium">
          City *
        </Label>
        <Input
          id="city"
          className="rounded-lg h-11 text-[15px]"
          placeholder="Berlin"
          value={formData.city || ""}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />
      </div>

      {/* District */}
      <div className="space-y-2">
        <Label htmlFor="district" className="text-gray-700 font-medium">
          District *
        </Label>
        <Input
          id="district"
          className="rounded-lg h-11 text-[15px]"
          placeholder="Mitte"
          value={formData.district || ""}
          onChange={(e) =>
            setFormData({ ...formData, district: e.target.value })
          }
          required
        />
      </div>

      {/* Neighborhood */}
      <div className="space-y-2">
        <Label htmlFor="neighborhood" className="text-gray-700 font-medium">
          Neighborhood *
        </Label>
        <Input
          id="neighborhood"
          className="rounded-lg h-11 text-[15px]"
          placeholder="Tiergarten"
          value={formData.neighborhood || ""}
          onChange={(e) =>
            setFormData({ ...formData, neighborhood: e.target.value })
          }
          required
        />
      </div>

      {/* Postal Code */}
      <div className="space-y-2">
        <Label htmlFor="zip" className="text-gray-700 font-medium">
          Postal Code *
        </Label>
        <Input
          id="zip"
          className="rounded-lg h-11 text-[15px]"
          placeholder="10115"
          value={formData.zip || ""}
          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
          required
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-gray-700 font-medium">
          Phone *
        </Label>
        <Input
          id="phone"
          className="rounded-lg h-11 text-[15px]"
          placeholder="+49 170 1234567"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      {/* Detailed Address */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address" className="text-gray-700 font-medium">
          Detailed Address *
        </Label>
        <Input
          id="address"
          className="rounded-lg h-11 text-[15px]"
          placeholder="Alexanderplatz 1, Building A, Floor 3"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          required
        />
      </div>

      {/* Save Button */}
      <div className="md:col-span-2 flex justify-start mt-4">
        <Button
          type="submit"
          className="flex items-center gap-3 px-8 py-3 text-lg rounded-full shadow-lg bg-gradient-to-br from-[#7B0323] to-[#B3133C] hover:opacity-90 transition"
        >
          <Save size={18} /> Save
        </Button>
      </div>
    </form>
  );
}
