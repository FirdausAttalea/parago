import { redirect } from "next/navigation";

export default function BookPage() {
  redirect("/dashboard/book/new");
}
