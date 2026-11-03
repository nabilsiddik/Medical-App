"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { TablePagination } from "@/components/shared/tables/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  getAllBlogsAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  uploadMediaFile,
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
  Folder,
  Tag,
  Search,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  RotateCcw,
  Minus,
  UploadCloud,
  X,
  ChevronDown,
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

const FORMAT_OPTIONS = [
  { label: "Paragraph", tag: "p", className: "text-base font-normal" },
  { label: "Heading 1", tag: "h1", className: "text-xl font-bold" },
  { label: "Heading 2", tag: "h2", className: "text-lg font-bold" },
  { label: "Heading 3", tag: "h3", className: "text-base font-bold" },
  { label: "Heading 4", tag: "h4", className: "text-base font-semibold" },
  { label: "Blockquote", tag: "blockquote", className: "italic text-muted-foreground border-l-2 border-primary pl-2" },
  { label: "Preformatted", tag: "pre", className: "font-mono text-base bg-muted/60 px-1 rounded" },
];

export default function AdminBlogsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlSearchTerm = searchParams.get("searchTerm") || "";
  const urlCategory = searchParams.get("category") || "ALL";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlLimit = parseInt(searchParams.get("limit") || "10", 10);

  const [blogs, setBlogs] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "editor">("list");
  const [searchQuery, setSearchQuery] = useState(urlSearchTerm);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(urlCategory);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchQuery(urlSearchTerm);
    setSelectedCategoryFilter(urlCategory);
  }, [urlSearchTerm, urlCategory]);

  // Push debounced search to URL
  useEffect(() => {
    if (debouncedSearch.trim() !== urlSearchTerm) {
      updateUrl({ searchTerm: debouncedSearch.trim() });
    }
  }, [debouncedSearch]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset to page 1 on filter/search change

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
    setSearchQuery("");
    setSelectedCategoryFilter("ALL");
    startTransition(() => {
      router.push(pathname);
    });
  };

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

  // Cloudinary Upload States
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState("");

  // Word count & cursor element path
  const [wordCount, setWordCount] = useState(0);
  const [currentPath, setCurrentPath] = useState("p");

  // Custom Format Dropdown State
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const [activeFormat, setActiveFormat] = useState("Paragraph");

  // Add Media Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaLocalPreview, setMediaLocalPreview] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");

  const visualEditorRef = useRef<HTMLDivElement | null>(null);
  const featuredFileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaFileInputRef = useRef<HTMLInputElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const formatDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close format dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formatDropdownRef.current && !formatDropdownRef.current.contains(e.target as Node)) {
        setIsFormatMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Selection preservation helpers for HTML5 contentEditable
  const saveSelection = () => {
    if (editorTab !== "visual" || !visualEditorRef.current) return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (visualEditorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  };

  const restoreSelection = () => {
    if (editorTab !== "visual" || !visualEditorRef.current) return;
    visualEditorRef.current.focus();
    const sel = window.getSelection();
    if (!sel) return;

    if (
      savedRangeRef.current &&
      visualEditorRef.current.contains(savedRangeRef.current.commonAncestorContainer)
    ) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    } else {
      const range = document.createRange();
      range.selectNodeContents(visualEditorRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      savedRangeRef.current = range.cloneRange();
    }
  };

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

  // Synchronize HTML into visual editor whenever switching to visual mode or opening a post
  useEffect(() => {
    if (viewMode === "editor" && editorTab === "visual" && visualEditorRef.current) {
      if (visualEditorRef.current.innerHTML !== htmlContent) {
        visualEditorRef.current.innerHTML = htmlContent;
      }
    }
  }, [viewMode, editorTab, editingPostId]);

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
    const initialText = "<p>Start typing your clinical article or healthcare advisory here...</p>";
    setHtmlContent(initialText);
    setSummary("");
    setCoverImage("");
    setCategory("Health Tips");
    setTagsInput("Healthcare, Medicine, Wellness");
    setIsPublished(true);
    setViewMode("editor");
    setEditorTab("visual");

    // Ensure editor element gets content
    setTimeout(() => {
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = initialText;
      }
    }, 50);
  };

  // Open Editor for Existing Post (Fix: Guarantee description loads into visual editor)
  const handleOpenEditPost = (post: IBlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    const content = post.content || "<p></p>";
    setHtmlContent(content);
    setSummary(post.summary || "");
    setCoverImage(post.coverImage || "");
    setCategory(post.category || "Health Tips");
    setTagsInput(post.tags ? post.tags.join(", ") : "");
    setIsPublished(post.isPublished ?? true);
    setAuthorName(post.authorName || "Prof. Dr. Sarah Rahman");
    setViewMode("editor");
    setEditorTab("visual");

    // Populate visual editor immediately across render ticks
    if (visualEditorRef.current) {
      visualEditorRef.current.innerHTML = content;
    }
    setTimeout(() => {
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = content;
      }
    }, 20);
    setTimeout(() => {
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = content;
      }
    }, 100);
  };

  // Execute formatting command in visual editor with selection preservation
  const executeCmd = (command: string, value: string | undefined = undefined) => {
    if (editorTab !== "visual" || !visualEditorRef.current) return;
    visualEditorRef.current.focus();
    restoreSelection();
    document.execCommand(command, false, value);
    saveSelection();
    if (visualEditorRef.current) {
      setHtmlContent(visualEditorRef.current.innerHTML);
    }
  };

  // Apply Heading / Paragraph block format
  const handleApplyFormat = (tag: string, label: string) => {
    if (editorTab !== "visual" || !visualEditorRef.current) return;
    visualEditorRef.current.focus();
    restoreSelection();
    try {
      document.execCommand("formatBlock", false, `<${tag.toUpperCase()}>`);
    } catch {
      try {
        document.execCommand("formatBlock", false, tag);
      } catch {}
    }
    saveSelection();
    if (visualEditorRef.current) {
      setHtmlContent(visualEditorRef.current.innerHTML);
    }
    setActiveFormat(label);
    setIsFormatMenuOpen(false);
  };

  // Handle input in Visual editor
  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      const html = visualEditorRef.current.innerHTML;
      setHtmlContent(html);
      saveSelection();

      // Detect current tag node for "Path: p / h2 / blockquote"
      const sel = window.getSelection();
      if (sel && sel.anchorNode) {
        const parent = sel.anchorNode.parentElement;
        if (parent) {
          const tagName = parent.tagName.toLowerCase();
          setCurrentPath(tagName);
          const match = FORMAT_OPTIONS.find((f) => f.tag === tagName);
          if (match) {
            setActiveFormat(match.label);
          } else if (tagName === "div") {
            setActiveFormat("Paragraph");
          }
        }
      }
    }
  };

  // Add Link Prompt with selection preservation
  const handleAddLink = () => {
    if (editorTab !== "visual" || !visualEditorRef.current) return;
    saveSelection();
    const url = prompt("Enter link destination URL:", "https://");
    if (url) {
      restoreSelection();
      document.execCommand("createLink", false, url);
      saveSelection();
      if (visualEditorRef.current) {
        setHtmlContent(visualEditorRef.current.innerHTML);
      }
    }
  };

  // -------------------------------------------------------------
  // CLOUDINARY UPLOAD: Featured Image (With Instant Preview)
  // -------------------------------------------------------------
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP)");
      return;
    }

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setCoverImage(localUrl);
    setUploadingFeatured(true);

    try {
      const res = await uploadMediaFile(file);
      if (res?.url) {
        setCoverImage(res.url);
        toast.success("Featured image uploaded to Cloudinary successfully!");
      } else {
        toast.error("Cloudinary upload did not return an image URL");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to upload featured image to Cloudinary");
    } finally {
      setUploadingFeatured(false);
      if (featuredFileInputRef.current) {
        featuredFileInputRef.current.value = "";
      }
    }
  };

  // -------------------------------------------------------------
  // CLOUDINARY UPLOAD: In-Editor Media Image (With Instant Preview)
  // -------------------------------------------------------------
  const handleMediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Instant local preview in modal
    const previewUrl = URL.createObjectURL(file);
    setMediaLocalPreview(previewUrl);
    setUploadingMedia(true);

    try {
      const res = await uploadMediaFile(file);
      if (res?.url) {
        setUploadedMediaUrl(res.url);
        toast.success("Image uploaded to Cloudinary!");
      } else {
        toast.error("Cloudinary upload did not return an image URL");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to upload image to Cloudinary");
    } finally {
      setUploadingMedia(false);
      if (mediaFileInputRef.current) {
        mediaFileInputRef.current.value = "";
      }
    }
  };

  // Insert uploaded media image into post content at exact cursor position
  const handleInsertMedia = () => {
    if (uploadingMedia) {
      toast.error("Please wait for image upload to Cloudinary to complete.");
      return;
    }
    const finalUrl = uploadedMediaUrl.trim();
    if (!finalUrl) {
      toast.error("Please upload an image to Cloudinary first.");
      return;
    }

    if (editorTab === "visual" && visualEditorRef.current) {
      visualEditorRef.current.focus();

      const sel = window.getSelection();
      let range = savedRangeRef.current;

      // Ensure valid range inside editor
      if (!range || !visualEditorRef.current.contains(range.commonAncestorContainer)) {
        range = document.createRange();
        range.selectNodeContents(visualEditorRef.current);
        range.collapse(false);
      }

      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }

      // Create figure container
      const figure = document.createElement("figure");
      figure.className = "my-5 block text-center";

      const img = document.createElement("img");
      img.src = finalUrl;
      img.alt = mediaAlt.trim() || title || "Medical article image";
      img.className = "rounded-xl max-w-full h-auto mx-auto shadow-md";
      figure.appendChild(img);

      if (mediaCaption.trim()) {
        const figcaption = document.createElement("figcaption");
        figcaption.className = "text-muted-foreground italic text-center mt-2 text-base";
        figcaption.innerText = mediaCaption.trim();
        figure.appendChild(figcaption);
      }

      // Add a clean paragraph after the image so user can keep typing
      const afterP = document.createElement("p");
      afterP.innerHTML = "<br>";

      range.deleteContents();
      range.insertNode(afterP);
      range.insertNode(figure);

      // Move cursor to the paragraph below
      range.setStart(afterP, 0);
      range.collapse(true);
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
      savedRangeRef.current = range.cloneRange();

      // Synchronize editor innerHTML to htmlContent state
      setHtmlContent(visualEditorRef.current.innerHTML);
    } else {
      const imgTag = `<figure class="my-5 block text-center"><img src="${finalUrl}" alt="${
        mediaAlt.trim() || title || "Medical article image"
      }" class="rounded-xl max-w-full h-auto mx-auto shadow-md" />${
        mediaCaption.trim()
          ? `<figcaption class="text-muted-foreground italic text-center mt-2 text-base">${mediaCaption.trim()}</figcaption>`
          : ""
      }</figure><p><br></p>`;
      setHtmlContent((prev) => prev + "\n" + imgTag);
    }

    setIsMediaModalOpen(false);
    setUploadedMediaUrl("");
    setMediaLocalPreview("");
    setMediaAlt("");
    setMediaCaption("");
    toast.success("Image embedded into article content!");
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

  const hasActiveFilters = Boolean(
    urlSearchTerm ||
    (urlCategory && urlCategory !== "ALL")
  );

  // Filtered blogs for table
  const filteredBlogs = blogs.filter((b) => {
    const term = urlSearchTerm.toLowerCase();
    const matchesQuery =
      !urlSearchTerm ||
      b.title.toLowerCase().includes(term) ||
      b.slug.toLowerCase().includes(term) ||
      (b.category && b.category.toLowerCase().includes(term));

    const matchesCategory =
      urlCategory === "ALL" || b.category === urlCategory;

    return matchesQuery && matchesCategory;
  });

  const total = filteredBlogs.length;
  const totalPage = Math.max(1, Math.ceil(total / urlLimit));
  const currentPage = Math.min(urlPage, totalPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * urlLimit,
    currentPage * urlLimit
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ============================================================== */}
      {/* 1. LIST VIEW: Posts Table & Header (Normal Comfortable Fonts) */}
      {/* ============================================================== */}
      {viewMode === "list" && (
        <div className="space-y-6">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <FileText className="h-7 w-7 text-primary" />
                Medical Blog & Clinical Articles
              </h1>
              <p className="text-muted-foreground mt-1 text-base">
                Write, publish, and manage health guidelines, clinical case studies, and patient
                recovery tips.
              </p>
            </div>

            <Button
              onClick={handleOpenNewPost}
              className="rounded-xl font-bold gap-2 bg-primary text-primary-foreground shadow-xs h-11 px-5 text-base"
            >
              <Plus className="h-5 w-5" />
              Add New Post
            </Button>
          </div>

          {/* Search & Filter Bar */}
          <Card className="rounded-2xl border-border/80 shadow-xs">
            <CardContent className="p-4 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search articles by title, slug, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-9 rounded-xl h-11 text-base bg-background border-border/80"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      updateUrl({ searchTerm: "" });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Label className="font-semibold text-muted-foreground whitespace-nowrap text-base">
                  Filter Topic:
                </Label>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => {
                    setSelectedCategoryFilter(e.target.value);
                    updateUrl({ category: e.target.value });
                  }}
                  className="rounded-xl border border-input bg-background h-11 px-3 text-foreground font-semibold text-base"
                >
                  <option value="ALL">All Categories ({blogs.length})</option>
                  {PRESET_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    className="h-11 px-3.5 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Reset filters"
                  >
                    <RotateCcw className="h-4 w-4 mr-1.5" />
                    Reset
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchBlogs}
                  disabled={loading}
                  className="h-11 px-3.5 rounded-xl text-base text-muted-foreground cursor-pointer"
                  title="Refresh articles"
                >
                  <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts Table */}
          <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-md">
                  <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-base font-medium text-foreground">Loading articles...</span>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border/80 text-muted-foreground font-bold text-base">
                    <th className="p-4 pl-6">Title</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-base">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                        Loading published articles...
                      </td>
                    </tr>
                  ) : paginatedBlogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground/40" />
                        No articles found. Click{" "}
                        <button
                          onClick={handleOpenNewPost}
                          className="text-primary font-bold underline cursor-pointer"
                        >
                          Add New Post
                        </button>{" "}
                        to create your first medical blog.
                      </td>
                    </tr>
                  ) : (
                    paginatedBlogs.map((post) => (
                      <tr
                        key={post.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="p-4 pl-6">
                          <div className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                            {post.title}
                          </div>
                          <div className="text-muted-foreground font-mono mt-0.5 text-base">
                            /blog/{post.slug}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-muted-foreground">
                          {post.authorName || "Doctor"}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="font-semibold text-primary border-primary/30 py-1 px-2.5 text-base">
                            {post.category || "General"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {post.isPublished ? (
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-300 py-1 px-2.5 text-base">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-amber-600 bg-amber-50 py-1 px-2.5 text-base">
                              Draft
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 font-mono text-muted-foreground">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Draft"}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenEditPost(post)}
                              className="rounded-lg h-9 px-3 text-primary hover:bg-primary/10 gap-1.5 font-semibold text-base"
                              title="Edit in WordPress-style editor"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>

                            <Link
                              href={`/blog/${post.slug || post.id}`}
                              target="_blank"
                              className="inline-flex items-center justify-center rounded-lg h-9 px-3 text-muted-foreground hover:text-foreground hover:bg-muted gap-1 font-semibold text-base"
                              title="View Live Post"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeletePost(post.id, post.title)}
                              className="rounded-lg h-9 px-2.5 text-destructive hover:bg-destructive/10"
                              title="Delete Post"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            <div className="px-6 border-t border-border/80">
              <TablePagination
                meta={{ page: currentPage, limit: urlLimit, total, totalPage }}
                itemName="articles"
                isPending={loading || isPending}
              />
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. WORDPRESS-STYLE POST EDITOR (Normal Font Size & Cloudinary Upload) */}
      {/* ============================================================== */}
      {viewMode === "editor" && (
        <div
          key={`${editingPostId || "new"}-editor`}
          className={`space-y-6 ${
            isFullscreen ? "fixed inset-0 z-50 bg-background p-6 overflow-y-auto" : ""
          }`}
        >
          {/* Header Action Bar */}
          <div className="flex items-center justify-between gap-4 pb-2 border-b border-border/80">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setViewMode("list")}
                className="rounded-xl gap-2 font-semibold text-base h-10"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to All Posts
              </Button>
              <h2 className="text-2xl font-bold text-foreground">
                {editingPostId ? "Edit Medical Post" : "Add New Post"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="rounded-xl gap-1.5 text-muted-foreground font-semibold text-base"
                title="Toggle Fullscreen Editor"
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
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
                <div className="flex items-center gap-2 text-base text-muted-foreground px-1 pt-1 font-mono">
                  <span>Permalink:</span>
                  <span className="text-primary underline">
                    http://yourclinic.com/blog/
                    {isEditingSlug ? (
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="bg-background border border-input rounded px-2 py-0.5 font-mono text-base text-foreground"
                      />
                    ) : (
                      <span>{slug || "post-slug"}</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingSlug(!isEditingSlug)}
                    className="ml-1 text-muted-foreground hover:text-foreground font-sans underline cursor-pointer"
                  >
                    {isEditingSlug ? "Done" : "Edit"}
                  </button>
                </div>
              </div>

              {/* WordPress TinyMCE Editor Box */}
              <div className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
                {/* Top Action Bar: Add Media on left, Visual/Text on right */}
                <div className="bg-muted/60 p-3 border-b border-border flex items-center justify-between gap-3">
                  {/* "Add Media" Button with Cloudinary Upload Modal */}
                  <Dialog
                    open={isMediaModalOpen}
                    onOpenChange={(open) => {
                      setIsMediaModalOpen(open);
                      if (!open) {
                        setUploadedMediaUrl("");
                        setMediaLocalPreview("");
                        setMediaAlt("");
                        setMediaCaption("");
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onMouseDown={() => saveSelection()}
                        onClick={() => {
                          saveSelection();
                          setIsMediaModalOpen(true);
                        }}
                        className="rounded-lg h-9 gap-2 font-bold text-base bg-background shadow-xs hover:bg-muted"
                      >
                        <ImageIcon className="h-4 w-4 text-primary" />
                        Add Media
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[540px]">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                          <UploadCloud className="h-6 w-6 text-primary" />
                          Upload Media to Cloudinary
                        </DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground">
                          Upload image directly from your computer to Cloudinary and insert it at your cursor location.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-3">
                        {/* Hidden Cloudinary File Upload Box */}
                        <input
                          ref={mediaFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleMediaFileUpload}
                          className="hidden"
                        />

                        {mediaLocalPreview || uploadedMediaUrl ? (
                          <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
                            <div className="relative rounded-lg overflow-hidden border border-border h-52 bg-slate-900 flex items-center justify-center">
                              <img
                                src={mediaLocalPreview || uploadedMediaUrl}
                                alt="Uploaded preview"
                                className="w-full h-full object-contain"
                              />
                              {uploadingMedia && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                                  <RefreshCw className="h-7 w-7 animate-spin text-primary" />
                                  <span className="font-semibold text-base">Uploading to Cloudinary...</span>
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setUploadedMediaUrl("");
                                  setMediaLocalPreview("");
                                }}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-white hover:opacity-90 shadow-md cursor-pointer transition-transform hover:scale-105"
                                title="Remove image"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-base">
                              {uploadedMediaUrl ? (
                                <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Uploaded to Cloudinary (Ready to insert)
                                </span>
                              ) : uploadingMedia ? (
                                <span className="text-primary font-semibold flex items-center gap-1.5">
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                  Optimizing & storing in Cloudinary...
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-base">Image selected</span>
                              )}

                              <button
                                type="button"
                                onClick={() => mediaFileInputRef.current?.click()}
                                className="text-primary text-base font-semibold hover:underline cursor-pointer"
                              >
                                Change Image
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => mediaFileInputRef.current?.click()}
                            className="border-2 border-dashed border-primary/40 hover:border-primary rounded-xl p-8 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40 space-y-3 group"
                          >
                            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                              {uploadingMedia ? (
                                <RefreshCw className="h-7 w-7 animate-spin" />
                              ) : (
                                <UploadCloud className="h-7 w-7" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-lg">
                                {uploadingMedia
                                  ? "Uploading image to Cloudinary..."
                                  : "Click to browse image from computer"}
                              </p>
                              <p className="text-muted-foreground text-base mt-1">
                                Supports JPG, PNG, WEBP up to 10MB
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <Label className="font-semibold text-base">Alt Text (Accessibility & SEO)</Label>
                          <Input
                            placeholder="e.g. Doctor explaining clinical scan results"
                            value={mediaAlt}
                            onChange={(e) => setMediaAlt(e.target.value)}
                            className="rounded-xl h-11 text-base"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="font-semibold text-base">Image Caption (Optional)</Label>
                          <Input
                            placeholder="e.g. Figure 1: Early diagnosis protocol"
                            value={mediaCaption}
                            onChange={(e) => setMediaCaption(e.target.value)}
                            className="rounded-xl h-11 text-base"
                          />
                        </div>
                      </div>

                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                          variant="outline"
                          onClick={() => setIsMediaModalOpen(false)}
                          className="rounded-xl text-base"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleInsertMedia}
                          disabled={!uploadedMediaUrl || uploadingMedia}
                          className="font-bold rounded-xl text-base bg-primary text-primary-foreground shadow-xs gap-2"
                        >
                          {uploadingMedia && <RefreshCw className="h-4 w-4 animate-spin" />}
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
                      className={`px-4 py-1.5 text-base font-bold rounded-md transition-all cursor-pointer ${
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
                      className={`px-4 py-1.5 text-base font-bold rounded-md transition-all cursor-pointer ${
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
                  <div className="bg-muted/40 p-2.5 border-b border-border/80 flex flex-wrap items-center gap-1.5">
                    {/* Headings / Block format Custom Dropdown */}
                    <div className="relative" ref={formatDropdownRef}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          saveSelection();
                        }}
                        onClick={() => setIsFormatMenuOpen((prev) => !prev)}
                        className="h-9 px-3 rounded-lg border border-input bg-background hover:bg-muted/80 text-foreground text-base font-semibold flex items-center gap-2 cursor-pointer shadow-xs min-w-[130px] justify-between"
                        title="Paragraph / Headings Format"
                      >
                        <span>{activeFormat}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </button>

                      {isFormatMenuOpen && (
                        <div className="absolute left-0 top-full mt-1.5 w-48 rounded-xl border border-border bg-popover shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in-50 zoom-in-95">
                          {FORMAT_OPTIONS.map((opt) => (
                            <button
                              key={opt.tag}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                saveSelection();
                              }}
                              onClick={() => handleApplyFormat(opt.tag, opt.label)}
                              className={`w-full text-left px-3.5 py-2 text-base transition-colors flex items-center justify-between cursor-pointer ${
                                activeFormat === opt.label
                                  ? "bg-primary/10 text-primary font-bold"
                                  : "text-foreground hover:bg-muted"
                              }`}
                            >
                              <span className={opt.className}>{opt.label}</span>
                              {activeFormat === opt.label && <CheckCircle2 className="h-4 w-4 text-primary" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="h-5 w-px bg-border mx-1" />

                    {/* Bold */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => executeCmd("bold")}
                      className="p-1.5 rounded-lg hover:bg-muted text-foreground font-bold h-9 w-9 flex items-center justify-center border border-transparent hover:border-border cursor-pointer transition-colors"
                      title="Bold (Ctrl+B)"
                    >
                      <Bold className="h-4 w-4" />
                    </button>

                    {/* Italic */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => executeCmd("italic")}
                      className="p-1.5 rounded-lg hover:bg-muted text-foreground h-9 w-9 flex items-center justify-center border border-transparent hover:border-border cursor-pointer transition-colors"
                      title="Italic (Ctrl+I)"
                    >
                      <Italic className="h-4 w-4" />
                    </button>

                    {/* Strikethrough */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => executeCmd("strikeThrough")}
                      className="p-1.5 rounded-lg hover:bg-muted text-foreground h-9 w-9 flex items-center justify-center border border-transparent hover:border-border cursor-pointer transition-colors"
                      title="Strikethrough"
                    >
                      <Strikethrough className="h-4 w-4" />
                    </button>

                    <div className="h-5 w-px bg-border mx-1" />

                    {/* Bullet List */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => executeCmd("insertUnorderedList")}
                      className="p-1.5 rounded-lg hover:bg-muted text-foreground h-9 w-9 flex items-center justify-center border border-transparent hover:border-border cursor-pointer transition-colors"
                      title="Bulleted list"
                    >
                      <List className="h-4 w-4" />
                    </button>

                    {/* Numbered List */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => executeCmd("insertOrderedList")}
                      className="p-1.5 rounded-lg hover:bg-muted text-foreground h-9 w-9 flex items-center justify-center border border-transparent hover:border-border cursor-pointer transition-colors"
                      title="Numbered list"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </button>

                    {/* Blockquote */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => handleApplyFormat("blockquote", "Blockquote")}
                      className="p-1.5 rounded-lg hover:bg-muted text-foreground h-9 w-9 flex items-center justify-center border border-transparent hover:border-border cursor-pointer transition-colors"
                      title="Quote"
                    >
                      <Quote className="h-4 w-4" />
                    </button>

                    {/* Horizontal Line */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => executeCmd("insertHorizontalRule")}
                      className="p-1.5 rounded-lg hover:bg-muted text-foreground h-9 w-9 flex items-center justify-center border border-transparent hover:border-border cursor-pointer transition-colors"
                      title="Horizontal line"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <div className="h-5 w-px bg-border mx-1" />

                    {/* Alignments */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => executeCmd("justifyLeft")}
                      className="p-1.5 rounded-lg hover:bg-muted text-foreground h-9 w-9 flex items-center justify-center border border-transparent hover:border-border cursor-pointer transition-colors"
                      title="Align left"
                    >
                      <AlignLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => executeCmd("justifyCenter")}
                      className="p-1.5 rounded-lg hover:bg-muted text-foreground h-9 w-9 flex items-center justify-center border border-transparent hover:border-border cursor-pointer transition-colors"
                      title="Align center"
                    >
                      <AlignCenter className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => executeCmd("justifyRight")}
                      className="p-1.5 rounded-lg hover:bg-muted text-foreground h-9 w-9 flex items-center justify-center border border-transparent hover:border-border cursor-pointer transition-colors"
                      title="Align right"
                    >
                      <AlignRight className="h-4 w-4" />
                    </button>

                    <div className="h-5 w-px bg-border mx-1" />

                    {/* Link / Unlink */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={handleAddLink}
                      className="p-1.5 rounded-lg hover:bg-muted text-foreground h-9 w-9 flex items-center justify-center border border-transparent hover:border-border cursor-pointer transition-colors"
                      title="Insert/edit link"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        saveSelection();
                      }}
                      onClick={() => executeCmd("unlink")}
                      className="p-1.5 rounded-lg hover:bg-muted text-foreground h-9 w-9 flex items-center justify-center border border-transparent hover:border-border cursor-pointer transition-colors"
                      title="Remove link"
                    >
                      <Unlink className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Editor Content Area (Guaranteed Content Rendering) */}
                {editorTab === "visual" ? (
                  <div
                    ref={(el) => {
                      visualEditorRef.current = el;
                      if (el && !el.innerHTML && htmlContent) {
                        el.innerHTML = htmlContent;
                      }
                    }}
                    contentEditable
                    data-rich-editor="true"
                    onInput={handleVisualInput}
                    onKeyUp={saveSelection}
                    onMouseUp={saveSelection}
                    onSelect={saveSelection}
                    onFocus={saveSelection}
                    onBlur={saveSelection}
                    className="visual-editor-content blog-content min-h-[440px] p-6 focus:outline-none text-foreground font-normal leading-relaxed text-base bg-card"
                    style={{ minHeight: "440px" }}
                  />
                ) : (
                  <textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    className="w-full min-h-[440px] p-5 font-mono text-base bg-background text-foreground focus:outline-none resize-y"
                    placeholder="<p>Raw HTML article content here...</p>"
                  />
                )}

                {/* WordPress Bottom Bar: Path & Word count */}
                <div className="bg-muted/40 px-5 py-2.5 border-t border-border flex items-center justify-between text-base text-muted-foreground font-mono">
                  <span>Path: {currentPath}</span>
                  <span>Word count: {wordCount}</span>
                </div>
              </div>

              {/* Excerpt Summary Box */}
              <Card className="rounded-xl border-border/80 shadow-xs">
                <CardHeader className="py-4 px-5">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Post Excerpt / Meta Description
                  </CardTitle>
                  <CardDescription className="text-base">
                    Short summary displayed on public blog cards and search engine snippets.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0">
                  <Textarea
                    placeholder="Write an excerpt (optional, auto-generated from post content if left empty)..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="rounded-xl text-base h-24"
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
                <CardHeader className="py-4 px-5 border-b border-border/60">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Save className="h-5 w-5 text-primary" />
                    Publish
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4 text-base">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Status:</span>
                    <Badge variant={isPublished ? "default" : "secondary"} className="font-bold text-base px-2.5 py-0.5">
                      {isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Visibility:</span>
                    <span className="font-bold text-foreground">Public</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Author:</span>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="font-semibold text-foreground text-right bg-transparent border-b border-border/80 focus:outline-none text-base"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={submitting}
                      onClick={() => handleSavePost(false)}
                      className="rounded-xl font-semibold text-base h-10 px-4"
                    >
                      Save Draft
                    </Button>

                    <Button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSavePost(true)}
                      className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 px-5 text-base h-10 shadow-xs"
                    >
                      {submitting ? "Saving..." : editingPostId ? "Update Post" : "Publish"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Box 2: Featured Image (Cloudinary Upload System) */}
              <Card className="rounded-xl border-border shadow-xs">
                <CardHeader className="py-4 px-5 border-b border-border/60">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Featured Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  <input
                    ref={featuredFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageUpload}
                    className="hidden"
                  />

                  {coverImage ? (
                    <div className="space-y-3">
                      <div className="relative rounded-xl overflow-hidden border border-border group">
                        <img
                          src={coverImage}
                          alt="Featured Preview"
                          className="w-full h-44 object-cover"
                        />
                        {uploadingFeatured ? (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white gap-2">
                            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                            <span className="font-semibold text-base">Uploading to Cloudinary...</span>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => featuredFileInputRef.current?.click()}
                              className="rounded-lg font-semibold text-base"
                            >
                              Change Image
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-emerald-600 font-semibold flex items-center gap-1.5 text-base">
                          {uploadingFeatured ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                              <span className="text-primary">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Cloudinary Synced
                            </>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCoverImage("")}
                          className="text-base text-destructive hover:underline font-semibold cursor-pointer"
                        >
                          Remove image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => featuredFileInputRef.current?.click()}
                      className="border-2 border-dashed border-primary/40 hover:border-primary rounded-xl p-6 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40 space-y-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        {uploadingFeatured ? (
                          <RefreshCw className="h-6 w-6 animate-spin" />
                        ) : (
                          <UploadCloud className="h-6 w-6" />
                        )}
                      </div>
                      <p className="font-bold text-foreground text-base">
                        {uploadingFeatured ? "Uploading to Cloudinary..." : "Upload Featured Image"}
                      </p>
                      <p className="text-muted-foreground text-base">
                        Click to select image file from your device
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Box 3: Categories */}
              <Card className="rounded-xl border-border shadow-xs">
                <CardHeader className="py-4 px-5 border-b border-border/60">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Folder className="h-5 w-5 text-primary" />
                    Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-3">
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {PRESET_CATEGORIES.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-2.5 font-semibold text-foreground cursor-pointer hover:text-primary py-0.5 text-base"
                      >
                        <input
                          type="radio"
                          name="blogCategory"
                          checked={category === cat}
                          onChange={() => setCategory(cat)}
                          className="text-primary focus:ring-primary rounded h-4 w-4 cursor-pointer"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-border/60 space-y-1">
                    <Label className="font-semibold text-base">Or custom category:</Label>
                    <Input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Pediatric Cardiology"
                      className="rounded-xl h-10 text-base"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Box 4: Tags */}
              <Card className="rounded-xl border-border shadow-xs">
                <CardHeader className="py-4 px-5 border-b border-border/60">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-2">
                  <Input
                    placeholder="Separate tags with commas..."
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="rounded-xl h-11 text-base"
                  />
                  <p className="text-muted-foreground text-base">
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
