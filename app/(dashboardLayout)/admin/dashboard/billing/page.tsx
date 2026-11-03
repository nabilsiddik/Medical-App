"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  getInvoices,
  createInvoice,
  recordPayment,
  getDailyCashUp,
  createExpense,
} from "@/services/doctor/billingServices";
import { getPatients } from "@/services/doctor/patientServices";
import { IInvoice, IPatient } from "@/types/doctor.interface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/shared/tables/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import {
  CreditCard,
  Banknote,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  FileSpreadsheet,
  RotateCcw,
  X,
  Download,
  Loader2,
} from "lucide-react";

export default function BillingManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read URL query params
  const urlSearchTerm = searchParams.get("searchTerm") || "";
  const urlStatus = searchParams.get("status") || "ALL";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlLimit = parseInt(searchParams.get("limit") || "10", 10);

  // Search input state and debounce
  const [searchInput, setSearchInput] = useState(urlSearchTerm);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Status filter state
  const [statusFilter, setStatusFilter] = useState(urlStatus);

  // Data states
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [meta, setMeta] = useState({
    page: urlPage,
    limit: urlLimit,
    total: 0,
    totalPage: 1,
  });
  const [dailyCashUp, setDailyCashUp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<IPatient[]>([]);

  // Collect Payment Modal
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<"CASH" | "CARD" | "BKASH" | "SSLCOMMERZ">("CASH");
  const [recordingPayment, setRecordingPayment] = useState(false);

  // New Invoice Modal
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoicePatientId, setInvoicePatientId] = useState("");
  const [invoiceServiceDesc, setInvoiceServiceDesc] = useState("Consultation Fee");
  const [invoiceAmount, setInvoiceAmount] = useState("1200");
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  // New Expense Modal
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState("Supplies");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [creatingExpense, setCreatingExpense] = useState(false);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchInput(urlSearchTerm);
    setStatusFilter(urlStatus);
  }, [urlSearchTerm, urlStatus]);

  // Push debounced search to URL
  useEffect(() => {
    if (debouncedSearch.trim() !== urlSearchTerm) {
      updateUrl({ searchTerm: debouncedSearch.trim() });
    }
  }, [debouncedSearch]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Always reset to page 1 on filter/search change

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "ALL") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setStatusFilter("ALL");
    startTransition(() => {
      router.push(pathname);
    });
  };

  // Fetch Invoices and Daily Cash-Up
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const [invRes, cashUpRes] = await Promise.all([
        getInvoices({
          page: urlPage,
          limit: urlLimit,
          searchTerm: urlSearchTerm || undefined,
          status: urlStatus !== "ALL" ? urlStatus : undefined,
        }),
        getDailyCashUp(),
      ]);

      setInvoices(invRes?.data || []);
      if (invRes?.meta) {
        setMeta(invRes.meta);
      }
      setDailyCashUp(cashUpRes);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      toast.error("Failed to load invoice records");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever query params change
  useEffect(() => {
    fetchInvoices();
  }, [urlPage, urlLimit, urlSearchTerm, urlStatus]);

  // Load patients list for modal once
  useEffect(() => {
    getPatients({ limit: 100 }).then((res) => setPatients(res?.data || []));
  }, []);

  const openPaymentModal = (inv: IInvoice) => {
    setSelectedInvoice(inv);
    const balance = inv.dueAmount ?? inv.balanceAmount ?? ((inv.total ?? inv.netAmount ?? 0) - (inv.paidAmount ?? 0));
    setPayAmount(Math.max(0, balance).toString());
    setPayModalOpen(true);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    const amountNum = parseFloat(payAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setRecordingPayment(true);
    try {
      const res = await recordPayment(selectedInvoice.id, {
        amount: amountNum,
        method: payMethod,
      });

      if (res.success) {
        toast.success("Payment recorded successfully!");
        setPayModalOpen(false);
        fetchInvoices();
      } else {
        toast.error(res.message || "Payment collection failed");
      }
    } catch (err) {
      toast.error("Error recording payment");
    } finally {
      setRecordingPayment(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoicePatientId) {
      toast.error("Please select a patient");
      return;
    }

    setCreatingInvoice(true);
    try {
      const res = await createInvoice({
        patientId: invoicePatientId,
        items: [
          {
            description: invoiceServiceDesc,
            unitPrice: parseFloat(invoiceAmount) || 1200,
            quantity: 1,
          },
        ],
      });

      if (res.success) {
        toast.success("Invoice created successfully!");
        setInvoiceModalOpen(false);
        fetchInvoices();
      } else {
        toast.error(res.message || "Failed to create invoice");
      }
    } catch (err) {
      toast.error("Error creating invoice");
    } finally {
      setCreatingInvoice(false);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingExpense(true);
    try {
      const res = await createExpense({
        category: expenseCategory,
        description: expenseDesc,
        amount: parseFloat(expenseAmount) || 0,
      });

      if (res.success) {
        toast.success("Practice expense recorded!");
        setExpenseModalOpen(false);
        setExpenseDesc("");
        setExpenseAmount("");
        fetchInvoices();
      }
    } catch (err) {
      toast.error("Error creating expense");
    } finally {
      setCreatingExpense(false);
    }
  };

  const hasActiveFilters = Boolean(urlSearchTerm || (urlStatus && urlStatus !== "ALL"));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Billing & Daily Cash-Up
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Chamber revenue collection, invoice records, daily drawer reconciliation, and clinic expenses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* New Invoice Button */}
          <Dialog open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-xl font-medium">
                <Plus className="h-4 w-4 mr-1.5" /> Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>Create Consultation Invoice</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateInvoice} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Patient *</Label>
                  <select
                    value={invoicePatientId}
                    onChange={(e) => setInvoicePatientId(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl border border-input bg-card text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName || p.name} ({p.phone || p.phoneNumber})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Description</Label>
                  <Input
                    value={invoiceServiceDesc}
                    onChange={(e) => setInvoiceServiceDesc(e.target.value)}
                    className="rounded-xl h-10 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Amount (৳)</Label>
                  <Input
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    className="rounded-xl h-10 text-sm font-mono font-bold"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={creatingInvoice}
                  className="w-full rounded-xl mt-2 font-semibold"
                >
                  {creatingInvoice ? "Generating..." : "Generate Invoice"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* New Expense Button */}
          <Dialog open={expenseModalOpen} onOpenChange={setExpenseModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-xl font-medium">
                <TrendingDown className="h-4 w-4 mr-1.5 text-amber-600" /> Record Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>Record Practice Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateExpense} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Category</Label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-card text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="Supplies">Clinical Supplies (Gloves, Sanitizers)</option>
                    <option value="Rent">Chamber Rent / Utilities</option>
                    <option value="Staff">Staff Salary / Daily Allowance</option>
                    <option value="Maintenance">Equipment Maintenance</option>
                    <option value="Other">Other Miscellaneous</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Description *</Label>
                  <Input
                    required
                    placeholder="e.g. Latex gloves & sterile gauze pack"
                    value={expenseDesc}
                    onChange={(e) => setExpenseDesc(e.target.value)}
                    className="rounded-xl h-10 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Amount (৳) *</Label>
                  <Input
                    required
                    type="number"
                    placeholder="e.g. 850"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="rounded-xl h-10 text-sm font-mono font-bold"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={creatingExpense}
                  className="w-full rounded-xl mt-2 font-semibold"
                >
                  {creatingExpense ? "Saving..." : "Record Expense"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Daily Cash-Up Drawer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Total Invoiced Today
              </span>
              <div className="text-2xl font-black text-foreground font-mono">
                ৳ {(dailyCashUp?.totalInvoiced || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Patient bills generated</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Cash In Hand (Drawer)
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                ৳ {(dailyCashUp?.cashCollected || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Physical currency collected</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Banknote className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Digital / Card / MFS
              </span>
              <div className="text-2xl font-black text-primary font-mono">
                ৳ {(dailyCashUp?.digitalCollected || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">bKash, SSLCommerz, Cards</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Today's Clinic Expenses
              </span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                ৳ {(dailyCashUp?.expenses || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Supplies & chamber outgoings</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingDown className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Search, Filter & Reset Bar */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input with Debounce */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by invoice #, patient name or phone..."
                className="pl-10 pr-9 h-11 text-sm rounded-xl bg-background border-border/80 focus-visible:ring-primary/20"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateUrl({ searchTerm: "" });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  updateUrl({ status: val });
                }}
              >
                <SelectTrigger className="h-11 min-w-[140px] text-sm font-medium rounded-xl">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PARTIAL">Partial</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-11 px-3.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Reset filters"
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  Reset
                </Button>
              )}

              {/* Reload Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchInvoices}
                disabled={loading}
                className="h-11 px-3.5 rounded-xl text-sm text-muted-foreground cursor-pointer"
                title="Refresh table"
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table Card */}
      <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 px-6 pt-5">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold">
                Invoices & Receipts
              </CardTitle>
              <Badge variant="secondary" className="font-semibold text-xs px-2.5 py-0.5">
                {meta.total} Records
              </Badge>
            </div>
            <CardDescription className="text-sm text-muted-foreground mt-0.5">
              Billing transactions, payment collection, and digital receipts
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0 relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-md">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium text-foreground">Loading invoices...</span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 border-y border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3.5 px-6">Invoice #</th>
                  <th className="py-3.5 px-6">Patient</th>
                  <th className="py-3.5 px-6">Net Total</th>
                  <th className="py-3.5 px-6">Paid</th>
                  <th className="py-3.5 px-6">Balance</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {invoices.length > 0 ? (
                  invoices.map((inv) => {
                    const netTotal = inv.total ?? inv.netAmount ?? inv.totalAmount ?? 0;
                    const paid = inv.paidAmount ?? 0;
                    const balance = inv.dueAmount ?? inv.balanceAmount ?? Math.max(0, netTotal - paid);
                    const patientName = inv.patient?.fullName || inv.patient?.name || "Patient";
                    const patientPhone = inv.patient?.phone || inv.patient?.phoneNumber || "N/A";
                    const patientCode = inv.patient?.patientId || "";

                    return (
                      <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-foreground">
                          {inv.invoiceNumber}
                          <div className="text-xs text-muted-foreground font-normal mt-0.5">
                            {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "N/A"}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-semibold text-foreground">
                            {patientName}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">
                            {patientPhone} {patientCode ? `• ${patientCode}` : ""}
                          </div>
                        </td>

                        <td className="py-4 px-6 font-mono font-bold text-foreground">
                          ৳ {netTotal.toLocaleString()}
                        </td>

                        <td className="py-4 px-6 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          ৳ {paid.toLocaleString()}
                        </td>

                        <td className="py-4 px-6 font-mono text-amber-600 dark:text-amber-400 font-bold">
                          ৳ {balance.toLocaleString()}
                        </td>

                        <td className="py-4 px-6">
                          <Badge
                            variant="secondary"
                            className={`text-xs font-semibold px-2.5 py-0.5 ${
                              inv.status === "PAID"
                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                : inv.status === "PARTIAL"
                                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                                : "bg-destructive/20 text-destructive border border-destructive/30"
                            }`}
                          >
                            {inv.status}
                          </Badge>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {balance > 0 ? (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => openPaymentModal(inv)}
                                className="h-8 text-xs px-3 rounded-lg font-semibold cursor-pointer"
                              >
                                Collect ৳{balance.toLocaleString()}
                              </Button>
                            ) : (
                              <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/30 px-2.5 py-0.5">
                                Fully Settled
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      {loading ? "Loading invoice records..." : "No invoices found matching your filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="px-6 border-t border-border/60">
            <TablePagination meta={meta} itemName="invoices" isPending={loading || isPending} />
          </div>
        </CardContent>
      </Card>

      {/* Collect Payment Dialog */}
      <Dialog open={payModalOpen} onOpenChange={setPayModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Collect Payment: {selectedInvoice?.invoiceNumber}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRecordPayment} className="space-y-4 pt-2">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-sm flex justify-between">
              <div>
                <span className="text-muted-foreground block text-xs">Patient</span>
                <span className="font-bold text-foreground">
                  {selectedInvoice?.patient?.fullName || selectedInvoice?.patient?.name || "Patient"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground block text-xs">Outstanding Due</span>
                <span className="font-bold text-amber-600 font-mono text-base">
                  ৳ {(selectedInvoice?.dueAmount ?? selectedInvoice?.balanceAmount ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Payment Method</Label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="CASH">Cash (Reception Drawer)</option>
                <option value="CARD">Debit / Credit Card (POS Terminal)</option>
                <option value="BKASH">bKash (MFS Transfer)</option>
                <option value="SSLCOMMERZ">Online Gateway</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Amount to Collect (৳) *</Label>
              <Input
                required
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="rounded-xl h-10 text-sm font-mono font-bold"
              />
            </div>

            <Button
              type="submit"
              disabled={recordingPayment}
              className="w-full rounded-xl mt-2 font-semibold"
            >
              {recordingPayment ? "Processing..." : "Confirm & Record Receipt"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
