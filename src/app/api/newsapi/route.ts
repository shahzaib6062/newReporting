import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEWSAPI_KEY!;
const BASE_URL = process.env.NEWSAPI_URL!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const url = new URL(`${BASE_URL}/everything`);

  // Append search and pagination
  if (query) url.searchParams.append("q", query);
  url.searchParams.append("pageSize", "20");
  url.searchParams.append("page", page.toString());
  url.searchParams.append("language", "en");
  url.searchParams.append("sortBy", "publishedAt");
  url.searchParams.append("apiKey", API_KEY);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    return NextResponse.json(data.articles || []);
  } catch {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
