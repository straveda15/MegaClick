import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";
import { opsKeys } from "./useOperations";

const BASE = API_BASE + "/api/products";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* â”€â”€ Types â”€â”€ */
export interface Product {
  _id: string;
  id?: number;
  sku?: string;
  slug: string;
  name: string;
  hindi?: string;
  tag?: string;
  cat?: string;
  desc?: string;
  benefits?: string[];
  price: number;
  orig?: number;
  rating?: number;
  reviews?: number;
  img?: string;
  hoverImg?: string;
  gallery?: string[];
  instagramVideoUrl?: string;
  instagramVideoThumbnail?: string;
  instagramVideoDirectUrl?: string;
  instagramVideoCloudinaryPublicId?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  circleColor?: string;
  stock?: number;
  stockStatus?: "available" | "out_of_stock";
  story?: any;
  customerReviews?: any[];
  isFeatured?: boolean;
  isActive?: boolean;
  shipping?: {
    weight?: string | null;  // e.g. "220gm"
    length?: string | null;  // e.g. "90.2mm"
    width?: string | null;   // e.g. "29cm"
    height?: string | null;  // e.g. "90.2mm"
  };
  recipe?: {
    powderGrams: number;
    powderVendorId?: string;
    spoonsNeeded: number;
    spoonVendorId?: string;
    jarsNeeded: number;
    jarVendorId?: string;
    sideLabelsNeeded: number;
    sideLabelVendorId?: string;
    upperLabelsNeeded: number;
    upperLabelVendorId?: string;
    outerBoxesNeeded: number;
    outerBoxVendorId?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type ProductInput = Omit<Product, "_id" | "createdAt" | "updatedAt">;

/* â”€â”€ Fetch all â”€â”€ */
async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(BASE);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch products");
  return data.data ?? [];
}

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: fetchProducts });
}

/* â”€â”€ Create â”€â”€ */
async function createProduct(body: ProductInput): Promise<Product> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create product");
  return data.data;
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      // A new product also creates an OpsInventory record — refresh Operations Inventory.
      qc.invalidateQueries({ queryKey: opsKeys.inventory() });
    },
  });
}

/* â”€â”€ Update â”€â”€ */
async function updateProduct({ id, body }: { id: string; body: Partial<ProductInput> }): Promise<Product> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update product");
  return data.data;
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      // SKU/stock edits in Product Master are mirrored onto OpsInventory server-side —
      // invalidate so Operations Inventory / Warehouse / Analytics pages refetch immediately
      // instead of showing stale data until their own cache naturally expires.
      qc.invalidateQueries({ queryKey: opsKeys.inventory() });
    },
  });
}

/* â”€â”€ Delete â”€â”€ */
async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete product");
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

/* â”€â”€ Upload image â”€â”€ */
async function uploadProductImage(
  arg: File | { file: File; slug?: string }
): Promise<{ url: string }> {
  const file = arg instanceof File ? arg : arg.file;
  const slug = arg instanceof File ? "" : arg.slug ?? "";
  const form = new FormData();
  form.append("image", file);
  // Slug routes the file into media/products/<slug>/ on the server.
  if (slug) form.append("slug", slug);
  const res = await fetch(`${BASE}/upload/image`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Image upload failed");
  const url =
    data.data?.url ??
    data.data?.imageUrl ??
    data.data?.path ??
    data.url ??
    data.imageUrl ??
    data.path ??
    "";

  if (!url) {
    throw new Error("Image upload succeeded but no image URL was returned");
  }

  return { url };
}

export function useUploadProductImage() {
  return useMutation({ mutationFn: uploadProductImage });
}

/* ── Upload product video (Cloudinary) ── */
async function uploadProductVideo({ id, file }: { id: string; file: File }): Promise<Product> {
  const form = new FormData();
  form.append("video", file);
  const res = await fetch(`${BASE}/${id}/upload-video`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Video upload failed");
  return data.data;
}

export function useUploadProductVideo() {
  const qc = useQueryClient();
  return useMutation({ 
    mutationFn: uploadProductVideo,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
