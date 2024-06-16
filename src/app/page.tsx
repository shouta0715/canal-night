import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto flex flex-wrap items-center justify-center gap-10 p-20 text-center">
      <Link className={buttonVariants()} href="/ripples">
        Ripplesへ
      </Link>
      <Link className={buttonVariants()} href="/ripples-ping-pong">
        Ripples Ping Pongへ
      </Link>
    </div>
  );
}
