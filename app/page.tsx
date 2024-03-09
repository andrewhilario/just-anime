import Header from "@/components/header/Header";
import Navbar from "@/components/navbar/Navbar";

import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      <Header />
    </div>
  );
}
