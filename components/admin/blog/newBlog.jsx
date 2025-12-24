"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const categories = [
  "Guides",
  "Tips",
  "Gift Ideas",
  "Education",
  "Parenting",
  "Product Care",
];

export default function NewBlogForm() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    published: false,
    featured: false,
    metaTitle: "",
    metaDescription: "",
  });

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
      metaTitle: formData.metaTitle || title,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Blog oluşturulamadı");
      }

      alert("Blog başarıyla oluşturuldu!");
      router.push("/admin/blog");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white flex-col md:flex-row">
      <Sidebar />

      <main className={`flex-1 p-4 md:p-8 ${isMobile ? "ml-0" : "ml-64"}`}>
        <div className="flex items-center gap-4 mb-6 ms-12 mt-2">
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={18} className="mr-2" />
              Geri
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Yeni Blog Yazısı</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Blog başlığı..."
              className="bg-stone-900 border-stone-700"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="blog-yazisi-url"
              className="bg-stone-900 border-stone-700"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Kategori *</Label>
            <Select
              value={formData.category}
              onValueChange={(val) =>
                setFormData({ ...formData, category: val })
              }
            >
              <SelectTrigger className="w-full bg-stone-900 border-stone-700">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent className="bg-stone-900 border-stone-700">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Özet *</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Kısa açıklama (liste görünümünde gösterilir)..."
              className="bg-stone-900 border-stone-700 min-h-[80px]"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">İçerik *</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Blog içeriği (HTML destekler)..."
              className="bg-stone-900 border-stone-700 min-h-[300px]"
              required
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image">Görsel URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://... veya /blog/image.jpg"
              className="bg-stone-900 border-stone-700"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, published: checked })
                }
              />
              <Label htmlFor="published">Yayınla</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, featured: checked })
                }
              />
              <Label htmlFor="featured">Öne Çıkar</Label>
            </div>
          </div>

          {/* SEO Fields */}
          <div className="border-t border-stone-700 pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-stone-300">
              SEO Ayarları
            </h3>
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Başlık</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="SEO başlığı (boş bırakılırsa blog başlığı kullanılır)"
                className="bg-stone-900 border-stone-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Açıklama</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="SEO açıklaması (boş bırakılırsa özet kullanılır)"
                className="bg-stone-900 border-stone-700"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Save size={18} className="mr-2" />
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
            <Link href="/admin/blog">
              <Button
                type="button"
                variant="outline"
                className="border-stone-600"
              >
                İptal
              </Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
