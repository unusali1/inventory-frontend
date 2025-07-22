import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import {
  getProducts,
  getAllCategories,
  updateProductCategory,
} from "../services/api";

const KanbanBoard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categorizedProducts, setCategorizedProducts] = useState({});

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      const categoryList = res?.data || [];

      const withUncategorized = [
        { _id: null, name: "Uncategorized" },
        ...categoryList,
      ];
      setCategories(withUncategorized);
      fetchProducts(withUncategorized);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async (categoryList = []) => {
    try {
      const res = await getProducts("", "", "");
      const productList = res?.data || [];

      const categoryNames = categoryList.map((cat) => cat.name);
      const newCategorized = {};

      categoryNames.forEach((catName) => {
        newCategorized[catName] = [];
      });

      productList.forEach((product) => {
        const categoryName = product.category;
        if (!categoryName || !categoryNames.includes(categoryName)) {
          newCategorized["Uncategorized"].push(product);
        } else {
          newCategorized[categoryName].push(product);
        }
      });

      setProducts(productList);
      setCategorizedProducts(newCategorized);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;
    const sourceList = Array.from(categorizedProducts[source.droppableId]);
    const [movedProduct] = sourceList.splice(result.source.index, 1);
    const destinationList = Array.from(
      categorizedProducts[destination.droppableId]
    );
    destinationList.splice(destination.index, 0, movedProduct);

    const updatedCategorized = {
      ...categorizedProducts,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    };

    setCategorizedProducts(updatedCategorized);

    const newCategoryName =
      destination.droppableId === "Uncategorized"
        ? ""
        : destination.droppableId;

    try {
      await updateProductCategory(draggableId, newCategoryName);
      fetchProducts(categories);
    } catch (err) {
      console.error("Error updating product category:", err);
    }
  };

  const allCategoryNames = [
    "Uncategorized",
    ...categories.filter((c) => c.name !== "Uncategorized").map((c) => c.name),
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
        {allCategoryNames.map((catName) => (
          <Droppable droppableId={catName} key={catName}>
            {(provided) => (
              <div
                className="bg-gray-100 p-4 rounded min-h-[300px]"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="text-xl font-semibold mb-2">{catName}</h2>

                {(categorizedProducts[catName] || []).map((product, index) => (
                  <Draggable
                    draggableId={String(product._id)}
                    index={index}
                    key={String(product._id)}
                  >
                    {(provided) => (
                      <div
                        className="bg-white p-2 rounded shadow mb-2"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                        <p className="text-xs text-gray-400">
                          Barcode: {product.barcode}
                        </p>
                        <p className="text-xs text-gray-400">
                          Price: ৳{product.price}
                        </p>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
                {(categorizedProducts[catName] || []).length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No products in this category
                  </p>
                )}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
