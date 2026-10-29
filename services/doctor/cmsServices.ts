import { serverFetch } from "@/lib/serverFetch";
import { IBlogPost, IFaq, ITestimonial } from "@/types/doctor.interface";

export const getBlogs = async (): Promise<IBlogPost[]> => {
  try {
    const res = await serverFetch.get("/cms/blogs", { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to load blogs:", error);
    return [];
  }
};

export const getFaqs = async (): Promise<IFaq[]> => {
  try {
    const res = await serverFetch.get("/cms/faqs", { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to load FAQs:", error);
    return [];
  }
};

export const getTestimonials = async (): Promise<ITestimonial[]> => {
  try {
    const res = await serverFetch.get("/cms/testimonials", { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to load testimonials:", error);
    return [];
  }
};

export const submitInquiry = async (payload: {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}) => {
  const res = await serverFetch.post("/cms/inquiries", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const getBlogBySlug = async (slug: string): Promise<IBlogPost | null> => {
  try {
    const res = await serverFetch.get(`/cms/blogs/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Failed to load blog by slug:", error);
    return null;
  }
};

export const createBlogPost = async (data: any) => {
  const res = await serverFetch.post("/cms/blogs", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getAllBlogsAdmin = async (): Promise<IBlogPost[]> => {
  try {
    const res = await serverFetch.get("/cms/blogs/admin/all");
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to load admin blogs:", error);
    return [];
  }
};

export const updateBlogPost = async (id: string, data: any) => {
  const res = await serverFetch.patch(`/cms/blogs/${id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteBlogPost = async (id: string) => {
  const res = await serverFetch.delete(`/cms/blogs/${id}`);
  return res.json();
};
