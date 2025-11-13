import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ password: string }>;
}) {
  const pass = (await params).password;
  if (pass !== process.env["OVERCLICKED_PASSWORD"]) {
    redirect("/");
  }

  return children;
}
