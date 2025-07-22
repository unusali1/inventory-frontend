import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteProduct, updateProduct } from "@/services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductCard = ({ products: initialProducts, categories }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditClick = (product) => {
    setSelectedProduct({ ...product });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const data = {
        barcode: selectedProduct.barcode,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: selectedProduct.quantity,
        description: selectedProduct.description,
        brand: selectedProduct.brand,
        category: selectedProduct.category,
      };
      const id = selectedProduct._id;
      const response = await updateProduct(id, data);
      setProducts((prev) =>
        prev.map((p) => (p._id === selectedProduct._id ? selectedProduct : p))
      );
      setEditDialogOpen(false);
      toast.success("Product updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProduct?._id);
      setProducts((prev) => prev.filter((p) => p._id !== selectedProduct._id));
      setDeleteDialogOpen(false);
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.");
    }
  };

  return (
    <Card className="w-full">
      <ToastContainer />
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">SL. NO</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product, index) => (
              <TableRow key={product._id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell className="text-right">{product.price}</TableCell>
                <TableCell className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(product)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid grid-cols-1 gap-4 mt-4">
              <Input
                type="text"
                value={selectedProduct.barcode}
                readOnly
                className="bg-gray-100"
              />
              <Input
                type="text"
                placeholder="Product name"
                value={selectedProduct.name}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Price"
                value={selectedProduct.price}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    price: e.target.value,
                  })
                }
              />
              <Select
                value={selectedProduct.category}
                onValueChange={(value) =>
                  setSelectedProduct({ ...selectedProduct, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Brand"
                value={selectedProduct.brand}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    brand: e.target.value,
                  })
                }
              />
              <Input
                type="text"
                placeholder="Quantity"
                value={selectedProduct.quantity}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    quantity: e.target.value,
                  })
                }
              />
              <Input
                type="text"
                placeholder="Description"
                value={selectedProduct.description}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedProduct?.name}</strong>?
          </p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductCard;
