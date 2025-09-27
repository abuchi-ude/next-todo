// src/composables/useTodos.ts
import { useState, useEffect} from "react"
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  enableIndexedDbPersistence,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  // Handle errors (e.g., multiple tabs open)
  console.warn("Firestore offline persistence error:", err);
});

export function useTodos() {
  // Get current user
  // Get current user
  const auth = getAuth();
  const [todos, setTodos] = useState<any[]>([]);
  const [localTodos, setLocalTodos] = useState<any[]>([]);
  const [fullTodos, setFullTodos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pagination state (optional, can be improved for Firestore)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalTodos, setTotalTodos] = useState(0);

  // Fetch todos from both Firebase and JSONPlaceholder
  const [firebaseTodos, setFirebaseTodos] = useState<any[]>([]);
  const [jsonTodos, setJsonTodos] = useState<any[]>([]);

  const fetchTodos = async (page = 1) => {
    setLoadingTodos(true);
    setError(null);
    setSuccessMessage(null);
    try {
      // Fetch only current user's Firebase todos
      const user = auth.currentUser;
      let q;
      let firebaseResult: any[] = [];
      if (user) {
        // Query todos where userId == current user's uid
        q = query(
          collection(db, "todos"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        firebaseResult = querySnapshot.docs
          .map((doc) => {
            const data = doc.data() as any;
            return { id: doc.id, ...data };
          })
          .filter((todo) => todo.userId === user.uid);
      }
      setFirebaseTodos(firebaseResult);

      // Fetch all JSONPlaceholder todos (max 200)
      const API_URL = "https://jsonplaceholder.typicode.com/todos";
      const res = await fetch(`${API_URL}?_limit=200`);
      if (!res.ok)
        throw new Error("Failed to fetch todos from JSONPlaceholder");
      const jsonResult = await res.json();
      setJsonTodos(jsonResult);

      // Combine: Firebase todos on top, then JSONPlaceholder todos
      const combined = [...firebaseResult, ...jsonResult];
      setFullTodos(combined);
      setTotalTodos(combined.length);
      setTotalPages(Math.ceil(combined.length / limit));
      setCurrentPage(page);
      // Paginate combined todos
      const start = (page - 1) * limit;
      const end = start + limit;
      setTodos(combined.slice(start, end));
      setSuccessMessage("Todos loaded successfully!");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingTodos(false);
    }
  };

  // Add a todo to Firestore and local array
  const addTodo = async (title: string) => {
    setAdding(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const newTodo = {
        title,
        completed: false,
        createdAt: Date.now(),
        userId: user.uid,
      };
      // Add to Firestore
      const docRef = await addDoc(collection(db, "todos"), newTodo);
      const todoWithId = { id: docRef.id, ...newTodo };
      setLocalTodos((prev) => [todoWithId, ...prev]);
      setTodos((prev) => [todoWithId, ...prev]);
      setTotalTodos((prev) => prev + 1);
      setTotalPages((prev) => Math.ceil((totalTodos + 1) / limit));
      setSuccessMessage("Todo added successfully!");
      return todoWithId;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setAdding(false);
    }
  };

  // Update a todo in Firestore and local array
  const updateTodo = async (id: string, updates: Partial<any>) => {
    setUpdating(true);
    setError(null);
    setSuccessMessage(null);
    try {
      // Detect if todo is from Firebase or JSONPlaceholder
      // Firebase IDs are strings, JSONPlaceholder IDs are numbers <= 200
      const isJsonPlaceholder = !isNaN(Number(id)) && Number(id) <= 200;
      if (isJsonPlaceholder) {
        // JSONPlaceholder update (fake, not persisted)
        const API_URL = `https://jsonplaceholder.typicode.com/todos/${id}`;
        const res = await fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update JSONPlaceholder todo");
        // Update local state
        setTodos((prev) => {
          const index = prev.findIndex((t) => t.id === Number(id));
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...updates };
            return updated;
          }
          return prev;
        });
        setLocalTodos((prev) => {
          const index = prev.findIndex((t) => t.id === Number(id));
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...updates };
            return updated;
          }
          return prev;
        });
        setSuccessMessage("JSONPlaceholder todo updated (not persisted)!");
        return todos.find((t) => t.id === Number(id));
      } else {
        // Firebase update
        const docRef = doc(db, "todos", id);
        await updateDoc(docRef, updates);
        setTodos((prev) => {
          const index = prev.findIndex((t) => t.id === id);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...updates };
            return updated;
          }
          return prev;
        });
        setLocalTodos((prev) => {
          const index = prev.findIndex((t) => t.id === id);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...updates };
            return updated;
          }
          return prev;
        });
        setSuccessMessage("Todo updated successfully!");
        return todos.find((t) => t.id === id);
      }
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setUpdating(false);
    }
  };

  // Delete a todo from Firestore and local array
  const deleteTodo = async (id: string) => {
    setDeleting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const isJsonPlaceholder = !isNaN(Number(id)) && Number(id) <= 200;
      if (isJsonPlaceholder) {
        // JSONPlaceholder delete (fake, not persisted)
        const API_URL = `https://jsonplaceholder.typicode.com/todos/${id}`;
        const res = await fetch(API_URL, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete JSONPlaceholder todo");
        setTodos((prev) => prev.filter((t) => t.id !== Number(id)));
        setLocalTodos((prev) => prev.filter((t) => t.id !== Number(id)));
        setTotalTodos((prev) => prev - 1);
        setTotalPages((prev) => Math.ceil((totalTodos - 1) / limit));
        setSuccessMessage("JSONPlaceholder todo deleted (not persisted)!");
      } else {
        // Firebase delete
        const docRef = doc(db, "todos", id);
        await deleteDoc(docRef);
        setTodos((prev) => prev.filter((t) => t.id !== id));
        setLocalTodos((prev) => prev.filter((t) => t.id !== id));
        setTotalTodos((prev) => prev - 1);
        setTotalPages((prev) => Math.ceil((totalTodos - 1) / limit));
        setSuccessMessage("Todo deleted successfully!");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  // Combine todos for display (Firestore + local)
  // Keep allTodos for compatibility (search should use fullTodos)
  const allTodos = fullTodos;

  return {
    todos,
    fullTodos,
    error,
    successMessage,
    loadingTodos,
    adding,
    updating,
    deleting,
    currentPage,
    totalPages,
    limit,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    localTodos,
    allTodos,
  };
}
