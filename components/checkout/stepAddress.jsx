// components/payment/StepAddress.jsx
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
        <CardTitle>Adres Seçimi</CardTitle>
        <CardDescription>
          Teslimat ve fatura için kayıtlı adreslerinizden birini seçiniz veya
          yeni bir adres ekleyiniz.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Kayıtlı Adresler Select Input */}
        {user && user.addresses.length > 0 ? (
          <div className="space-y-2">
            <Label htmlFor="address-select">Kayıtlı Adreslerim</Label>
            <Select
              value={selectedAddress || ""}
              onValueChange={(val) => {
                setSelectedAddress(val);
                setIsAddingNewAddress(false); // Kayıtlı adres seçilirse formu kapat
              }}
            >
              <SelectTrigger id="address-select">
                <SelectValue
                  placeholder={
                    selectedAddressObject
                      ? `${selectedAddressObject.title} - ${selectedAddressObject.city}`
                      : "Adres seçiniz"
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
          <p className="text-gray-500 text-sm">
            Kayıtlı adresiniz bulunmamaktadır.
          </p>
        )}

        <Separator />

        {/* Yeni Adres Ekle Butonu */}
        {/* Buton Tıklaması: isAddingNewAddress state'ini değiştirir */}
        {!isAddingNewAddress ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsAddingNewAddress(true);
              setSelectedAddress(""); // Yeni adres eklenirken seçim kaldırılır
            }}
          >
            + Yeni Adres Ekle
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsAddingNewAddress(false)}
          >
            Kayıtlı Adreslere Geri Dön
          </Button>
        )}

        {/* Yeni Adres Ekleme Formu */}
        {isAddingNewAddress && (
          <form
            onSubmit={handleAddNewAddress}
            className="space-y-4 p-4 border rounded-md bg-gray-50"
          >
            <CardTitle className="text-lg">Yeni Adres Bilgileri</CardTitle>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Adres Başlık, İsim, Soyisim alanları... */}
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="title">Adres Başlığı (örn: Ev, İş)</Label>
                <Input
                  id="title"
                  value={newAddressForm.title}
                  onChange={handleAddressFormChange}
                  placeholder="Ev Adresim"
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="firstName">Adınız (*)</Label>
                <Input
                  id="firstName"
                  value={newAddressForm.firstName}
                  onChange={handleAddressFormChange}
                  placeholder="Adınız"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="lastName">Soyadınız (*)</Label>
                <Input
                  id="lastName"
                  value={newAddressForm.lastName}
                  onChange={handleAddressFormChange}
                  placeholder="Soyadınız"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Adres Detayı (Sokak, Bina No, Kat vb.) (*)
              </Label>
              <Textarea
                id="address"
                value={newAddressForm.address}
                onChange={handleAddressFormChange}
                placeholder="Örn: Çiçek Sokak No: 5/A Kat: 3"
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="city">İl (*)</Label>
                <Input
                  id="city"
                  value={newAddressForm.city}
                  onChange={handleAddressFormChange}
                  placeholder="İstanbul"
                  required
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="district">İlçe (*)</Label>
                <Input
                  id="district"
                  value={newAddressForm.district}
                  onChange={handleAddressFormChange}
                  placeholder="Kadıköy"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="zip">Posta Kodu</Label>
                <Input
                  id="zip"
                  value={newAddressForm.zip}
                  onChange={handleAddressFormChange}
                  placeholder="34700"
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={newAddressForm.phone}
                  onChange={handleAddressFormChange}
                  placeholder="5XX XXX XX XX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Ülke (*)</Label>
              <Input id="country" value="Türkiye" readOnly disabled />
            </div>

            <Button type="submit" className="w-full" disabled={isSavingAddress}>
              {isSavingAddress ? "Kaydediliyor..." : "Adresi Kaydet ve Seç"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          onClick={() => setStep(2)}
          disabled={!selectedAddress || isAddingNewAddress}
        >
          Kargo Seçimine Git
        </Button>
      </CardFooter>
    </Card>
  );
}
