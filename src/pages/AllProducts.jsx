import React, { useEffect, useRef, useState, Component } from "react";
import Header from "@/components/Navbar/Header";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllCategories, getProducts } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import AddProduct from "@/components/AddProduct";
import { X, Plus } from "lucide-react";

class ErrorBoundary extends Component {
  state = { hasError: false, errorMessage: "" };
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-6 text-red-500">
          <h2>Something went wrong: {this.state.errorMessage}</h2>
          <Button
            className="mt-4"
            onClick={() => this.setState({ hasError: false, errorMessage: "" })}
          >
            Retry
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [addProduct, setAddProduct] = useState(false);
  const html5QrCodeRef = useRef(null);
  const scanTimeoutRef = useRef(null);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err) {
      console.error("Camera permission error:", err);
      setScanMessage("Please allow camera access to scan barcodes.");
      return false;
    }
  };

  const fetchCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter((device) => device.kind === "videoinput")
        .map((device) => ({
          id: device.deviceId,
          label: device.label || `Camera ${device.deviceId}`,
        }));
      if (videoDevices.length) {
        setAvailableCameras(videoDevices);
        setSelectedCamera(videoDevices[0].id); 
      } else {
        setScanMessage("No cameras found on this device.");
      }
    } catch (err) {
      console.error("Error fetching cameras:", err);
      setScanMessage(`Camera error: ${err.message}`);
    }
  };

  const startScanner = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setScanMessage(
        "Camera access is not supported on this device or browser."
      );
      setScanning(false);
      return;
    }

    setScanMessage("Starting scanner...");
    const hasPermission = await checkCameraPermission();
    if (!hasPermission) {
      setScanning(false);
      return;
    }

    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode("barcode-scanner");
    }

    try {
      if (!selectedCamera && availableCameras.length) {
        setSelectedCamera(availableCameras[0].id);
      }
      if (selectedCamera) {
        scanTimeoutRef.current = setTimeout(() => {
          setScanMessage(
            "No barcode detected. Please ensure the barcode is clear and well-lit."
          );
          stopScanner();
        }, 4000); 

        await html5QrCodeRef.current.start(
          selectedCamera,
          { fps: 15, qrbox: { width: 300, height: 300 } },
          (decodedText) => {
            clearTimeout(scanTimeoutRef.current);
            setBarcode(decodedText);
            setScanMessage("Barcode scanned successfully!");
            stopScanner(); 
          },
          (error) => {
            if (
              error.includes("No barcode or QR code detected") ||
              error.includes("NotFoundException")
            ) {
              setScanMessage(
                "Scanning... Please align the barcode in the frame."
              );
            } else {
              console.warn("QR scan error:", error);
            }
          }
        );
      } else {
        setScanMessage("No camera selected.");
        setScanning(false);
      }
    } catch (err) {
      console.error("Scanner start error:", {
        message: err.message,
        name: err.name,
        stack: err.stack,
      });
      setScanMessage(`Failed to start scanner: ${err.message}`);
      setScanning(false);
    }
  };

  const stopScanner = () => {
    clearTimeout(scanTimeoutRef.current);
    if (
      html5QrCodeRef.current &&
      html5QrCodeRef.current.getState() !== Html5QrcodeScannerState.NOT_STARTED
    ) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          html5QrCodeRef.current.clear();
          html5QrCodeRef.current = null; 
          setScanning(false);
          setScanMessage("");
        })
        .catch((err) => {
          console.error("Scanner stop error:", err);
          setScanning(false);
          setScanMessage("Failed to stop scanner.");
        });
    } else {
      setScanning(false);
      setScanMessage("");
    }
  };

  useEffect(() => {
    fetchCameras();
    return () => {
      if (html5QrCodeRef.current) {
        stopScanner();
      }
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts(category, search, barcode);
      setProducts(res?.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setScanMessage("Failed to fetch products.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res?.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setScanMessage("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, search, barcode]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ErrorBoundary>
      <div className="w-full">
        <Header />
        <div className="px-6 md:px-16 py-8 md:py-20 mt-16 sm:mt-4 w-full bg-white rounded-md">
          <div className="flex sm:flex-col flex-row justify-between md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <h1 className="sm:text-3xl text-lg font-bold text-gray-800">
              {addProduct ? "Add New Products" : "All Products"}
            </h1>
           <div>
             {addProduct ? (
              <Button
                className="w-full md:w-auto bg-red-600"
                onClick={() => setAddProduct(false)}
              >
                <X /> Cancel
              </Button>
            ) : (
              <Button
                className="w-full md:w-auto py-4"
                onClick={() => setAddProduct(true)}
              >
                <Plus /> Add New Product
              </Button>
            )}
           </div>
          </div>

          {!addProduct ? (
            <div>
              <div className="flex sm:flex-row flex-col space-y-2 sm:space-x-4 mb-10">
                <Input
                  type="text"
                  placeholder="Search by product name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white border-gray-300 shadow-sm w-[320px] h-12"
                />

                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder="Search by barcode (click to scan)"
                    value={barcode}
                    readOnly
                    onClick={() => {
                      if (!scanning) {
                        setScanning(true);
                        setTimeout(startScanner, 0); 
                      }
                    }}
                    className="bg-white border-gray-300 shadow-sm cursor-pointer h-12 w-[320px]"
                  />
                </div>

                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[320px] h-12">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item._id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-10">
                {products.length ? (
                  <ProductCard products={products} categories={categories} />
                ) : (
                  <div className="col-span-full text-center text-gray-500 text-lg">
                    No products found.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <AddProduct setAddProduct={setAddProduct} />
          )}

          {scanning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
              <div className="bg-white p-4 rounded-md max-w-sm w-full text-center">
                {availableCameras.length > 1 && (
                  <Select
                    value={selectedCamera}
                    onValueChange={(value) => {
                      setSelectedCamera(value);
                      stopScanner();
                      setTimeout(startScanner, 0);
                    }}
                  >
                    <SelectTrigger className="w-full mb-4">
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCameras.map((camera) => (
                        <SelectItem key={camera.id} value={camera.id}>
                          {camera.label || `Camera ${camera.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <div id="barcode-scanner" className="w-full h-[300px] mb-4" />
                {scanMessage && (
                  <p
                    className={`text-sm ${
                      scanMessage.includes("successfully")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {scanMessage}
                  </p>
                )}
                <Button
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    setScanMessage("Scan canceled.");
                    stopScanner();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AllProducts;
