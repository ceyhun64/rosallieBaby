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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StepCargo({
  cargoOptions,
  selectedCargo,
  setSelectedCargo,
  setStep,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Selection</CardTitle>
        <CardDescription>
          Choose the shipping company for delivering your order.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={selectedCargo || ""}
          onValueChange={(val) => setSelectedCargo(val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a shipping company" />
          </SelectTrigger>
          <SelectContent>
            {cargoOptions.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} ({c.fee.toFixed(2)}€)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className="flex justify-between w-full">
        <Button variant="outline" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button onClick={() => setStep(3)} disabled={!selectedCargo}>
          Go to Card Info
        </Button>
      </CardFooter>
    </Card>
  );
}
