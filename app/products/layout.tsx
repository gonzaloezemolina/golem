import { fetchCategories } from "../data/data"
import CatalogLayoutClient from "@/components/catalog-layout-client"

export default async function CatalogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await fetchCategories()
  
  return <CatalogLayoutClient categories={categories}>{children}</CatalogLayoutClient>
}