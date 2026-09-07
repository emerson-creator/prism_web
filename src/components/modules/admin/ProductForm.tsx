"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";
import * as api from "@/libs/api";
import { validateRequired } from "@/libs/validation";
import type { Category, CreateProductPayload, Product } from "@/libs/types";

interface FormErrors {
  name?: string;
  price?: string;
  stock?: string;
  sku?: string;
  categoryId?: string;
}

export function ProductForm({
  categories,
  initialProduct,
}: {
  categories: Category[];
  initialProduct?: Product;
}) {
  const router = useRouter();
  const isEditing = !!initialProduct;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialProduct?.name ?? "");
  const [description, setDescription] = useState(
    initialProduct?.description ?? "",
  );
  const [price, setPrice] = useState(initialProduct?.price?.toString() ?? "");
  const [stock, setStock] = useState(initialProduct?.stock?.toString() ?? "");
  const [sku, setSku] = useState(initialProduct?.sku ?? "");
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId ?? "",
  );
  const [isActive, setIsActive] = useState(initialProduct?.isActive ?? true);
  const [imageUrl, setImageUrl] = useState(initialProduct?.imageUrl ?? "");

  const [errors, setErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function clearError(field: keyof FormErrors) {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function validate(): boolean {
    const priceNum = Number(price);
    const stockNum = Number(stock);

    const next: FormErrors = {
      name: validateRequired(name, "Name") ?? undefined,
      price:
        !price || Number.isNaN(priceNum) || priceNum < 0
          ? "Enter a valid price"
          : undefined,
      stock:
        !stock || Number.isNaN(stockNum) || stockNum < 0
          ? "Enter a valid stock quantity"
          : undefined,
      sku: validateRequired(sku, "SKU") ?? undefined,
      categoryId: validateRequired(categoryId, "Category") ?? undefined,
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setSaveError(null);
    try {
      const result = await api.uploadProductImage(file);
      setImageUrl(result.url);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setSaveError(null);

    const payload: CreateProductPayload = {
      name,
      description: description || undefined,
      price: Number(price),
      stock: Number(stock),
      sku,
      categoryId,
      isActive,
      imageUrl: imageUrl || undefined,
    };

    try {
      if (isEditing) {
        await api.updateProduct(initialProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }
      router.push("/admin/products");
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not save product",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-6 flex flex-col gap-6"
    >
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">
          Product image
        </label>
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlus
                className="h-6 w-6 text-muted-foreground"
                strokeWidth={1.5}
              />
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleImageSelect}
              disabled={isUploading}
              className="hidden"
              id="product-image-input"
            />
            <label
              htmlFor="product-image-input"
              className={[
                "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-muted",
                isUploading ? "pointer-events-none opacity-60" : "",
              ].join(" ")}
            >
              {isUploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isUploading
                ? "Uploading…"
                : imageUrl
                  ? "Replace image"
                  : "Upload image"}
            </label>
            <p className="mt-1.5 text-[11.5px] text-muted-foreground">
              JPEG, PNG, WebP or AVIF. Max 5MB.
            </p>
          </div>
        </div>
      </div>

      <Field
        label="Name"
        value={name}
        onChange={(v) => {
          setName(v);
          clearError("name");
        }}
        error={errors.name}
      />

      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-background px-3.5 py-2.5 text-[14px] text-foreground outline-none transition-colors focus:border-foreground"
        />
      </div>

      <div className="flex gap-3">
        <Field
          label="Price (USD)"
          value={price}
          onChange={(v) => {
            setPrice(v);
            clearError("price");
          }}
          error={errors.price}
          inputMode="decimal"
        />
        <Field
          label="Stock"
          value={stock}
          onChange={(v) => {
            setStock(v);
            clearError("stock");
          }}
          error={errors.stock}
          inputMode="numeric"
        />
      </div>

      <div className="flex gap-3">
        <Field
          label="SKU"
          value={sku}
          onChange={(v) => {
            setSku(v);
            clearError("sku");
          }}
          error={errors.sku}
        />
        <div className="flex-1">
          <label className="mb-1.5 block text-[13px] font-medium text-foreground">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              clearError("categoryId");
            }}
            className={[
              "h-11 w-full rounded-lg border bg-background px-3.5 text-[14px] text-foreground outline-none transition-colors",
              errors.categoryId
                ? "border-red-400 focus:border-red-500"
                : "border-border focus:border-foreground",
            ].join(" ")}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1.5 text-[12px] text-red-600">
              {errors.categoryId}
            </p>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-[13px] text-foreground">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        Active (visible in the store)
      </label>

      {saveError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
          {saveError}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-[14px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? "Saving…" : isEditing ? "Save changes" : "Create product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  inputMode?: "decimal" | "numeric";
}) {
  return (
    <div className="flex-1">
      <label className="mb-1.5 block text-[13px] font-medium text-foreground">
        {label}
      </label>
      <input
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={[
          "h-11 w-full rounded-lg border bg-background px-3.5 text-[14px] text-foreground outline-none transition-colors",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-border focus:border-foreground",
        ].join(" ")}
      />
      {error && <p className="mt-1.5 text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
