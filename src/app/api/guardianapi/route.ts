import { NextRequest, NextResponse } from "next/server";

const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY!;
const BASE_URL = process.env.GUARDIAN_API_URL!;

interface GuardianNewsItem {
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: {
    trailText?: string;
    thumbnail?: string;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const url = new URL(`${BASE_URL}`);
  url.searchParams.append("api-key", GUARDIAN_API_KEY);
  url.searchParams.append("show-fields", "thumbnail,trailText");
  url.searchParams.append("page-size", "20");
  url.searchParams.append("page", page.toString());
  if (query) url.searchParams.append("q", query);

  try {
    const res = await fetch(url.toString());
    const data = await res.json();

    const articles = data.response.results.map((item: GuardianNewsItem) => ({
      title: item.webTitle,
      description: item.fields?.trailText || "",
      url: item.webUrl,
      urlToImage: item.fields?.thumbnail || "",
      publishedAt: item.webPublicationDate,
      author: "Unknown Author",
      source: { name: "The Guardian" },
    }));

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
