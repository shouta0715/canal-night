import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto p-4 text-center">
      <Link className={buttonVariants()} href="/ripples">
        Ripplesへ
      </Link>
    </div>
  );
}
