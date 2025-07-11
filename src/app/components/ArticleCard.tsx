import { Article } from "../types/Article";
import { Card, CardContent } from "./ui/card";
import { Globe } from "lucide-react";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <Card className="flex flex-col overflow-hidden h-full border border-black bg-white">
        {/* 🖼 Image */}
        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-40 sm:h-48 md:h-52 lg:h-56 object-cover"
          />
        )}

        <CardContent className="p-4 flex flex-col flex-1">
          {/* 📰 Title */}
          <h2 className="text-base sm:text-lg font-semibold text-black mb-2 line-clamp-2">
            {article.title}
          </h2>

          {/* 📄 Description */}
          <p className="text-sm text-black flex-1 line-clamp-3">
            {article.description}
          </p>

          {/* 🕒 Meta */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Globe className="w-4 h-4" />
            <span>{article.source?.name}</span>
            <span className="mx-1">•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
