import React, { useEffect, useState } from "react";
import Header from "@/components/Navbar/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res?.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    const data = { name: category };

    if (editingId) {
      updateCategory(editingId, data)
        .then(() => {
          toast.success("Category updated");
          fetchCategories();
          setCategory("");
          setEditingId(null);
        })
        .catch(() => toast.error("Failed to update category"));
    } else {
      createCategory(data)
        .then(() => {
          toast.success("Category created");
          fetchCategories();
          setCategory("");
        })
        .catch(() => toast.error("Failed to create category"));
    }
  };

  const onEdit = (item) => {
    setCategory(item.name);
    setEditingId(item._id);
  };

  const confirmDelete = (id) => {
    deleteCategory(id)
      .then(() => {
        toast.success("Category deleted");
        fetchCategories();
        setDeletingId(null);
      })
      .catch(() => toast.error("Failed to delete category"));
  };

  return (
    <div className="w-full">
      <Header />
      <div className="w-full max-w-6xl mx-auto px-6 py-16 mt-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {editingId ? "Update Category" : "Add New Product Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCategory();
              }}
              className="flex flex-col md:flex-row gap-4 md:items-center"
            >
              <Input
                type="text"
                placeholder="Product category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full md:w-1/2 bg-white border-gray-300 shadow-sm"
              />
              <Button type="submit" className="md:w-auto w-full">
                {editingId ? "Update Category" : "Add New"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Product Category List
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[320px]">SL. NO</TableHead>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </Button>

                      <Popover
                        open={deletingId === item._id}
                        onOpenChange={(open) =>
                          setDeletingId(open ? item._id : null)
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-4">
                          <p className="text-sm mb-4">
                            Are you sure you want to delete{" "}
                            <span className="font-bold">{item.name}</span>?
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              onClick={() => setDeletingId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => confirmDelete(item._id)}
                            >
                              Yes, Delete
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Categories;
