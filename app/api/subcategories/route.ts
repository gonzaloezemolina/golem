import { NextRequest, NextResponse } from "next/server"
import { fetchSubcategories } from "@/app/data/data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get("category_id")

    const subcategories = categoryId 
      ? await fetchSubcategories(parseInt(categoryId))
      : await fetchSubcategories()

    return NextResponse.json(subcategories)
  } catch (error) {
    console.error("Error en API subcategories:", error)
    return NextResponse.json([], { status: 500 })
  }
}