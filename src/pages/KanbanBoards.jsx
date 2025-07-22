import KanbanBoard from "@/components/KanbanBoard";
import Header from "@/components/Navbar/Header";
import React from "react";
import { useNavigate } from "react-router-dom";

const KanbanBoards = () => {
  const navigate = useNavigate();

  const handleAddCategory = () => {
    navigate("/category");
  };

  return (
    <div className="w-full">
      <Header />
      <div className="mt-16 w-full px-4 py-4">
        <div className="mb-6 flex items-center px-4 py-4 justify-between">
          <h1 className="font-bold tracking-tight text-lg sm:text-4xl">
            Kanban Board
          </h1>
          <button
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            onClick={handleAddCategory}
          >
            Add New Category
          </button>
        </div>
        <KanbanBoard />
      </div>
    </div>
  );
};

export default KanbanBoards;
