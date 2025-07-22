import Header from "@/components/Navbar/Header";
import { getAllCategories, getProducts } from "@/services/api";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await getProducts("", "", "");
      const sortedProducts = res?.data
        ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setProducts(sortedProducts || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res?.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const getProductCountByCategory = (categoryName) => {
    return products.filter((product) => product.category === categoryName)
      .length;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-12">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-left sm:text-center">
          Inventory Management Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
            <h2 className="text-base sm:text-lg font-semibold">Total Products</h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">{products.length}</p>
          </div>

          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200"
            >
              <h2 className="text-base sm:text-lg font-semibold truncate">{category.name}</h2>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
                {getProductCountByCategory(category.name)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Recently Added Products
          </h2>
          <Card className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs sm:text-sm md:text-base font-semibold text-gray-700 px-2 sm:px-4 py-2 sm:py-3 text-center">
                        Created At
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm md:text-base font-semibold text-gray-700 px-2 sm:px-4 py-2 sm:py-3">
                        Name
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm md:text-base font-semibold text-gray-700 px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">
                        Category
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm md:text-base font-semibold text-gray-700 px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                        Brand
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm md:text-base font-semibold text-gray-700 px-2 sm:px-4 py-2 sm:py-3 text-right">
                        Price
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.map((product, index) => (
                      <TableRow
                        key={product._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <TableCell className="text-xs sm:text-sm text-gray-600 px-2 sm:px-4 py-2 sm:py-3 text-center">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm font-medium text-gray-800 px-2 sm:px-4 py-2 sm:py-3">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-gray-600 px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">
                          {product.category}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-gray-600 px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                          {product.brand}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-gray-600 px-2 sm:px-4 py-2 sm:py-3 text-right">
                          ${product.price.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;