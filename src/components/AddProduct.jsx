import React, { useEffect, useRef, useState, Component } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addProduct, getAllCategories } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { toast } from "react-toastify";

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

const AddProduct = ({ setAddProduct }) => {
  const [categories, setCategories] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [quantity, setQuantity] = useState();
  const [description, setDescription] = useState();
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");

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
    fetchCategories();
  }, []);

  const addNewProduct = () => {
    const data = {
      barcode,
      name,
      price,
      brand,
      category: productCategory,
      quantity,
      description,
    };

    addProduct(data)
      .then((res) => {
        toast.success("Product added successfully!");
        setBarcode("");
        setName("");
        setPrice("");
        setBrand("");
        setProductCategory("");
        setQuantity("");
        setDescription("");
        setAddProduct(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add product!");
      });
  };

  return (
    <ErrorBoundary>
      <div className="sm:px-6 md:px-2 sm:py-8 md:py-2 w-full bg-white shadow-sm rounded-md">
        <div className="bg-white sm:p-16 py-4 px-2 rounded-md shadow-md border border-gray-200 w-full">
          <form className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Product barcode (click to scan)"
                value={barcode}
                readOnly
                onClick={() => {
                  if (!scanning) {
                    setScanning(true);
                    setTimeout(startScanner, 0); // Ensure DOM is ready
                  }
                }}
                className="bg-white border-gray-300 shadow-sm w-full cursor-pointer h-12"
              />
            </div>

            <Input
              type="text"
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border-gray-300 shadow-sm w-full h-12"
            />
            <Input
              type="number"
              placeholder="Product price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-white border-gray-300 shadow-sm w-full h-12"
            />
            <Select value={productCategory} onValueChange={setProductCategory}>
              <SelectTrigger className="w-full bg-white border-gray-300 shadow-sm h-12">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item._id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="bg-white border-gray-300 shadow-sm w-full h-12"
            />

            <Input
              type="number"
              placeholder="Qunantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-white border-gray-300 shadow-sm w-full h-12"
            />

            <Input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white border-gray-300 shadow-sm w-full h-12"
            />
          </form>

          <div className="flex justify-center mt-8">
            <Button onClick={() => addNewProduct()}>Add Product</Button>
          </div>

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

export default AddProduct;
