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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Truck,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Package,
} from "lucide-react";

export default function StepCargo({
  cargoOptions,
  selectedCargo,
  setSelectedCargo,
  setStep,
}) {
  const getCargoIcon = (id) => {
    if (id === "express") {
      return <Zap className="w-5 h-5 text-orange-600" />;
    }
    return <Truck className="w-5 h-5 text-blue-600" />;
  };

  const selectedOption = cargoOptions.find((c) => c.id === selectedCargo);

  return (
    <div className="space-y-6">
      {/* Information Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-blue-900 font-medium mb-1">Shipping Selection</p>
          <p className="text-blue-700">
            Choose the appropriate shipping option for your order
          </p>
        </div>
      </div>

      <Card className={"p-4 py-8"}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            Shipping Method
          </CardTitle>
          <CardDescription>
            Determine your delivery speed and cost
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedCargo || ""}
            onValueChange={setSelectedCargo}
            className="space-y-3"
          >
            {cargoOptions.map((cargo) => (
              <div
                key={cargo.id}
                className={`relative flex items-center space-x-3 rounded-lg border-2 p-4 transition-all cursor-pointer ${
                  selectedCargo === cargo.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                }`}
                onClick={() => setSelectedCargo(cargo.id)}
              >
                <div className="flex items-start gap-3 flex-1">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getCargoIcon(cargo.id)}
                  </div>

                  {/* Cargo Information */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Label
                        htmlFor={cargo.id}
                        className="text-base font-semibold cursor-pointer"
                      >
                        {cargo.name}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      {cargo.id === "express"
                        ? "Delivery within 1-2 business days"
                        : "Delivery within 3-5 business days"}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right flex flex-col items-end">
                    <p className="text-lg font-bold text-gray-900">
                      € {cargo.fee.toFixed(2)}
                    </p>
                    <RadioGroupItem
                      value={cargo.id}
                      id={cargo.id}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          {/* Selected Summary */}
          {selectedOption && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="w-5 h-5" />
                <div className="flex-1">
                  <p className="font-medium">Selected: {selectedOption.name}</p>
                  <p className="text-sm">
                    Shipping Fee: € {selectedOption.fee.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-6">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            className="w-full sm:w-auto h-12"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return to Address
          </Button>
          <Button
            onClick={() => setStep(3)}
            disabled={!selectedCargo}
            className="w-full sm:flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            <span className="flex items-center gap-2">
              Proceed to Payment
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>
        </CardFooter>
      </Card>

      {/* Bottom Information */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
        <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Shipping Information
        </h4>
        <ul className="space-y-1.5 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <span>Standard shipping delivers within 3-5 business days</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
            <span>Express shipping delivers within 1-2 business days</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <span>Tracking number will be sent via email</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
            <span>All shipments are insured</span>
          </li>
        </ul>
      </div>
    </div>
  );
}