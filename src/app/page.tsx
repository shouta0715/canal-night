import fs from "fs";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const getFiles = async () => {
  const currentPath = process.cwd();
  const files = fs.readdirSync(`${currentPath}/src/app`);

  const removedFiles = files.filter(
    (file) => !file.includes(".") && file !== "admin"
  );

  return removedFiles;
};

export default async function Home() {
  const files = await getFiles();

  return (
    <div className="container mx-auto p-20">
      <div>
        <p className="text-center text-xl font-bold">
          参加するイベントを選択してください。
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-5">
          {files.map((file) => {
            return (
              <Link key={file} className={buttonVariants()} href={`/${file}`}>
                {file}へ
              </Link>
            );
          })}
        </div>
      </div>

      <p className="mt-20 text-center">管理者画面はこちらから</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-5">
        {files.map((file) => {
          return (
            <Link
              key={file}
              className={buttonVariants({
                variant: "destructive",
              })}
              href={`/admin/${file}`}
            >
              {file}の管理者画面へ
            </Link>
          );
        })}
      </div>
    </div>
  );
}
