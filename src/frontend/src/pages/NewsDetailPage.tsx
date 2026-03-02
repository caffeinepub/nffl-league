import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import { motion } from "motion/react";
import type { NewsCategory } from "../backend.d";
import { ErrorMessage } from "../components/ErrorMessage";
import { useNewsPost } from "../hooks/useQueries";

const categoryColors: Record<NewsCategory, string> = {
  teamNews: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  gameRecap: "bg-green-500/20 text-green-300 border-green-500/30",
  announcement:
    "bg-orange-DEFAULT/20 text-orange-DEFAULT border-orange-muted/30",
  leagueUpdate: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const categoryLabels: Record<NewsCategory, string> = {
  teamNews: "Team News",
  gameRecap: "Game Recap",
  announcement: "Announcement",
  leagueUpdate: "League Update",
};

function formatDate(timestamp: bigint) {
  const ms = Number(timestamp);
  const date = ms > 1e12 ? new Date(ms / 1_000_000) : new Date(ms);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function NewsDetailPage() {
  const { id } = useParams({ strict: false });
  const postId = BigInt(id ?? "0");
  const { data: post, isLoading, isError } = useNewsPost(postId);

  return (
    <div className="min-h-screen">
      {/* Back navigation */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <Button
          asChild
          variant="ghost"
          className="text-muted-foreground hover:text-foreground -ml-2"
        >
          <Link to="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="font-ui font-semibold text-sm uppercase tracking-wide">
              Back to News
            </span>
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <ArticleSkeleton />
      ) : isError || !post ? (
        <div className="container mx-auto px-4">
          <ErrorMessage message="Article not found or could not be loaded." />
        </div>
      ) : (
        <article className="container mx-auto px-4 pb-16">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Category + Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge
                  variant="outline"
                  className={`${categoryColors[post.category]} font-ui uppercase tracking-wide text-xs`}
                >
                  <Tag size={10} className="mr-1" />
                  {categoryLabels[post.category]}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground mb-6">
                {post.title}
              </h1>

              {/* Author + Date */}
              <div className="flex flex-wrap items-center gap-5 pb-6 border-b border-border/50 mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-ui">
                  <div className="w-8 h-8 rounded-full bg-orange-DEFAULT/20 flex items-center justify-center">
                    <User size={14} className="text-orange-DEFAULT" />
                  </div>
                  <div>
                    <div className="text-foreground font-semibold">
                      {post.author}
                    </div>
                    <div className="text-xs text-muted-foreground">Author</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-ui">
                  <Calendar size={14} />
                  <span>{formatDate(post.publishedDate)}</span>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-invert prose-lg max-w-none">
                {post.content.split("\n\n").map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-foreground/80 font-body leading-relaxed text-base md:text-lg mb-5"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Back link */}
              <div className="mt-12 pt-8 border-t border-border/50">
                <Button
                  asChild
                  variant="outline"
                  className="border-orange-muted/50 text-orange-DEFAULT hover:bg-orange-DEFAULT/10"
                >
                  <Link to="/news">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to all news
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </article>
      )}
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div className="container mx-auto px-4 pb-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32 bg-secondary" />
        <Skeleton className="h-12 w-full bg-secondary" />
        <Skeleton className="h-8 w-3/4 bg-secondary" />
        <div className="flex gap-4 pt-2 pb-6 border-b border-border">
          <Skeleton className="h-8 w-32 bg-secondary" />
          <Skeleton className="h-8 w-40 bg-secondary" />
        </div>
        {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((k) => (
          <Skeleton key={k} className="h-5 w-full bg-secondary" />
        ))}
      </div>
    </div>
  );
}
