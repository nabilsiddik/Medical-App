import { serverFetch } from "@/lib/serverFetch";
import { IInvoice } from "@/types/doctor.interface";

export const getInvoices = async (query?: {
  page?: number;
  limit?: number;
  status?: string;
  patientId?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.status) params.append("status", query.status);
    if (query?.patientId) params.append("patientId", query.patientId);

    const res = await serverFetch.get(`/billing/invoices?${params.toString()}`);
    if (!res.ok) return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 1 } };
    return await res.json();
  } catch (error) {
    console.error("Failed to load invoices:", error);
    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 1 } };
  }
};

export const createInvoice = async (payload: {
  patientId: string;
  appointmentId?: string;
  items: { description: string; unitPrice: number; quantity: number }[];
  discountAmount?: number;
  taxAmount?: number;
  notes?: string;
}) => {
  const res = await serverFetch.post("/billing/invoices", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const recordPayment = async (
  invoiceId: string,
  payload: {
    amount: number;
    method: "CASH" | "CARD" | "BKASH" | "SSLCOMMERZ" | "STRIPE" | "OTHER";
    transactionRef?: string;
  }
) => {
  const res = await serverFetch.post(`/billing/invoices/${invoiceId}/payments`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const getDailyCashUp = async (date?: string) => {
  try {
    const params = date ? `?date=${date}` : "";
    const res = await serverFetch.get(`/billing/daily-cash-up${params}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Failed to fetch cash-up:", error);
    return null;
  }
};

export const getExpenses = async (date?: string) => {
  try {
    const params = date ? `?date=${date}` : "";
    const res = await serverFetch.get(`/billing/expenses${params}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return [];
  }
};

export const createExpense = async (payload: {
  category: string;
  description: string;
  amount: number;
  date?: string;
}) => {
  const res = await serverFetch.post("/billing/expenses", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};
