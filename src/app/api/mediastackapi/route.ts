import { NextRequest, NextResponse } from "next/server";

const MEDIASTACK_API_KEY = process.env.MEDIASTACK_API_KEY!;
const BASE_URL = process.env.MEDIASTACK_API_URL!;

interface MediastackNewsItem {
  title: string;
  description: string;
  url: string;
  image: string;
  published_at: string;
  source: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const apiKey = MEDIASTACK_API_KEY;
  const limit = 20;
  const offset = (page - 1) * limit;

  const url = new URL(`${BASE_URL}`);
  url.searchParams.append("access_key", apiKey);
  url.searchParams.append("languages", "en");
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("offset", offset.toString());
  if (query) url.searchParams.append("keywords", query);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    const articles = data.data.map((item: MediastackNewsItem) => ({
      title: item.title,
      description: item.description,
      url: item.url,
      urlToImage: item.image,
      publishedAt: item.published_at,
      source: { name: item.source || "Mediastack" },
    }));

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
