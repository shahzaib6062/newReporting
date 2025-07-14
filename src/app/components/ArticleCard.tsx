import { ExternalLink, User, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Article } from "../types/Article";
import { Card, CardContent } from "./ui/card";

export default function ArticleCard({ article }: { article: Article }) {
  if (!article?.url || !article?.title || !article?.source?.name) {
    console.warn(" Skipping article due to missing fields:", article);
    return null;
  }
  
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block transform transition duration-300 ease-in-out hover:scale-[1.03] group relative"
    >
      {/* Animated red border top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out rounded-t" />

      <Card className="overflow-hidden h-[420px] rounded-xl border border-gray-200 bg-white text-black shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg flex flex-col">
        {/* Image or Placeholder (fixed size) */}
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          {article.urlToImage ? (
            <Image
              src={article.urlToImage}
              alt={article.title}
              width={420}
              height={192}
              className="w-full h-48 object-cover object-center"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              unoptimized
            />
          ) : (
            <ImageIcon className="w-12 h-12 text-gray-300" />
          )}
        </div>

        <CardContent className="p-5 flex flex-col h-full">
          {/* Source name at the very top, red-ish color */}
          <div className="mb-1">
            <span className="text-red-600 font-semibold text-sm">{article.source?.name}</span>
          </div>

          {/* Category */}
          {article.category && (
            <div className="mb-2">
              <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-700 text-xs">
                {article.category}
              </span>
            </div>
          )}

          {/* Title row with icon at end */}
          <div className="flex items-center mb-2 gap-2">
            <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
              {article.title}
            </h2>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition shrink-0" />
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {article.description}
          </p>

          {/* Author + Date */}
          <div className="mt-auto pt-2 border-t flex items-center gap-2 text-xs text-gray-500">
            <User className="w-4 h-4" />
            <span>{article.author || "Unknown Author"}</span>
            <span className="mx-1">•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
