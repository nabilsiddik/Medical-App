"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Stethoscope, CheckCircle2, XCircle, RefreshCw, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import { getServices, createService, updateService, deleteService } from "@/services/doctor/clinicServices";
import { Badge } from "@/components/ui/badge";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  // Add Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [price, setPrice] = useState(1000);
  const [consultationType, setConsultationType] = useState<"IN_PERSON" | "VIDEO" | "FOLLOW_UP">("IN_PERSON");
  const [submitting, setSubmitting] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDurationMinutes, setEditDurationMinutes] = useState(15);
  const [editPrice, setEditPrice] = useState(1000);
  const [editFollowUpPrice, setEditFollowUpPrice] = useState(500);
  const [editConsultationType, setEditConsultationType] = useState<"IN_PERSON" | "VIDEO" | "FOLLOW_UP">("IN_PERSON");
  const [editIsActive, setEditIsActive] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load services:", err);
      toast.error("Failed to load services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Service name is required");
      return;
    }

    setSubmitting(true);
    try {
      const priceNum = Math.max(0, Number(price) || 0);
      const res = await createService({
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: description.trim() || undefined,
        durationMinutes: Number(durationMinutes) || 15,
        price: priceNum * 100, // minor units
        followUpPrice: Math.round(priceNum * 50), // 50% follow up in minor units
        consultationType,
        isActive: true,
        isFeatured: true,
      });

      if (res.success || res.id || res.data) {
        toast.success("Service added successfully! Now available for booking.");
        setShowAddModal(false);
        setName("");
        setSlug("");
        setDescription("");
        setPrice(1000);
        fetchServices();
      } else {
        toast.error(res.message || "Failed to create service");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error creating service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (srv: any) => {
    setEditingService(srv);
    setEditName(srv.name || "");
    setEditSlug(srv.slug || "");
    setEditDescription(srv.description || "");
    setEditDurationMinutes(srv.durationMinutes || 15);
    setEditPrice(Math.round((srv.price || 0) / 100));
    setEditFollowUpPrice(Math.round((srv.followUpPrice || 0) / 100));
    setEditConsultationType(srv.consultationType || "IN_PERSON");
    setEditIsActive(srv.isActive ?? true);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.id) return;
    if (!editName.trim()) {
      toast.error("Service name is required");
      return;
    }

    setUpdating(true);
    try {
      const priceNum = Math.max(0, Number(editPrice) || 0);
      const followUpNum = Math.max(0, Number(editFollowUpPrice) || 0);

      const res = await updateService(editingService.id, {
        name: editName.trim(),
        slug: editSlug.trim() || editName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: editDescription.trim() || undefined,
        durationMinutes: Number(editDurationMinutes) || 15,
        price: priceNum * 100, // minor units
        followUpPrice: followUpNum * 100, // minor units
        consultationType: editConsultationType,
        isActive: editIsActive,
      });

      if (res.success || res.id || res.data) {
        toast.success("Service updated successfully!");
        setShowEditModal(false);
        setEditingService(null);
        fetchServices();
      } else {
        toast.error(res.message || "Failed to update service");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error updating service");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await deleteService(id);
      if (res.success) {
        toast.success("Service deleted");
        fetchServices();
      } else {
        toast.error(res.message || "Failed to delete service");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error deleting service");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2.5">
            <Stethoscope className="h-7 w-7 text-primary" />
            <span>Services &amp; Pricing Management</span>
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            Configure consultation types, duration, and prices (including ৳0 Free Booking for report reviews).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchServices}
            className="px-4 py-2.5 rounded-xl border border-input bg-background hover:bg-accent text-foreground text-base font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base transition-colors inline-flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Info Card explaining what services do */}
      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-base flex items-start gap-3.5">
        <AlertCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-foreground">Where do these services show?</span>
          <p className="text-muted-foreground text-base leading-relaxed">
            Every service created here is immediately available in the <strong>Patient Booking Wizard (/book)</strong> under &ldquo;Select Appointment Type &amp; Pricing&rdquo;, and on the public <strong>Services Directory (/services)</strong>. Patients can book directly for that service, and selecting a price of <strong>0 BDT</strong> allows patients to book for free (e.g. Free Report Review).
          </p>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-base">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold uppercase tracking-wider text-base">
                <th className="p-4">Service Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Type</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading clinical services...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-muted-foreground">
                    No clinical services found in database. Click &ldquo;Add New Service&rdquo; to create one.
                  </td>
                </tr>
              ) : (
                services.map((srv) => {
                  const feeInBdt = Math.round((srv.price || 0) / 100);
                  const isFree = feeInBdt === 0;

                  return (
                    <tr key={srv.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-bold text-foreground">
                        <div className="flex items-center gap-2.5">
                          <Stethoscope className="h-5 w-5 text-primary shrink-0" />
                          <span>{srv.name}</span>
                        </div>
                        {srv.description && (
                          <p className="text-base text-muted-foreground font-normal line-clamp-1 mt-1">
                            {srv.description}
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground font-mono text-base">{srv.slug}</td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-base uppercase font-mono px-3 py-1">
                          {srv.consultationType || "IN_PERSON"}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium">{srv.durationMinutes || 15} mins</td>
                      <td className="p-4">
                        {isFree ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-base font-bold px-3 py-1">
                            FREE (0 BDT)
                          </Badge>
                        ) : (
                          <span className="font-bold text-foreground text-lg">
                            ৳{feeInBdt.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {srv.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-base font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-base font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                            <XCircle className="h-4 w-4" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(srv)}
                            className="p-2 rounded-xl hover:bg-primary/10 text-primary transition-colors cursor-pointer"
                            title="Edit service"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(srv.id)}
                            className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors cursor-pointer"
                            title="Delete service"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card text-foreground rounded-2xl border border-border max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-1 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-black text-foreground mb-1">
              Add New Medical Service
            </h3>
            <p className="text-base text-muted-foreground mb-6">
              Enter service details. This service will be saved to the database and will appear immediately in the booking wizard.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Free Report Review or Cardiology Consultation"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-muted/50 text-foreground placeholder:text-muted-foreground text-base border border-border focus:border-primary focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                  Slug (URL Identifier) *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. free-report-review"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-muted/50 text-foreground placeholder:text-muted-foreground text-base border border-border focus:border-primary focus:outline-none transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 text-foreground text-base border border-border focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                    Consultation Fee (BDT)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="0 for Free"
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 text-foreground text-base border border-border focus:border-primary focus:outline-none transition-all"
                  />
                  <span className="text-base text-muted-foreground mt-1 block">
                    Enter 0 for a free booking
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                  Consultation Mode
                </label>
                <select
                  value={consultationType}
                  onChange={(e: any) => setConsultationType(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-muted/50 text-foreground text-base border border-border focus:border-primary focus:outline-none transition-all"
                >
                  <option value="IN_PERSON">In-Person Chamber Visit</option>
                  <option value="VIDEO">Video Consultation</option>
                  <option value="FOLLOW_UP">Follow-Up Review</option>
                </select>
              </div>

              <div>
                <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief details about what this service covers..."
                  className="w-full p-3.5 rounded-xl bg-muted/50 text-foreground placeholder:text-muted-foreground text-base border border-border focus:border-primary focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-input bg-background hover:bg-accent text-foreground font-semibold text-base transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Service Modal */}
      {showEditModal && editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card text-foreground rounded-2xl border border-border max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditingService(null);
              }}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-1 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-black text-foreground mb-1">
              Edit Medical Service
            </h3>
            <p className="text-base text-muted-foreground mb-6">
              Update service name, duration, consultation fee, or status. Changes take effect across booking wizards immediately.
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Service Name"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-muted/50 text-foreground placeholder:text-muted-foreground text-base border border-border focus:border-primary focus:outline-none transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                  Slug (URL Identifier) *
                </label>
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  placeholder="service-slug"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-muted/50 text-foreground placeholder:text-muted-foreground text-base border border-border focus:border-primary focus:outline-none transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={editDurationMinutes}
                    onChange={(e) => setEditDurationMinutes(Number(e.target.value))}
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 text-foreground text-base border border-border focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                    Consultation Fee (BDT)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    placeholder="0 for Free"
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 text-foreground text-base border border-border focus:border-primary focus:outline-none transition-all font-bold"
                  />
                  <span className="text-base text-muted-foreground mt-1 block">
                    Enter 0 for free consultation
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                    Follow-Up Fee (BDT)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={editFollowUpPrice}
                    onChange={(e) => setEditFollowUpPrice(Number(e.target.value))}
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 text-foreground text-base border border-border focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                    Consultation Mode
                  </label>
                  <select
                    value={editConsultationType}
                    onChange={(e: any) => setEditConsultationType(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 text-foreground text-base border border-border focus:border-primary focus:outline-none transition-all"
                  >
                    <option value="IN_PERSON">In-Person Chamber Visit</option>
                    <option value="VIDEO">Video Consultation</option>
                    <option value="FOLLOW_UP">Follow-Up Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                  Service Status
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-base font-semibold">
                    <input
                      type="radio"
                      name="editStatus"
                      checked={editIsActive === true}
                      onChange={() => setEditIsActive(true)}
                      className="h-5 w-5 text-primary"
                    />
                    <span className="text-emerald-600 font-bold">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-base font-semibold">
                    <input
                      type="radio"
                      name="editStatus"
                      checked={editIsActive === false}
                      onChange={() => setEditIsActive(false)}
                      className="h-5 w-5 text-primary"
                    />
                    <span className="text-rose-600 font-bold">Inactive</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-base font-bold text-foreground uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Brief details about what this service covers..."
                  className="w-full p-3.5 rounded-xl bg-muted/50 text-foreground placeholder:text-muted-foreground text-base border border-border focus:border-primary focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingService(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-input bg-background hover:bg-accent text-foreground font-semibold text-base transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {updating ? "Updating Service..." : "Update Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
