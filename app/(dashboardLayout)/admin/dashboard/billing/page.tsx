"use client";

import React, { useState, useEffect } from "react";
import {
  getInvoices,
  createInvoice,
  recordPayment,
  getDailyCashUp,
  getExpenses,
  createExpense,
} from "@/services/doctor/billingServices";
import { getPatients } from "@/services/doctor/patientServices";
import { IInvoice, IPatient, PaymentStatus } from "@/types/doctor.interface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import {
  CreditCard,
  Banknote,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";

export default function BillingManagementPage() {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, cashUpRes] = await Promise.all([
        getInvoices(),
        getDailyCashUp(),
      ]);
      setInvoices(invRes.data || []);
      setDailyCashUp(cashUpRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    getPatients().then((res) => setPatients(res.data || []));
  }, []);

  const openPaymentModal = (inv: IInvoice) => {
    setSelectedInvoice(inv);
    setPayAmount(inv.balanceAmount.toString());
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
        fetchData();
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
        fetchData();
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
        fetchData();
      }
    } catch (err) {
      toast.error("Error creating expense");
    } finally {
      setCreatingExpense(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Billing & Daily Cash-Up
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Chamber revenue collection, invoice records, daily drawer reconciliation, and clinic expenses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* New Invoice Button */}
          <Dialog open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-xl">
                <Plus className="h-4 w-4 mr-1.5" /> Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>Create Consultation Invoice</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateInvoice} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Patient *</Label>
                  <select
                    value={invoicePatientId}
                    onChange={(e) => setInvoicePatientId(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl border border-input bg-card text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.phoneNumber})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={invoiceServiceDesc}
                    onChange={(e) => setInvoiceServiceDesc(e.target.value)}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Amount (৳)</Label>
                  <Input
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    className="rounded-xl h-10 text-xs font-mono font-bold"
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
              <Button size="sm" variant="outline" className="rounded-xl">
                <TrendingDown className="h-4 w-4 mr-1.5 text-amber-600" /> Record Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>Record Practice Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateExpense} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Category</Label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-card text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="Supplies">Clinical Supplies (Gloves, Sanitizers)</option>
                    <option value="Rent">Chamber Rent / Utilities</option>
                    <option value="Staff">Staff Salary / Daily Allowance</option>
                    <option value="Maintenance">Equipment Maintenance</option>
                    <option value="Other">Other Miscellaneous</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Description *</Label>
                  <Input
                    required
                    placeholder="e.g. Latex gloves & sterile gauze pack"
                    value={expenseDesc}
                    onChange={(e) => setExpenseDesc(e.target.value)}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Amount (৳) *</Label>
                  <Input
                    required
                    type="number"
                    placeholder="e.g. 850"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="rounded-xl h-10 text-xs font-mono font-bold"
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
              <span className="text-xs font-medium text-muted-foreground">
                Total Invoiced Today
              </span>
              <div className="text-2xl font-black text-foreground font-mono">
                ৳ {(dailyCashUp?.totalInvoiced || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-muted-foreground">Patient bills generated</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Cash In Hand (Drawer)
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                ৳ {(dailyCashUp?.cashCollected || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-muted-foreground">Physical currency collected</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Banknote className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Digital / Card / MFS
              </span>
              <div className="text-2xl font-black text-primary font-mono">
                ৳ {(dailyCashUp?.digitalCollected || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-muted-foreground">bKash, SSLCommerz, Cards</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Today's Clinic Expenses
              </span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                ৳ {(dailyCashUp?.expenses || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-muted-foreground">Supplies & chamber outgoings</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingDown className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">
              Invoices & Receipts ({invoices.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Billing transactions and payment collection
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchData}
            className="h-8 text-xs text-muted-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reload
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-y border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Net Total</th>
                  <th className="py-3 px-4">Paid</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {invoices.length > 0 ? (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-foreground">
                        {inv.invoiceNumber}
                        <div className="text-[10px] text-muted-foreground font-normal">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">
                          {inv.patient?.name || "Patient"}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {inv.patient?.phoneNumber}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-foreground">
                        ৳ {inv.netAmount.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        ৳ {inv.paidAmount.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-mono text-amber-600 dark:text-amber-400 font-bold">
                        ৳ {inv.balanceAmount.toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-semibold ${
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

                      <td className="py-3 px-4 text-right">
                        {inv.balanceAmount > 0 ? (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => openPaymentModal(inv)}
                            className="h-7 text-[11px] px-2.5 rounded-lg font-semibold"
                          >
                            Collect ৳{inv.balanceAmount}
                          </Button>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                            Fully Settled
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      No invoices recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs flex justify-between">
              <div>
                <span className="text-muted-foreground block">Patient</span>
                <span className="font-bold text-foreground">
                  {selectedInvoice?.patient?.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground block">Outstanding Due</span>
                <span className="font-bold text-amber-600 font-mono text-sm">
                  ৳ {selectedInvoice?.balanceAmount}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Payment Method</Label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-card text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="CASH">Cash (Reception Drawer)</option>
                <option value="CARD">Debit / Credit Card (POS Terminal)</option>
                <option value="BKASH">bKash (MFS Transfer)</option>
                <option value="SSLCOMMERZ">Online Gateway</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Amount to Collect (৳) *</Label>
              <Input
                required
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="rounded-xl h-10 text-xs font-mono font-bold"
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
