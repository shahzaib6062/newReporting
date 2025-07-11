import { Article } from "../types/Article";
import { Card, CardContent } from "./ui/card";
import { Globe } from "lucide-react";

export default function ArticleCard({ article }: { article: Article }) {
  if (!article || !article.url || !article.title) return null;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block transform transition duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl group relative"
    >
      {/*Animated top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out rounded-t" />

      <Card className="overflow-hidden h-full border border-gray-200 bg-white text-black rounded-md">
        {/* Full Card Zoom Includes Image */}
        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-40 sm:h-48 md:h-52 lg:h-56 object-cover"
          />
        )}

        <CardContent className="p-4 flex flex-col h-full">
          {/* Title */}
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {article.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 flex-1 line-clamp-3">
            {article.description}
          </p>

          {/* Meta Info */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 ">
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
