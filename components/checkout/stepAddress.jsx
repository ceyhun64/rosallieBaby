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
import AdresForm from "../profile/addressForm";
import {
  MapPin,
  Plus,
  CheckCircle2,
  Home,
  Building2,
  User,
  Phone,
  ArrowRight,
  ChevronRight,
  Loader2,
} from "lucide-react";

const Spinner = () => <Loader2 className="w-5 h-5 animate-spin" />;

export default function StepAddress({
  addresses = [],
  selectedAddress,
  onSelectAddress,
  onNext,
  newAddressForm,
  setNewAddressForm,
  onSaveAddress,
  isAddingNewAddress,
  setIsAddingNewAddress,
  isSavingAddress,
}) {
  const safeAddresses = Array.isArray(addresses) ? addresses : [];
  const normalizedSelectedAddress = selectedAddress ? Number(selectedAddress) : null;
  const selected = safeAddresses.find((a) => a.id === normalizedSelectedAddress);

  const getAddressIcon = (title) => {
    const lowerTitle = title?.toLowerCase() || "";
    if (lowerTitle.includes("home") || lowerTitle.includes("ev")) {
      return <Home className="w-5 h-5 text-blue-600" />;
    }
    if (
      lowerTitle.includes("work") ||
      lowerTitle.includes("office") ||
      lowerTitle.includes("iş") ||
      lowerTitle.includes("ofis")
    ) {
      return <Building2 className="w-5 h-5 text-purple-600" />;
    }
    return <MapPin className="w-5 h-5 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Information Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-blue-900 font-medium mb-1">Delivery Address</p>
          <p className="text-blue-700">
            Select the address where your order will be delivered or add a new address
          </p>
        </div>
      </div>

      <Card className={"p-4 py-8"}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Delivery Address
          </CardTitle>
          <CardDescription>
            Select one of your saved addresses or add a new address
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Saved Addresses */}
          {safeAddresses.length > 0 && !isAddingNewAddress && (
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Home className="w-4 h-4" />
                My Saved Addresses ({safeAddresses.length})
              </Label>

              {/* Address Cards */}
              <div className="space-y-3">
                {safeAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => {
                      onSelectAddress(addr.id);
                      setIsAddingNewAddress(false);
                    }}
                    className={`
                      relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${
                        normalizedSelectedAddress === addr.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                      }
                    `}
                  >
                    {/* Selected checkmark */}
                    {normalizedSelectedAddress === addr.id && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="w-6 h-6 text-blue-600 fill-blue-100" />
                      </div>
                    )}

                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getAddressIcon(addr.title)}
                      </div>

                      {/* Address Information */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between pr-8">
                          <h4 className="font-semibold text-gray-900 text-base">
                            {addr.title}
                          </h4>
                        </div>

                        <div className="space-y-1.5 text-sm text-gray-600">
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                            <span>
                              {addr.firstName} {addr.lastName}
                            </span>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                            <span className="line-clamp-2">
                              {addr.address}
                              {addr.neighborhood && `, ${addr.neighborhood}`}
                              {`, ${addr.district}/${addr.city}`}
                              {addr.zip && ` - ${addr.zip}`}
                            </span>
                          </div>

                          {addr.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                              <span>{addr.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alternative Dropdown Selector */}
              <div className="pt-2">
                <Label
                  htmlFor="address-select"
                  className="text-sm text-gray-600"
                >
                  or select quickly:
                </Label>
                <Select
                  value={normalizedSelectedAddress?.toString() || ""}
                  onValueChange={(val) => {
                    onSelectAddress(Number(val));
                    setIsAddingNewAddress(false);
                  }}
                >
                  <SelectTrigger id="address-select" className="mt-1 h-11">
                    <SelectValue
                      placeholder={
                        selected
                          ? `${selected.title} - ${selected.city}`
                          : "Select Address"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {safeAddresses.map((addr) => (
                      <SelectItem key={addr.id} value={addr.id.toString()}>
                        <div className="flex items-center gap-2">
                          {getAddressIcon(addr.title)}
                          <span>
                            {addr.title} - {addr.city}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* No Address Message */}
          {safeAddresses.length === 0 && !isAddingNewAddress && (
            <div className="text-center py-8 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">
                You don't have any saved addresses yet
              </p>
              <p className="text-sm text-gray-500">
                Please add an address to continue
              </p>
            </div>
          )}

          {/* Separator */}
          {safeAddresses.length > 0 && !isAddingNewAddress && (
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs text-gray-500 font-medium">
                OR
              </span>
            </div>
          )}

          {/* Add New Address Button */}
          {!isAddingNewAddress ? (
            <Button
              variant="outline"
              className="w-full h-12 border-2 border-dashed hover:border-blue-500 hover:bg-blue-50 transition-all group"
              onClick={() => {
                setIsAddingNewAddress(true);
                onSelectAddress(null);
              }}
            >
              <Plus className="w-5 h-5 mr-2 group-hover:text-blue-600" />
              <span className="font-medium">Add New Address</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={() => {
                setIsAddingNewAddress(false);
                if (safeAddresses.length > 0) {
                  onSelectAddress(safeAddresses[0].id);
                }
              }}
              disabled={isSavingAddress}
            >
              ← Return to Saved Addresses
            </Button>
          )}

          {/* New Address Form */}
          {isAddingNewAddress && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Address Information
                </h4>
                <p className="text-sm text-gray-600">
                  Fill in all fields completely
                </p>
              </div>

              <div className="p-5 border-2 border-gray-200 rounded-lg bg-white">
                <AdresForm
                  formData={newAddressForm}
                  setFormData={setNewAddressForm}
                  onSave={onSaveAddress}
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={onSaveAddress}
                disabled={isSavingAddress}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {isSavingAddress ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Save Address and Continue
                  </span>
                )}
              </Button>
            </div>
          )}
        </CardContent>

        {/* Footer - Next Button */}
        {!isAddingNewAddress && (
          <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-6">
            <div className="flex-1 text-sm text-gray-600">
              {normalizedSelectedAddress ? (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Address selected, you can continue</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Select an address to continue</span>
                </div>
              )}
            </div>
            <Button
              onClick={onNext}
              disabled={!normalizedSelectedAddress || isSavingAddress}
              className="w-full sm:w-auto h-12 bg-green-600 hover:bg-green-700 text-white font-semibold px-8"
              size="lg"
            >
              <span className="flex items-center gap-2">
                Proceed to Shipping
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Bottom Information */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
        <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Delivery Information
        </h4>
        <ul className="space-y-1.5 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <span>Your order will be delivered to the selected address</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <span>You must be reachable at your phone number during delivery</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <span>
              You can edit your address information later from my profile
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}