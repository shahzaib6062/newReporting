import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GNEWS_API_KEY!;
const BASE_URL = process.env.GNEWS_API_URL!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const topic = searchParams.get("category") || "";
  const from = searchParams.get("fromDate") || "";
  const to = searchParams.get("toDate") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const url = new URL(`${BASE_URL}/search`);
  url.searchParams.append("token", API_KEY);
  url.searchParams.append("lang", "en");
  url.searchParams.append("max", "20");
  url.searchParams.append("page", page.toString());
  url.searchParams.append("sort_by", "publishedAt");
  if (query) url.searchParams.append("q", query);
  if (from) url.searchParams.append("from", from);
  if (to) url.searchParams.append("to", to);
  if (topic) url.searchParams.append("topic", topic.toLowerCase());

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    if (!response.ok) {
      // Log the full error for debugging
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('GNews API error:', data);
      }
      return NextResponse.json({ error: data.error || "Failed to fetch news" }, { status: 500 });
    }
    const articles = (data.articles || []).map((item: Record<string, unknown>) => ({
      title: item['title'] as string,
      description: item['description'] as string,
      url: item['url'] as string,
      urlToImage: item['image'] as string,
      publishedAt: item['publishedAt'] as string,
      author: (item['author'] as string) || "Unknown Author",
      source: { name: (item['source'] && (item['source'] as Record<string, unknown>)['name']) as string || "GNews" },
    }));
    return NextResponse.json(articles);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('GNews API Exception:', e);
    }
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
