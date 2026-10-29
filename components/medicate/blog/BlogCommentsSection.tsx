"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  User,
  ShieldCheck,
  Trash2,
  CornerDownRight,
  LogIn,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getLoggedInUser } from "@/services/user/userServices";
import {
  getBlogComments,
  createBlogComment,
  deleteBlogComment,
} from "@/services/doctor/cmsServices";
import { IBlogComment } from "@/types/doctor.interface";
import { IUser, UserRole } from "@/types/user.interface";

interface BlogCommentsSectionProps {
  blogIdentifier: string;
  authorName?: string;
  onCommentsCountChange?: (count: number) => void;
}

export default function BlogCommentsSection({
  blogIdentifier,
  authorName = "Doctor",
  onCommentsCountChange,
}: BlogCommentsSectionProps) {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [comments, setComments] = useState<IBlogComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 1. Fetch current logged-in user
  useEffect(() => {
    let mounted = true;
    getLoggedInUser()
      .then((user) => {
        if (mounted) setCurrentUser(user);
      })
      .catch(() => {
        if (mounted) setCurrentUser(null);
      })
      .finally(() => {
        if (mounted) setIsAuthLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Fetch comments for this blog post
  const loadComments = async () => {
    if (!blogIdentifier) return;
    try {
      setIsLoadingComments(true);
      const data = await getBlogComments(blogIdentifier);
      setComments(data);

      // Compute total comments count (top-level + replies)
      const totalCount = data.reduce(
        (acc, c) => acc + 1 + (c.replies?.length || 0),
        0
      );
      if (onCommentsCountChange) {
        onCommentsCountChange(totalCount);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [blogIdentifier]);

  // Helper for human-readable relative time (Facebook style)
  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return "Just now";
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const isAdminUser = (role?: string) => {
    return (
      role === UserRole.ADMIN ||
      role === "ADMIN" ||
      role === UserRole.SUPER_ADMIN ||
      role === "SUPER_ADMIN" ||
      role === UserRole.DOCTOR ||
      role === "DOCTOR"
    );
  };

  // 3. Post a top-level comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please log in to submit a comment.");
      return;
    }
    if (!commentText.trim()) {
      toast.error("Please enter your comment or clinical question.");
      return;
    }

    try {
      setIsSubmittingComment(true);
      const res = await createBlogComment(blogIdentifier, commentText.trim());
      if (res?.success) {
        toast.success("Comment posted successfully!");
        setCommentText("");
        await loadComments();
      } else {
        toast.error(res?.message || "Failed to post comment");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 4. Post a threaded reply
  const handlePostReply = async (parentId: string) => {
    if (!currentUser) {
      toast.error("Please log in to reply.");
      return;
    }
    if (!replyText.trim()) {
      toast.error("Please write your reply message.");
      return;
    }

    try {
      setIsSubmittingReply(true);
      const res = await createBlogComment(
        blogIdentifier,
        replyText.trim(),
        parentId
      );
      if (res?.success) {
        toast.success("Reply posted successfully!");
        setReplyText("");
        setReplyingToId(null);
        await loadComments();
      } else {
        toast.error(res?.message || "Failed to post reply");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // 5. Delete a comment or reply
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      setDeletingId(commentId);
      const res = await deleteBlogComment(commentId);
      if (res?.success) {
        toast.success("Comment removed");
        await loadComments();
      } else {
        toast.error(res?.message || "Failed to delete comment");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error deleting comment");
    } finally {
      setDeletingId(null);
    }
  };

  const totalCommentsCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0
  );

  return (
    <div className="pt-12 border-t border-slate-200 space-y-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black text-[#0b1c2e]">
              Patient Inquiries & Comments
            </h3>
            <span className="bg-[#1673b8]/10 text-[#1673b8] font-bold text-base px-3 py-1 rounded-full">
              {totalCommentsCount}
            </span>
          </div>
          <p className="text-base text-slate-600 mt-1">
            Ask medical questions or consult with the doctor. Dr. {authorName}{" "}
            regularly reviews and replies to comments here.
          </p>
        </div>
      </div>

      {/* 1. Comment Creation Box (Logged in vs Guest) */}
      <div className="bg-[#f8fafd] border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        {isAuthLoading ? (
          <div className="flex items-center justify-center py-6 text-slate-500 gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-[#1673b8]" />
            <span className="text-base">Checking user session...</span>
          </div>
        ) : currentUser ? (
          <form onSubmit={handlePostComment} className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-xs shrink-0">
                <AvatarImage
                  src={currentUser.profilePhoto || undefined}
                  alt={currentUser.fullName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-[#1673b8] text-white font-bold text-base">
                  {getInitials(currentUser.fullName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-[#0b1c2e]">
                    {currentUser.fullName}
                  </span>
                  {isAdminUser(currentUser.role) ? (
                    <span className="inline-flex items-center gap-1 bg-[#1673b8] text-white font-semibold text-base px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="h-4 w-4" />
                      Doctor / Chamber Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-700 font-medium text-base px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-[#1673b8]" />
                      Patient
                    </span>
                  )}
                </div>

                <textarea
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    isAdminUser(currentUser.role)
                      ? "Write a public announcement, advice, or post update..."
                      : "Write your public comment or ask the doctor a question..."
                  }
                  required
                  className="w-full p-4 rounded-xl border border-slate-200 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1673b8] focus:ring-1 focus:ring-[#1673b8] shadow-xs resize-y"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-base text-slate-500">
                {isAdminUser(currentUser.role)
                  ? "Your reply/comment will be visibly marked as official Doctor advice."
                  : "The doctor will be able to reply directly to your question."}
              </span>
              <button
                type="submit"
                disabled={isSubmittingComment || !commentText.trim()}
                className="inline-flex items-center gap-2 bg-[#1673b8] hover:bg-[#0f5991] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-base px-6 py-3 rounded-xl shadow-xs transition-colors"
              >
                {isSubmittingComment ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Post Comment
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Guest CTA prompt */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="h-14 w-14 rounded-2xl bg-[#1673b8]/10 text-[#1673b8] flex items-center justify-center shrink-0">
                <LogIn className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#0b1c2e]">
                  Join the Discussion & Ask Dr. {authorName}
                </h4>
                <p className="text-base text-slate-600 mt-1">
                  Only logged-in patients and users can post comments or consult
                  directly with the doctor.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/login?redirect=/blog/${encodeURIComponent(blogIdentifier)}`}
                className="inline-flex items-center gap-2 bg-[#1673b8] hover:bg-[#0f5991] text-white font-bold text-base px-6 py-3 rounded-xl shadow-xs transition-colors"
              >
                <LogIn className="h-5 w-5" />
                Log In to Comment
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-base px-5 py-3 rounded-xl border border-slate-200 shadow-xs transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 2. Comments List (Facebook-style Threaded Discussion) */}
      <div className="space-y-6">
        {isLoadingComments ? (
          <div className="flex items-center justify-center py-12 gap-3 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-[#1673b8]" />
            <span className="text-base">Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-bold text-[#0b1c2e]">
              No comments posted yet
            </h4>
            <p className="text-base text-slate-500 max-w-md mx-auto">
              Be the first patient to share your experience or ask a question
              about this article.
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const isDoctorComment = isAdminUser(comment.user?.role);
            const isViewerDoctor = isAdminUser(currentUser?.role);
            const isCommentAuthor = currentUser?.id === comment.userId;

            // RULE: Only admin/doctor OR the original commenter can reply in this thread!
            const canReply = isViewerDoctor || isCommentAuthor;

            // Author or doctor can delete
            const canDelete = isViewerDoctor || isCommentAuthor;

            const isReplying = replyingToId === comment.id;

            return (
              <div
                key={comment.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-colors"
              >
                {/* Top Comment Row */}
                <div className="flex items-start gap-4">
                  {/* User Profile Avatar */}
                  <Avatar className="h-12 w-12 border border-slate-200 shadow-xs shrink-0">
                    <AvatarImage
                      src={comment.user?.profilePhoto || undefined}
                      alt={comment.user?.fullName}
                      className="object-cover"
                    />
                    <AvatarFallback
                      className={
                        isDoctorComment
                          ? "bg-[#1673b8] text-white font-bold text-base"
                          : "bg-slate-200 text-slate-700 font-bold text-base"
                      }
                    >
                      {getInitials(comment.user?.fullName)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Comment Bubble & Body */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-[#f8fafd] border border-slate-100 rounded-2xl p-4 sm:p-5">
                      {/* Name & Badges Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-base text-[#0b1c2e]">
                            {comment.user?.fullName || "Verified User"}
                          </span>

                          {isDoctorComment ? (
                            <span className="inline-flex items-center gap-1 bg-[#1673b8] text-white font-bold text-base px-2.5 py-0.5 rounded-full shadow-xs">
                              <ShieldCheck className="h-4 w-4" />
                              Doctor / Chamber Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-700 font-semibold text-base px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="h-4 w-4 text-[#1673b8]" />
                              Patient
                            </span>
                          )}
                        </div>

                        {/* Timestamp */}
                        <span className="text-base text-slate-500 font-medium">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>

                      {/* Comment Message Text */}
                      <div className="text-base text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                        {comment.content}
                      </div>
                    </div>

                    {/* Action Bar: Reply & Delete */}
                    <div className="flex items-center gap-4 mt-2 px-2">
                      {/* Reply Option */}
                      {canReply && (
                        <button
                          type="button"
                          onClick={() => {
                            if (isReplying) {
                              setReplyingToId(null);
                              setReplyText("");
                            } else {
                              setReplyingToId(comment.id);
                              setReplyText("");
                            }
                          }}
                          className="inline-flex items-center gap-1.5 font-bold text-base text-[#1673b8] hover:text-[#0f5991] transition-colors"
                        >
                          <CornerDownRight className="h-4 w-4" />
                          {isReplying ? "Cancel Reply" : "Reply"}
                        </button>
                      )}

                      {/* Delete Option */}
                      {canDelete && (
                        <button
                          type="button"
                          disabled={deletingId === comment.id}
                          onClick={() => handleDeleteComment(comment.id)}
                          className="inline-flex items-center gap-1 font-medium text-base text-rose-500 hover:text-rose-700 disabled:opacity-50 transition-colors"
                        >
                          {deletingId === comment.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete
                        </button>
                      )}
                    </div>

                    {/* Threaded Sub-Replies List (Facebook Style) */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pt-4 border-l-2 border-[#1673b8]/20 ml-3 sm:ml-5 pl-4 sm:pl-6 space-y-4">
                        {comment.replies.map((reply) => {
                          const isReplyDoctor = isAdminUser(reply.user?.role);
                          const canDeleteReply =
                            isViewerDoctor || currentUser?.id === reply.userId;

                          return (
                            <div
                              key={reply.id}
                              className="flex items-start gap-3"
                            >
                              <Avatar className="h-10 w-10 border border-slate-200 shrink-0">
                                <AvatarImage
                                  src={reply.user?.profilePhoto || undefined}
                                  alt={reply.user?.fullName}
                                  className="object-cover"
                                />
                                <AvatarFallback
                                  className={
                                    isReplyDoctor
                                      ? "bg-[#1673b8] text-white font-bold text-base"
                                      : "bg-slate-200 text-slate-700 font-bold text-base"
                                  }
                                >
                                  {getInitials(reply.user?.fullName)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <div
                                  className={`rounded-2xl p-4 border ${
                                    isReplyDoctor
                                      ? "bg-blue-50/70 border-blue-200"
                                      : "bg-slate-50 border-slate-200"
                                  }`}
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-bold text-base text-[#0b1c2e]">
                                        {reply.user?.fullName ||
                                          "Verified User"}
                                      </span>

                                      {isReplyDoctor ? (
                                        <span className="inline-flex items-center gap-1 bg-[#1673b8] text-white font-bold text-base px-2 py-0.5 rounded-full shadow-xs">
                                          <ShieldCheck className="h-3.5 w-3.5" />
                                          Doctor
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-700 font-semibold text-base px-2 py-0.5 rounded-full">
                                          Patient
                                        </span>
                                      )}
                                    </div>

                                    <span className="text-base text-slate-500 font-medium">
                                      {formatTimeAgo(reply.createdAt)}
                                    </span>
                                  </div>

                                  <div className="text-base text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                                    {reply.content}
                                  </div>
                                </div>

                                {canDeleteReply && (
                                  <div className="mt-1 px-2">
                                    <button
                                      type="button"
                                      disabled={deletingId === reply.id}
                                      onClick={() =>
                                        handleDeleteComment(reply.id)
                                      }
                                      className="inline-flex items-center gap-1 font-medium text-base text-rose-500 hover:text-rose-700 disabled:opacity-50 transition-colors"
                                    >
                                      {deletingId === reply.id ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-3.5 w-3.5" />
                                      )}
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Inline Reply Composer (Facebook Style) */}
                    {isReplying && currentUser && (
                      <div className="mt-4 border-l-2 border-[#1673b8] ml-3 sm:ml-5 pl-4 sm:pl-6 pt-2">
                        <div className="bg-[#f8fafd] border border-slate-200 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center gap-2 font-bold text-base text-[#0b1c2e]">
                            <CornerDownRight className="h-4 w-4 text-[#1673b8]" />
                            <span>
                              {isViewerDoctor
                                ? `Reply as Doctor to ${comment.user?.fullName}:`
                                : `Follow up with Dr. ${authorName}:`}
                            </span>
                          </div>

                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={
                              isViewerDoctor
                                ? "Provide clinical guidance, chamber hotline, or consultation advice..."
                                : "Type your follow-up reply..."
                            }
                            required
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1673b8] focus:ring-1 focus:ring-[#1673b8] shadow-xs"
                          />

                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingToId(null);
                                setReplyText("");
                              }}
                              className="font-bold text-base text-slate-600 hover:text-slate-800 px-4 py-2 rounded-xl transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={
                                isSubmittingReply || !replyText.trim()
                              }
                              onClick={() => handlePostReply(comment.id)}
                              className="inline-flex items-center gap-2 bg-[#1673b8] hover:bg-[#0f5991] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-base px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                            >
                              {isSubmittingReply ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Replying...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4" />
                                  Post Reply
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

