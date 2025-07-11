import { NextRequest, NextResponse } from "next/server";

const GNEWS_API_KEY = process.env.GNEWS_API_KEY!;
const BASE_URL = process.env.GNEWS_API_URL!;

interface GNewsItem {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const url = new URL(`${BASE_URL}`);
  const apiKey = GNEWS_API_KEY;

  url.searchParams.append("token", apiKey);
  url.searchParams.append("lang", "en");
  url.searchParams.append("max", "20");
  url.searchParams.append("page", page.toString());
  url.searchParams.append("sort_by", "publishedAt");
  url.searchParams.append("q", query || "top");

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    const articles = data.articles.map((item: GNewsItem) => ({
      title: item.title,
      description: item.description,
      url: item.url,
      urlToImage: item.image,
      publishedAt: item.publishedAt,
      source: { name: item.source.name || "GNews" },
    }));

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
