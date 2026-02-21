"use client"
import { useState } from "react";
import { ArrowLeftIcon, PlusIcon } from "@phosphor-icons/react";
import { useTodos } from '@/hooks/useTodos';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';

const AddTodo = () => {
    const { addTodo, adding, error, successMessage } = useTodos();
const [title, setTitle] = useState("");
const router = useRouter();

const handleAddTodo = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!title.trim()) return;
  try {
    await addTodo(title);
    setTitle("");
    router.push("/todos");
  } catch (err) {
    console.error(err);
  }
};
  return (
    <AuthGuard>
      <div className="px-2 lg:px-20 py-10 space-y-10">
      {/* Back Button */}
      <section
        className="px-4 sm:px-6 lg:px-8 border w-fit rounded-xl hover:bg-accent border-accent"
      >
        <Link href="/todos" className="flex py-3 items-center">
          <ArrowLeftIcon className="mr-2" size="16" />
          <p>Back to your todos</p>
        </Link>
      </section>

      {/* Page Header */}
      <section>
        <h1 className="text-3xl mb-2">Add New Todo</h1>
        <p className="text-primary/70 text-xl">
          Create a new task to help you stay organized and productive
        </p>
      </section>

      {/* Add Todo Form  */}
      <section>
        <form
          onSubmit={handleAddTodo}
          className="space-y-8 border border-accent rounded-xl py-10 px-6 lg:w-[80%]"
        >
          <div className="flex flex-col gap-4">
            <label htmlFor="todo" className="mb-1 text-xl font-medium">Todo Title</label>
            <input
              id="todo"
              type="text"
              placeholder="Enter your todo title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="text-lg px-6 autofill-bg-white focus:outline-4 focus:border bg-primary/10 py-3 rounded-xl outline-accent"
              required
              onKeyDown={e => {
              if (e.key === 'Enter') handleAddTodo(e);
            }}
          />
        </div>

        <div className="flex justify-between space-x-4  lg:text-lg font-medium">
          <button
            type="submit"
            className="flex items-center bg-primary/70 justify-center text-white w-5/10 lg:w-3/5 px-4 py-2 rounded-lg hover:bg-primary/50 disabled:opacity-50"
            disabled={adding}
          >
            <PlusIcon size={16} className="mr-2" color="#ffffff" />
            <span>{adding ? "Adding..." : "Add Todo"}</span>
          </button>

          <Link
            href="/todos"
            className="px-4 py-2 w-5/10 lg:w-3/10 text-center rounded-lg border border-accent hover:bg-accent"
          >
            View All Todos
          </Link>
        </div>
      </form>

      {/* Success & Error Messages */}
      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}
      {error && (
        <p className="text-red-600 mt-2">{error}</p>
      )}
    </section>

    {/* Tips Section */}
    <section
      className="space-y-8 border border-accent rounded-xl py-10 px-6 lg:w-[80%]"
    >
      <h2 className="text-xl font-semibold">Tips for Better Todo Management</h2>
      <ul className="list-disc pl-6 space-y-1 text-lg text-primary/70">
        <li>Keep titles clear and specific</li>
        <li>Break large tasks into smaller, actionable items</li>
        <li>Use the search feature to quickly find specific todos</li>
        <li>Review and update your todos regularly</li>
      </ul>
    </section>
  </div>
  </AuthGuard>
  )
}

export default AddTodo