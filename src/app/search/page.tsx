"use client"
import { useState, useEffect } from "react";
import { useTodos } from '@/hooks/useTodos';
import { XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import AuthGuard from '@/components/AuthGuard';
const SearchTodo = () => {
  const { fullTodos, fetchTodos } = useTodos();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = searchTerm.trim()
    ? fullTodos.filter((todo) =>
        todo.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <AuthGuard>
      <div className="py-10 px-2 lg:px-20 space-y-10">
        <section>
          <h1 className="text-3xl mb-2">Search Todos</h1>
          <p className="text-primary/70 text-xl">Find specific todos quickly</p>
        </section>
        <section
          className="space-y-8 border border-accent rounded-xl py-10 px-6 lg:w-[80%]"
        >
          <label htmlFor="search-todo" className="flex items-center relative">
              <input
                id="search-todo"
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by title..."
                className="text-lg px-6 autofill-bg-white w-full focus:outline-4 focus:border bg-primary/10 py-3 rounded-xl outline-accent"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3"
                  aria-label="Clear search"
                >
                  <XIcon size={30} />
                </button>
              )}
          </label>
        </section>
        <section>
          {searchTerm.trim() && filteredTodos.length === 0 ? (
            <div className="text-gray-500">No todos found</div>
          ) : null}
          {!searchTerm.trim() ? (
            <div className="text-gray-500">Start Searching</div>
          ) : null}
          <ul>
            {filteredTodos.map(todo => (
              <li
                key={todo.id}
            className="border-accent px-4 rounded-xl space-y-2 hover:bg-accent py-2"
          >
            <Link href={`/todos/${todo.id}`} className="font-semibold text-lg">
              {todo.title}
            </Link>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs ${todo.completed ? 'bg-primary/70 text-white' : 'border p-2 text-primary'}`}
            >
              {todo.completed ? "Completed" : "Pending"}
            </span>
          </li>
        ))}
      </ul>
    </section>
    <section
      className="space-y-8 border border-accent rounded-xl py-10 px-6 lg:w-[80%]"
    >
      <h2 className="text-xl font-semibold">Search Tips</h2>
      <ul className="list-disc pl-6 space-y-1 text-lg text-primary/70">
        <li>Search is case-insensitive</li>
        <li>You can search for partial words</li>
        <li>Search is automatic so you can just type</li>
        <li>Use the clear button (×) to reset your search</li>
      </ul>
    </section>
  </div>
  </AuthGuard>
  );
}

export default SearchTodo