"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  getAllBlogsAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/services/doctor/cmsServices";
import { IBlogPost } from "@/types/doctor.interface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/shared/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Eye,
  Image as ImageIcon,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Unlink,
  Maximize2,
  Minimize2,
  Save,
  CheckCircle2,
  Calendar,
  User,
  Folder,
  Tag,
  Search,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Minus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const PRESET_CATEGORIES = [
  "Clinical Cardiology",
  "General Medicine",
  "Health Tips",
  "Neurology",
  "Rehabilitation",
  "Preventive Care",
  "Endocrinology",
  "Surgery & Recovery",
];

const SAMPLE_MEDIA_IMAGES = [
  {
    title: "Doctor Reviewing Report",
    url: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Clinical Consultation",
    url: "https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Heart Surgery & Equipment",
    url: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Senior Care & Wellness",
    url: "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Stethoscope & Diagnostics",
    url: "https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "editor">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");

  // WordPress-style Editor State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editorTab, setEditorTab] = useState<"visual" | "text">("visual");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("Health Tips");
  const [tagsInput, setTagsInput] = useState("");
  const [authorName, setAuthorName] = useState("Prof. Dr. Sarah Rahman");
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Word count & cursor element path
  const [wordCount, setWordCount] = useState(0);
  const [currentPath, setCurrentPath] = useState("p");

  // Add Media Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaImageUrl, setMediaImageUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");

  const visualEditorRef = useRef<HTMLDivElement>(null);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAllBlogsAdmin();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load blogs:", err);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Update word count whenever HTML content changes
  useEffect(() => {
    const textOnly = htmlContent.replace(/<[^>]*>/g, " ").trim();
    if (!textOnly) {
      setWordCount(0);
    } else {
      const words = textOnly.split(/\s+/).filter(Boolean);
      setWordCount(words.length);
    }
  }, [htmlContent]);

  // Sync state into visual editor innerHTML when switching to visual
  useEffect(() => {
    if (editorTab === "visual" && visualEditorRef.current) {
      if (visualEditorRef.current.innerHTML !== htmlContent) {
        visualEditorRef.current.innerHTML = htmlContent;
      }
    }
  }, [editorTab]);

  // Title & auto slug generation
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPostId || !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  // Open Editor for New Post
  const handleOpenNewPost = () => {
    setEditingPostId(null);
    setTitle("");
    setSlug("");
    setHtmlContent(
      "<p>Start writing your clinical article or healthcare advisory here...</p>"
    );
    setSummary("");
    setCoverImage(
      "https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=800"
    );
    setCategory("Health Tips");
    setTagsInput("Healthcare, Medicine, Wellness");
    setIsPublished(true);
    setViewMode("editor");
    setEditorTab("visual");
  };

  // Open Editor for Existing Post
  const handleOpenEditPost = (post: IBlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setHtmlContent(post.content || "");
    setSummary(post.summary || "");
    setCoverImage(post.coverImage || "");
    setCategory(post.category || "Health Tips");
    setTagsInput(post.tags ? post.tags.join(", ") : "");
    setIsPublished(post.isPublished ?? true);
    setAuthorName(post.authorName || "Prof. Dr. Sarah Rahman");
    setViewMode("editor");
    setEditorTab("visual");
  };

  // Execute formatting command in visual editor
  const executeCmd = (command: string, value: string | undefined = undefined) => {
    if (editorTab !== "visual") return;
    visualEditorRef.current?.focus();
    document.execCommand(command, false, value);
    if (visualEditorRef.current) {
      setHtmlContent(visualEditorRef.current.innerHTML);
    }
  };

  // Handle input in Visual editor
  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      const html = visualEditorRef.current.innerHTML;
      setHtmlContent(html);

      // Detect current tag node for "Path: p / h2 / blockquote"
      const sel = window.getSelection();
      if (sel && sel.anchorNode) {
        const parent = sel.anchorNode.parentElement;
        if (parent) {
          setCurrentPath(parent.tagName.toLowerCase());
        }
      }
    }
  };

  // Add Link Prompt
  const handleAddLink = () => {
    const url = prompt("Enter link destination URL:", "https://");
    if (url) {
      executeCmd("createLink", url);
    }
  };

  // Add Media dialog submission
  const handleInsertMedia = () => {
    if (!mediaImageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    const imgTag = `<img src="${mediaImageUrl.trim()}" alt="${
      mediaAlt || title
    }" class="rounded-xl my-4 max-w-full shadow-md" />${
      mediaCaption ? `<p class="text-xs text-muted-foreground italic text-center mt-1 mb-4">${mediaCaption}</p>` : ""
    }`;

    if (editorTab === "visual") {
      visualEditorRef.current?.focus();
      document.execCommand("insertHTML", false, imgTag);
      if (visualEditorRef.current) {
        setHtmlContent(visualEditorRef.current.innerHTML);
      }
    } else {
      setHtmlContent((prev) => prev + "\n" + imgTag);
    }

    setIsMediaModalOpen(false);
    setMediaImageUrl("");
    setMediaAlt("");
    setMediaCaption("");
    toast.success("Image embedded into article!");
  };

  // Save Post (Publish or Draft)
  const handleSavePost = async (publishStatus: boolean) => {
    if (!title.trim()) {
      toast.error("Please enter a title for the blog post");
      return;
    }

    const finalHtml =
      editorTab === "visual" && visualEditorRef.current
        ? visualEditorRef.current.innerHTML
        : htmlContent;

    if (!finalHtml.trim()) {
      toast.error("Blog post content cannot be empty");
      return;
    }

    const cleanSlug = (
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    ).toLowerCase();

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const postPayload = {
      title: title.trim(),
      slug: cleanSlug,
      summary: summary.trim() || finalHtml.replace(/<[^>]*>/g, " ").substring(0, 160).trim(),
      content: finalHtml,
      coverImage: coverImage.trim() || undefined,
      category: category.trim() || "Health Tips",
      tags: tagsArray,
      authorName: authorName.trim() || "Prof. Dr. Sarah Rahman",
      isPublished: publishStatus,
    };

    setSubmitting(true);
    try {
      if (editingPostId) {
        const res = await updateBlogPost(editingPostId, postPayload);
        if (res?.success) {
          toast.success(
            publishStatus
              ? "Blog post updated and published live!"
              : "Blog post saved as draft!"
          );
          setViewMode("list");
          await fetchBlogs();
        } else {
          toast.error(res?.message || "Failed to update blog post");
        }
      } else {
        const res = await createBlogPost(postPayload);
        if (res?.success) {
          toast.success(
            publishStatus
              ? "Blog post published successfully to the website!"
              : "Blog post saved as draft!"
          );
          setViewMode("list");
          await fetchBlogs();
        } else {
          toast.error(res?.message || "Failed to create blog post");
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Error saving blog post");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Post
  const handleDeletePost = async (id: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${postTitle}"?`)) {
      return;
    }

    try {
      const res = await deleteBlogPost(id);
      if (res?.success) {
        toast.success("Blog post deleted successfully");
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      } else {
        toast.error(res?.message || "Failed to delete post");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error deleting post");
    }
  };

  // Filtered blogs for table
  const filteredBlogs = blogs.filter((b) => {
    const matchesQuery =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.category && b.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategoryFilter === "ALL" || b.category === selectedCategoryFilter;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* ============================================================== */}
      {/* 1. LIST VIEW: Posts Table & Header */}
      {/* ============================================================== */}
      {viewMode === "list" && (
        <div className="space-y-6">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Medical Blog & Clinical Articles
              </h1>
              <p className="text-muted-foreground mt-1">
                Write, publish, and manage health guidelines, clinical case studies, and patient
                recovery tips.
              </p>
            </div>

            <Button
              onClick={handleOpenNewPost}
              className="rounded-xl font-bold gap-2 bg-primary text-primary-foreground shadow-xs"
            >
              <Plus className="h-4 w-4" />
              Add New Post
            </Button>
          </div>

          {/* Search & Filter Bar */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="h-4 w-4 absolute left-3.5 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search articles by title, slug, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Label className="font-semibold text-muted-foreground whitespace-nowrap">
                  Filter Topic:
                </Label>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="rounded-xl border border-input bg-background h-10 px-3 text-foreground font-semibold"
                >
                  <option value="ALL">All Categories ({blogs.length})</option>
                  {PRESET_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Posts Table */}
          <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border/80 text-muted-foreground font-bold text-sm">
                    <th className="p-4 pl-6">Title</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                        Loading published articles...
                      </td>
                    </tr>
                  ) : filteredBlogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-muted-foreground">
                        <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                        No articles found. Click{" "}
                        <button
                          onClick={handleOpenNewPost}
                          className="text-primary font-bold underline"
                        >
                          Add New Post
                        </button>{" "}
                        to create your first medical blog.
                      </td>
                    </tr>
                  ) : (
                    filteredBlogs.map((post) => (
                      <tr
                        key={post.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="p-4 pl-6">
                          <div className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                            {post.title}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">
                            /blog/{post.slug}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-muted-foreground text-sm">
                          {post.authorName || "Doctor"}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="font-semibold text-xs text-primary border-primary/30">
                            {post.category || "General"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {post.isPublished ? (
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-300">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-amber-600 bg-amber-50">
                              Draft
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 text-xs font-mono text-muted-foreground">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Draft"}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenEditPost(post)}
                              className="rounded-lg h-8 px-2.5 text-primary hover:bg-primary/10 gap-1"
                              title="Edit in WordPress-style editor"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </Button>

                            <Link
                              href={`/blog/${post.slug || post.id}`}
                              target="_blank"
                              className="inline-flex items-center justify-center rounded-lg h-8 px-2.5 text-muted-foreground hover:text-foreground hover:bg-muted gap-1 text-sm font-semibold"
                              title="View Live Post"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeletePost(post.id, post.title)}
                              className="rounded-lg h-8 px-2 text-destructive hover:bg-destructive/10"
                              title="Delete Post"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. WORDPRESS-STYLE POST EDITOR (Matching User Screenshot) */}
      {/* ============================================================== */}
      {viewMode === "editor" && (
        <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto" : ""}`}>
          {/* Header Action Bar */}
          <div className="flex items-center justify-between gap-4 pb-2 border-b border-border/80">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setViewMode("list")}
                className="rounded-xl gap-2 font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to All Posts
              </Button>
              <h2 className="text-xl font-bold text-foreground">
                {editingPostId ? "Edit Medical Post" : "Add New Post"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="rounded-xl gap-1 text-muted-foreground"
                title="Toggle Fullscreen Editor"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ======================================================== */}
            {/* LEFT 8/12: WordPress Classic Editor Canvas */}
            {/* ======================================================== */}
            <div className="lg:col-span-8 space-y-4">
              {/* Title Field (WordPress "Enter title here") */}
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="Enter title here"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full text-2xl sm:text-3xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/60 bg-card border border-border/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                />

                {/* Permalink display */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground px-1 pt-1 font-mono">
                  <span>Permalink:</span>
                  <span className="text-primary underline">
                    http://yourclinic.com/blog/
                    {isEditingSlug ? (
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="bg-background border border-input rounded px-1.5 py-0.5 font-mono text-xs text-foreground"
                      />
                    ) : (
                      <span>{slug || "post-slug"}</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingSlug(!isEditingSlug)}
                    className="ml-1 text-xs text-muted-foreground hover:text-foreground font-sans underline"
                  >
                    {isEditingSlug ? "Done" : "Edit"}
                  </button>
                </div>
              </div>

              {/* WordPress TinyMCE Editor Box */}
              <div className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
                {/* Top Action Bar: Add Media on left, Visual/Text on right */}
                <div className="bg-muted/60 p-2.5 border-b border-border flex items-center justify-between gap-2">
                  {/* "Add Media" Button */}
                  <Dialog open={isMediaModalOpen} onOpenChange={setIsMediaModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-lg h-8 gap-1.5 text-xs font-semibold bg-background shadow-xs hover:bg-muted"
                      >
                        <ImageIcon className="h-3.5 w-3.5 text-primary" />
                        Add Media
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                          <ImageIcon className="h-5 w-5 text-primary" />
                          Insert Media Image
                        </DialogTitle>
                        <DialogDescription>
                          Insert clinical photography or diagnostic images into your article content.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-3">
                        <div className="space-y-1.5">
                          <Label className="font-semibold text-xs">Image URL *</Label>
                          <Input
                            placeholder="https://images.pexels.com/..."
                            value={mediaImageUrl}
                            onChange={(e) => setMediaImageUrl(e.target.value)}
                            className="rounded-xl"
                          />
                        </div>

                        {/* Quick Presets */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                            Or select from medical presets:
                          </span>
                          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pt-1">
                            {SAMPLE_MEDIA_IMAGES.map((img) => (
                              <button
                                key={img.url}
                                type="button"
                                onClick={() => setMediaImageUrl(img.url)}
                                className="flex items-center gap-2 p-1.5 rounded-lg border border-border hover:border-primary text-left text-xs bg-muted/40"
                              >
                                <img src={img.url} alt="" className="w-8 h-8 rounded object-cover" />
                                <span className="line-clamp-1 font-medium">{img.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="font-semibold text-xs">Alt Text (Accessibility & SEO)</Label>
                          <Input
                            placeholder="e.g. Doctor explaining clinical scan results"
                            value={mediaAlt}
                            onChange={(e) => setMediaAlt(e.target.value)}
                            className="rounded-xl"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="font-semibold text-xs">Image Caption (Optional)</Label>
                          <Input
                            placeholder="e.g. Figure 1: Early diagnosis protocol"
                            value={mediaCaption}
                            onChange={(e) => setMediaCaption(e.target.value)}
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMediaModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleInsertMedia} className="font-semibold">
                          Insert into post
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Visual / Text Tabs (WordPress Style) */}
                  <div className="flex items-center rounded-lg bg-background border border-border p-0.5">
                    <button
                      type="button"
                      onClick={() => setEditorTab("visual")}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        editorTab === "visual"
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Visual
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (visualEditorRef.current) {
                          setHtmlContent(visualEditorRef.current.innerHTML);
                        }
                        setEditorTab("text");
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        editorTab === "text"
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Text
                    </button>
                  </div>
                </div>

                {/* Classic WordPress Toolbar Row (Active in Visual mode) */}
                {editorTab === "visual" && (
                  <div className="bg-muted/40 p-2 border-b border-border/80 flex flex-wrap items-center gap-1">
                    {/* Headings / Block format dropdown */}
                    <select
                      onChange={(e) => executeCmd("formatBlock", e.target.value)}
                      defaultValue="p"
                      className="h-8 rounded-lg border border-input bg-background px-2 text-xs font-semibold text-foreground mr-1"
                    >
                      <option value="p">Paragraph</option>
                      <option value="h1">Heading 1</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                      <option value="h4">Heading 4</option>
                      <option value="blockquote">Blockquote</option>
                      <option value="pre">Preformatted</option>
                    </select>

                    <div className="h-4 w-px bg-border mx-0.5" />

                    {/* Bold */}
                    <button
                      type="button"
                      onClick={() => executeCmd("bold")}
                      className="p-1.5 rounded hover:bg-muted text-foreground font-bold text-xs h-8 w-8 flex items-center justify-center border border-transparent hover:border-border"
                      title="Bold (Ctrl+B)"
                    >
                      <Bold className="h-3.5 w-3.5" />
                    </button>

                    {/* Italic */}
                    <button
                      type="button"
                      onClick={() => executeCmd("italic")}
                      className="p-1.5 rounded hover:bg-muted text-foreground text-xs h-8 w-8 flex items-center justify-center border border-transparent hover:border-border"
                      title="Italic (Ctrl+I)"
                    >
                      <Italic className="h-3.5 w-3.5" />
                    </button>

                    {/* Strikethrough */}
                    <button
                      type="button"
                      onClick={() => executeCmd("strikeThrough")}
                      className="p-1.5 rounded hover:bg-muted text-foreground text-xs h-8 w-8 flex items-center justify-center border border-transparent hover:border-border"
                      title="Strikethrough"
                    >
                      <Strikethrough className="h-3.5 w-3.5" />
                    </button>

                    <div className="h-4 w-px bg-border mx-0.5" />

                    {/* Bullet List */}
                    <button
                      type="button"
                      onClick={() => executeCmd("insertUnorderedList")}
                      className="p-1.5 rounded hover:bg-muted text-foreground text-xs h-8 w-8 flex items-center justify-center border border-transparent hover:border-border"
                      title="Bulleted list"
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>

                    {/* Numbered List */}
                    <button
                      type="button"
                      onClick={() => executeCmd("insertOrderedList")}
                      className="p-1.5 rounded hover:bg-muted text-foreground text-xs h-8 w-8 flex items-center justify-center border border-transparent hover:border-border"
                      title="Numbered list"
                    >
                      <ListOrdered className="h-3.5 w-3.5" />
                    </button>

                    {/* Blockquote */}
                    <button
                      type="button"
                      onClick={() => executeCmd("formatBlock", "blockquote")}
                      className="p-1.5 rounded hover:bg-muted text-foreground text-xs h-8 w-8 flex items-center justify-center border border-transparent hover:border-border"
                      title="Quote"
                    >
                      <Quote className="h-3.5 w-3.5" />
                    </button>

                    {/* Horizontal Line */}
                    <button
                      type="button"
                      onClick={() => executeCmd("insertHorizontalRule")}
                      className="p-1.5 rounded hover:bg-muted text-foreground text-xs h-8 w-8 flex items-center justify-center border border-transparent hover:border-border"
                      title="Horizontal line"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <div className="h-4 w-px bg-border mx-0.5" />

                    {/* Alignments */}
                    <button
                      type="button"
                      onClick={() => executeCmd("justifyLeft")}
                      className="p-1.5 rounded hover:bg-muted text-foreground text-xs h-8 w-8 flex items-center justify-center border border-transparent hover:border-border"
                      title="Align left"
                    >
                      <AlignLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeCmd("justifyCenter")}
                      className="p-1.5 rounded hover:bg-muted text-foreground text-xs h-8 w-8 flex items-center justify-center border border-transparent hover:border-border"
                      title="Align center"
                    >
                      <AlignCenter className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeCmd("justifyRight")}
                      className="p-1.5 rounded hover:bg-muted text-foreground text-xs h-8 w-8 flex items-center justify-center border border-transparent hover:border-border"
                      title="Align right"
                    >
                      <AlignRight className="h-3.5 w-3.5" />
                    </button>

                    <div className="h-4 w-px bg-border mx-0.5" />

                    {/* Link / Unlink */}
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="p-1.5 rounded hover:bg-muted text-foreground text-xs h-8 w-8 flex items-center justify-center border border-transparent hover:border-border"
                      title="Insert/edit link"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeCmd("unlink")}
                      className="p-1.5 rounded hover:bg-muted text-foreground text-xs h-8 w-8 flex items-center justify-center border border-transparent hover:border-border"
                      title="Remove link"
                    >
                      <Unlink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* Editor Content Area */}
                {editorTab === "visual" ? (
                  <div
                    ref={visualEditorRef}
                    contentEditable
                    onInput={handleVisualInput}
                    className="min-h-[380px] p-6 focus:outline-none prose prose-slate max-w-none text-foreground font-normal leading-relaxed text-base"
                    style={{ minHeight: "420px" }}
                  />
                ) : (
                  <textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    className="w-full min-h-[420px] p-4 font-mono text-xs bg-background text-foreground focus:outline-none resize-y"
                    placeholder="<p>Raw HTML article content here...</p>"
                  />
                )}

                {/* WordPress Bottom Bar: Path & Word count */}
                <div className="bg-muted/40 px-4 py-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>Path: {currentPath}</span>
                  <span>Word count: {wordCount}</span>
                </div>
              </div>

              {/* Excerpt Summary Box */}
              <Card className="rounded-xl border-border/80 shadow-xs">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Post Excerpt / Meta Description
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Short summary displayed on public blog cards and search engine snippets.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <Textarea
                    placeholder="Write an excerpt (optional, auto-generated from post content if left empty)..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="rounded-xl text-xs h-20"
                  />
                </CardContent>
              </Card>
            </div>

            {/* ======================================================== */}
            {/* RIGHT 4/12: WordPress Sidebar Meta Boxes */}
            {/* ======================================================== */}
            <div className="lg:col-span-4 space-y-5">
              {/* Box 1: Publish Settings */}
              <Card className="rounded-xl border-border shadow-xs">
                <CardHeader className="py-3 px-4 border-b border-border/60">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Save className="h-4 w-4 text-primary" />
                    Publish
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-semibold">Status:</span>
                    <Badge variant={isPublished ? "default" : "secondary"} className="font-bold">
                      {isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-semibold">Visibility:</span>
                    <span className="font-bold text-foreground">Public</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-semibold">Author:</span>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="font-semibold text-foreground text-right bg-transparent border-b border-border/80 focus:outline-none text-xs"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={submitting}
                      onClick={() => handleSavePost(false)}
                      className="rounded-xl text-xs font-semibold"
                    >
                      Save Draft
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      disabled={submitting}
                      onClick={() => handleSavePost(true)}
                      className="rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 px-4 shadow-xs"
                    >
                      {submitting ? "Saving..." : editingPostId ? "Update Post" : "Publish"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Box 2: Featured Image */}
              <Card className="rounded-xl border-border shadow-xs">
                <CardHeader className="py-3 px-4 border-b border-border/60">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Featured Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {coverImage ? (
                    <div className="space-y-2">
                      <img
                        src={coverImage}
                        alt="Featured Preview"
                        className="w-full h-36 object-cover rounded-xl border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => setCoverImage("")}
                        className="text-xs text-destructive hover:underline font-semibold block"
                      >
                        Remove featured image
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl border-2 border-dashed border-border/80 text-center text-xs text-muted-foreground">
                      No featured image chosen.
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Cover Image URL</Label>
                    <Input
                      placeholder="https://images.pexels.com/..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="rounded-xl text-xs"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Box 3: Categories */}
              <Card className="rounded-xl border-border shadow-xs">
                <CardHeader className="py-3 px-4 border-b border-border/60">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Folder className="h-4 w-4 text-primary" />
                    Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    {PRESET_CATEGORIES.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer hover:text-primary py-0.5"
                      >
                        <input
                          type="radio"
                          name="blogCategory"
                          checked={category === cat}
                          onChange={() => setCategory(cat)}
                          className="text-primary focus:ring-primary rounded"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-border/60">
                    <Label className="text-xs font-semibold">Or custom category:</Label>
                    <Input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Pediatric Cardiology"
                      className="rounded-xl text-xs mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Box 4: Tags */}
              <Card className="rounded-xl border-border shadow-xs">
                <CardHeader className="py-3 px-4 border-b border-border/60">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <Input
                    placeholder="Separate tags with commas..."
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    e.g. HeartHealth, PreventiveMedicine, Diagnostics
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
