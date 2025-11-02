import Image from "next/image";
import { fetchProducts } from "./data/data";

export default async function Home() {
  const products = await fetchProducts();
  console.log(products);
  return (
    <>
      <h1>Golem, el gigante del deporte</h1>
    </>
  );
}
