"use client"
import React, { useState } from 'react'
import { useEffect } from "react";
import { useTodos } from '@/hooks/useTodos';
import Loading from './loading';
import { PenIcon, TrashIcon } from "@phosphor-icons/react";
import Checkbox from '@/components/Checkbox';
import Pagination from '@/components/Pagination';
import AuthGuard from '../../components/AuthGuard'
import Link from "next/link"

const Todos = () => {
    const {
  todos,
  error,
  successMessage,
  loadingTodos,
  updating,
  deleting,
  currentPage,
  totalPages,
  fetchTodos,
  updateTodo,
  deleteTodo,
} = useTodos();

const [activeFilter, setActiveFilter] = useState<"all" | "completed" | "pending">("all");
const filteredTodos = () => {
  if (activeFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  } else if (activeFilter === "pending") {
    return todos.filter((todo) => !todo.completed);
  }
  return todos;
};
function capitalizeFirst(val: unknown) {
  const s = String(val ?? "");
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}


useEffect(() => {
  fetchTodos();
}, []);

const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
const [editTitle, setEditTitle] = useState("");

function startEdit(todo: any) {
  setEditingTodoId(todo.id);
  setEditTitle(todo.title);
}

function cancelEdit() {
  setEditingTodoId(null);
  setEditTitle("");
}

async function saveEdit(id: number) {
  if (!editTitle.trim()) {
    cancelEdit();
    return;
  }
  try {
    await updateTodo(String(id), { title: editTitle });
    cancelEdit();
  } catch (e) {
    console.error(e);
  }
}

// Auto-clear error message after 2 seconds
// Auto-clear error message after 2 seconds
// const [localError, setLocalError] = useState<string | null>(null);
// useEffect(() => {
//   if (error) {
//     setLocalError(error);
//     const timer = setTimeout(() => {
//       setLocalError(null);
//     }, 2000);
//     return () => clearTimeout(timer);
//   }
// }, [error]);

// Auto-clear success message after 2 seconds
const [localSuccess, setLocalSuccess] = useState<string | null>(null);
useEffect(() => {
  if (successMessage) {
    setLocalSuccess(successMessage);
    const timer = setTimeout(() => {
      setLocalSuccess(null);
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [successMessage]);
    if (loadingTodos) {
        return <Loading />;
    }
    // ...existing code...
    return (
        <AuthGuard>
      <div>
        <div className="px-2 flex flex-col gap-8 lg:px-20 py-10">
          <section className="flex justify-between">
            <div>
              <h1 className="text-3xl mb-2">Your Todos</h1>
              <p className="text-primary/70 text-xl">Manage and track your tasks</p>
            </div>
            <div>
              {/* Error and success messages */}
              {/* {localError && <div className="error">{localError}</div>} */}
              {localSuccess && <div className="success hidden lg:block">{localSuccess}</div>}
            </div>
          </section>
          <section>
            <button
              className={`p-2 text-xl rounded-lg hover:bg-accent border-accent border mr-2 ${activeFilter === 'all' ? 'bg-primary text-white hover:bg-primary' : 'bg-white text-primary'}`}
              onClick={() => setActiveFilter('all')}
            >
              ALL
            </button>
            <button
              className={`p-2 text-xl rounded-lg hover:bg-accent border-accent border mr-2 ${activeFilter === 'completed' ? 'bg-primary text-white hover:bg-primary' : 'bg-white text-primary'}`}
              onClick={() => setActiveFilter('completed')}
            >
              Completed
            </button>
            <button
              className={`p-2 text-xl rounded-lg hover:bg-accent border-accent border mr-2 ${activeFilter === 'pending' ? 'bg-primary text-white hover:bg-primary' : 'bg-white text-primary'}`}
              onClick={() => setActiveFilter('pending')}
            >
              Pending
            </button>
          </section>
          <section>
            <ul>
              {filteredTodos().map((todo: any) => (
                <li
                  key={todo.id}
                  className="p-6 border rounded-lg hover:scale-105 transition-all duration-200 border-accent mb-2"
                >
                  <div>
                    {/* If editing, show input */}
                    {editingTodoId === todo.id ? (
                      <>
                        <input
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="border rounded p-2 mr-2"
                          placeholder="Edit todo title"
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEdit(todo.id);
                          }}
                        />
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                          disabled={updating}
                          onClick={() => saveEdit(todo.id)}
                        >
                          {updating ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <div className="flex lg:justify-between flex-col lg:flex-row lg:items-center lg:text-xl">
                        <div className="flex gap-2 items-center mb-2 lg:mb-0">
                          <div onClick={() => updateTodo(todo.id, { completed: !todo.completed })}>
                            <Checkbox
                              msg1=""
                              msg2=""
                              msg3=""
                              msg4=""
                              checked={todo.completed}
                              onChange={checked => updateTodo(todo.id, { completed: checked })}
                            />
                          </div>
                          <Link
                            href={`/todos/${todo.id}`}
                            className={`lg:text-2xl font-medium${todo.completed ? ' done' : ''}`}
                          >
                            {capitalizeFirst(todo.title)}
                          </Link>
                        </div>
                        <div className="flex mt-2 justify-between items-center">
                          <button
                            className={`text-primary font-medium px-4 py-1 rounded-lg mr-2 ${todo.completed ? 'bg-accent' : 'border border-accent'}`}
                            disabled={updating}
                          >
                            {todo.completed ? "Completed" : "Pending"}
                          </button>
                          <button
                            className="text-primary border border-accent px-4 py-1 rounded-lg mr-2 hover:bg-accent"
                            onClick={() => startEdit(todo)}
                          >
                            <PenIcon size={30} />
                          </button>
                          <button
                            className="px-4 py-1 rounded-lg border border-accent text-red-800 hover:bg-accent"
                            disabled={deleting}
                            onClick={() => deleteTodo(todo.id)}
                          >
                            <TrashIcon size={30} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={fetchTodos}
            />
          </section>
        </div>
      </div>
      </AuthGuard>
    );
}

export default Todos