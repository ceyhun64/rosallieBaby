import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import countries from "@/public/countries.json";

export default function StepAddress({
  user,
  selectedAddress,
  setSelectedAddress,
  setStep,
  isAddingNewAddress,
  setIsAddingNewAddress,
  newAddressForm,
  handleAddressFormChange,
  handleAddNewAddress,
  isSavingAddress,
}) {
  const selectedAddressObject = user?.addresses?.find(
    (a) => a.id.toString() === selectedAddress
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Selection</CardTitle>
        <CardDescription>
          Choose one of your saved addresses for shipping and billing, or add a
          new one.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Saved Addresses Select Input */}
        {user && user.addresses.length > 0 ? (
          <div className="space-y-2">
            <Label htmlFor="address-select">My Saved Addresses</Label>
            <Select
              value={selectedAddress || ""}
              onValueChange={(val) => {
                setSelectedAddress(val);
                setIsAddingNewAddress(false);
              }}
            >
              <SelectTrigger id="address-select">
                <SelectValue
                  placeholder={
                    selectedAddressObject
                      ? `${selectedAddressObject.title} - ${selectedAddressObject.city}`
                      : "Select Address"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {user.addresses.map((addr) => (
                  <SelectItem key={addr.id} value={addr.id.toString()}>
                    {addr.title} - {addr.address.substring(0, 30)}...,{" "}
                    {addr.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">You have no saved addresses.</p>
        )}

        <Separator />

        {/* Add New Address Button */}
        {!isAddingNewAddress ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsAddingNewAddress(true);
              setSelectedAddress("");
            }}
          >
            + Add New Address
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsAddingNewAddress(false)}
          >
            Back to Saved Addresses
          </Button>
        )}

        {/* New Address Form */}
        {isAddingNewAddress && (
          <form
            onSubmit={handleAddNewAddress}
            className="space-y-4 p-4 border rounded-md bg-gray-50"
          >
            <CardTitle className="text-lg">New Address Information</CardTitle>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Address Title (e.g., Home, Work)</Label>
                <Input
                  id="title"
                  value={newAddressForm.title}
                  onChange={handleAddressFormChange}
                  placeholder="My Home"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name (*)</Label>
                <Input
                  id="firstName"
                  value={newAddressForm.firstName}
                  onChange={handleAddressFormChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name (*)</Label>
                <Input
                  id="lastName"
                  value={newAddressForm.lastName}
                  onChange={handleAddressFormChange}
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address Details (Street, Building No, Floor, etc.) (*)
              </Label>
              <Textarea
                id="address"
                value={newAddressForm.address}
                onChange={handleAddressFormChange}
                placeholder="e.g., Flower Street No: 5/A Floor: 3"
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City (*)</Label>
                <Input
                  id="city"
                  value={newAddressForm.city}
                  onChange={handleAddressFormChange}
                  placeholder="City"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District (*)</Label>
                <Input
                  id="district"
                  value={newAddressForm.district}
                  onChange={handleAddressFormChange}
                  placeholder="District"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">Postal Code</Label>
                <Input
                  id="zip"
                  value={newAddressForm.zip}
                  onChange={handleAddressFormChange}
                  placeholder="34700"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <div className="flex rounded-md border border-gray-300 overflow-hidden">
                  {/* Country Code Select */}
                  <Select
                    value={newAddressForm.countryCode || "90"}
                    onValueChange={(val) =>
                      handleAddressFormChange({
                        target: { id: "countryCode", value: val },
                      })
                    }
                  >
                    <SelectTrigger className="flex-[0.7_0_0] h-full px-2 rounded-none border-none bg-gray-100">
                      {/* Sadece code gösterecek */}
                      <span className="text-sm">
                        +{newAddressForm.countryCode || "90"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.iso} value={c.code}>
                          +{c.code} {c.country}{" "}
                          {/* dropdown'ta hem code hem ülke */}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Phone Number */}
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    className="flex-[3_1_0] border-none rounded-none focus-visible:ring-0 min-w-0 px-3"
                    value={newAddressForm.phone}
                    onChange={handleAddressFormChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country (*)</Label>
              <Input
                id="country"
                placeholder="Enter country"
                value={newAddressForm.country}
                onChange={handleAddressFormChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSavingAddress}>
              {isSavingAddress ? "Saving..." : "Save and Select Address"}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="justify-end">
        <Button
          onClick={() => setStep(2)}
          disabled={!selectedAddress || isAddingNewAddress}
        >
          Go to Shipping Selection
        </Button>
      </CardFooter>
    </Card>
  );
}
