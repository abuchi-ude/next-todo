"use client";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import AuthGuard from "@/components/AuthGuard";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

function capitalizeFirst(val: unknown) {
  const s = String(val ?? "");
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

function isFirebaseId(id: string) {
  return isNaN(Number(id)) && id.length >= 20;
}

export default function TodoDetailsClient({ id }: { id: string }) {
  const [todo, setTodo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodo() {
      try {
        if (isFirebaseId(id)) {
          const docRef = doc(db, "todos", id);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) throw new Error("Todo not found in Firebase");
          setTodo({ id: docSnap.id, ...docSnap.data() });
        } else {
          const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
          if (!res.ok) throw new Error("Failed to fetch todo details");
          setTodo(await res.json());
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTodo();
  }, [id]);

  return (
    <AuthGuard>
      <div className="px-2 lg:px-20 py-10 space-y-10">
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}

        <section className="px-4 sm:px-6 lg:px-8 border w-fit rounded-xl hover:bg-accent border-accent">
          <a href="/todos" className="flex py-3 items-center">
            <ArrowLeftIcon className="mr-2" size={16} />
            <p>Back to your todos</p>
          </a>
        </section>

        <section>
          <h1 className="text-3xl mb-2">Todos Details</h1>
          <p className="text-primary/70 text-xl">View and manage your todo</p>
        </section>

        {todo && (
          <section className="border border-accent px-4 rounded-xl space-y-4 py-10">
            <h1 className="text-2xl font-bold">
              Title: {capitalizeFirst(todo.title)}
            </h1>
            <p className="text-lg">
              Status:
              <span className={todo.completed ? "text-green-600" : "text-red-600"}>
                {todo.completed ? "Completed" : "Pending"}
              </span>
            </p>
            <p className="text-lg">
              <strong>ID:</strong> {todo.id}
            </p>
          </section>
        )}
      </div>
    </AuthGuard>
  );
}
