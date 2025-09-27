
import TodoDetailsClient from "@/components/TodoDetailsClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TodoDetailsClient id={id} />;
}
