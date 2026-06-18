import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Flower, 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Image, 
  Loader2, 
  Check, 
  X, 
  ShieldAlert, 
  LogOut, 
  Eye, 
  EyeOff, 
  ArrowLeft 
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Reveal } from "@/components/ScrollReveal";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sales");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // States for Sales Tab
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // States for Stems Tab
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    category: "wedding",
    color: "",
    season: "",
    unit: "",
    retailPrice: "",
    wholesalePrice: "",
    minWholesale: "",
    image: "",
    description: "",
    inStock: true
  });

  // States for Image Search helper inside Modal
  const [imageQuery, setImageQuery] = useState("");
  const [searchedImages, setSearchedImages] = useState([]);
  const [searchingImages, setSearchingImages] = useState(false);

  // States for CRM Tab
  const [quotes, setQuotes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loadingCRM, setLoadingCRM] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const checkAdminAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        try {
          const userObj = JSON.parse(storedUser);
          if (userObj.role === "admin") {
            setIsAdmin(true);
            // Configure axios default token
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setCheckingAuth(false);
    };
    checkAdminAuth();
  }, []);

  // Fetch data depending on active tab
  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === "sales") fetchOrders();
    if (activeTab === "stems") fetchProducts();
    if (activeTab === "crm") fetchCRMData();
  }, [activeTab, isAdmin]);

  // Auth logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Successfully logged out from admin session.");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  // API Call: Fetch Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await axios.get(`${API}/orders`);
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch orders data.");
    } finally {
      setLoadingOrders(false);
    }
  };

  // API Call: Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API}/orders/${orderId}`, { status: newStatus });
      toast.success("Order status updated successfully.");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status.");
    }
  };

  // API Call: Fetch Products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Could not load stems catalog.");
    } finally {
      setLoadingProducts(false);
    }
  };

  // API Call: Toggle Product Stock Status
  const handleToggleStock = async (product) => {
    try {
      const updatedStock = !product.inStock;
      await axios.put(`${API}/products/${product.id}`, { inStock: updatedStock });
      toast.success(`${product.name} is now ${updatedStock ? "In Stock" : "Out of Stock"}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle stock status.");
    }
  };

  // API Call: Delete Product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this flower from the catalog?")) return;
    try {
      await axios.delete(`${API}/products/${productId}`);
      toast.success("Flower deleted successfully.");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete flower.");
    }
  };

  // Serper API Google Image search helper for Admins
  const handleImageSearch = async (e) => {
    e.preventDefault();
    if (!imageQuery.trim()) return;
    setSearchingImages(true);
    try {
      const response = await axios.get(`${API}/gallery?query=${encodeURIComponent(imageQuery)}`);
      if (response.data && response.data.length > 0) {
        setSearchedImages(response.data);
      } else {
        toast.info("No matching flower photos found.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error searching photos.");
    } finally {
      setSearchingImages(false);
    }
  };

  // Product Form Modal handler
  const openProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        id: prod.id,
        name: prod.name,
        category: prod.category || "wedding",
        color: prod.color || "",
        season: prod.season || "",
        unit: prod.unit || "",
        retailPrice: prod.retailPrice || "",
        wholesalePrice: prod.wholesalePrice || "",
        minWholesale: prod.minWholesale || "",
        image: prod.image || "",
        description: prod.description || "",
        inStock: prod.inStock !== undefined ? prod.inStock : true
      });
      setImageQuery(prod.name);
    } else {
      setEditingProduct(null);
      setProductForm({
        id: "",
        name: "",
        category: "wedding",
        color: "",
        season: "",
        unit: "",
        retailPrice: "",
        wholesalePrice: "",
        minWholesale: "",
        image: "",
        description: "",
        inStock: true
      });
      setImageQuery("");
    }
    setSearchedImages([]);
    setIsProductModalOpen(true);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      retailPrice: Number(productForm.retailPrice),
      wholesalePrice: Number(productForm.wholesalePrice),
      minWholesale: Number(productForm.minWholesale),
    };

    try {
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, payload);
        toast.success("Flower catalog entry updated.");
      } else {
        // Generate slug ID if empty
        const cleanId = productForm.id.trim() || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        await axios.post(`${API}/products`, { ...payload, id: cleanId });
        toast.success("New flower successfully added to the catalog.");
      }
      setIsProductModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error saving flower data.");
    }
  };

  // API Call: Fetch CRM Data
  const fetchCRMData = async () => {
    setLoadingCRM(true);
    try {
      const [quotesRes, contactsRes] = await Promise.all([
        axios.get(`${API}/quotes`),
        axios.get(`${API}/contact`)
      ]);
      setQuotes(quotesRes.data);
      setContacts(contactsRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch CRM data.");
    } finally {
      setLoadingCRM(false);
    }
  };

  // Helper Stats Calculation
  const salesStats = useMemo(() => {
    if (!orders || orders.length === 0) return { total: 0, count: 0, avg: 0 };
    const completedOrders = orders.filter(o => o.status === "completed" || o.status === "pending");
    const total = completedOrders.reduce((acc, curr) => acc + Number(curr.total_price || 0), 0);
    return {
      total,
      count: orders.length,
      avg: orders.length > 0 ? Math.round(total / orders.length) : 0
    };
  }, [orders]);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    return products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.id.toLowerCase().includes(productSearch.toLowerCase()));
  }, [products, productSearch]);

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-[#1A2F24] animate-spin" />
          <span className="text-sm text-[#5C7065]">Verifying Administrator credentials...</span>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#1A2F24] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-8 text-center shadow-2xl">
          <ShieldAlert size={48} className="text-[#8C2131] mx-auto mb-5" />
          <h1 className="font-serif-display text-3xl text-[#1A2F24]">Access Restricted</h1>
          <p className="mt-3 text-sm text-[#5C7065] leading-relaxed">
            This workspace requires administrative privileges. Please log in using the correct portal administrator credentials.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link to="/login" className="w-full bg-[#1A2F24] text-[#FAF8F5] hover:bg-[#2C4A3A] py-3.5 rounded-full text-sm font-semibold transition-colors">
              Sign In to Admin Account
            </Link>
            <Link to="/" className="w-full border border-[#1A2F24] text-[#1A2F24] hover:bg-[#1A2F24]/5 py-3.5 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              <ArrowLeft size={14} /> Back to Storefront
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Admin Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E5E0D8] pb-8 mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">PetalsPort Hub</div>
              <h1 className="font-serif-display text-5xl mt-3">Admin Dashboard</h1>
            </div>
            <button 
              onClick={handleLogout}
              className="md:self-end inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C2131] hover:text-[#B33547] border border-[#8C2131]/30 hover:border-[#8C2131] rounded-full px-5 py-2.5 transition-all"
            >
              <LogOut size={12} /> Sign Out Session
            </button>
          </div>
        </Reveal>

        {/* Tab Selection */}
        <div className="flex border-b border-[#E5E0D8] mb-10 gap-8">
          {[
            { id: "sales", label: "Sales & Orders", icon: LayoutDashboard },
            { id: "stems", label: "Stems Catalog", icon: Flower },
            { id: "crm", label: "CRM Leads", icon: Users }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 pb-4 text-sm font-medium tracking-wide transition-all duration-300 relative ${
                activeTab === t.id ? "text-[#1A2F24]" : "text-[#5C7065] hover:text-[#1A2F24]"
              }`}
            >
              <t.icon size={16} className={activeTab === t.id ? "text-[#8C2131]" : "text-[#5C7065]"} />
              {t.label}
              {activeTab === t.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8C2131]" />
              )}
            </button>
          ))}
        </div>

        {/* Sales Overview Tab */}
        {activeTab === "sales" && (
          <div className="space-y-10 animate-fade-in">
            {/* Sales Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Total Revenue (INR)", value: `₹${salesStats.total.toLocaleString("en-IN")}`, desc: "From completed and pending orders" },
                { title: "Volume (Orders Count)", value: salesStats.count, desc: "Total placed orders inside system" },
                { title: "Avg Order Value", value: `₹${salesStats.avg.toLocaleString("en-IN")}`, desc: "Calculated across total orders list" }
              ].map((s, idx) => (
                <div key={idx} className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-sm">
                  <div className="text-xs uppercase tracking-wider text-[#5C7065]">{s.title}</div>
                  <div className="font-serif-display text-4xl mt-3 text-[#1A2F24]">{s.value}</div>
                  <div className="text-xs text-[#5C7065] mt-2 font-light">{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Orders List */}
            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="font-serif-display text-2xl text-[#1A2F24] mb-6">Recent Order Records</h3>
              {loadingOrders ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#1A2F24]" /></div>
              ) : orders.length === 0 ? (
                <div className="py-20 text-center text-[#5C7065]">No customer orders have been placed yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E0D8] text-xs uppercase tracking-widest text-[#5C7065] pb-4">
                        <th className="py-4 font-semibold">Customer Details</th>
                        <th className="py-4 font-semibold">Purchased Items</th>
                        <th className="py-4 font-semibold">Total Price</th>
                        <th className="py-4 font-semibold">Status Tag</th>
                        <th className="py-4 font-semibold">Order Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D8]/60 text-sm">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-[#FAF8F5]/40 transition-colors">
                          <td className="py-4 pr-4">
                            <div className="font-medium text-[#1A2F24]">{o.customer_name}</div>
                            <div className="text-xs text-[#5C7065] font-light mt-0.5">{o.customer_email}</div>
                          </td>
                          <td className="py-4 pr-4 max-w-xs truncate">
                            {Array.isArray(o.items) ? o.items.map(item => `${item.name} (${item.qty}x)`).join(", ") : "Items parsing failed"}
                          </td>
                          <td className="py-4 pr-4 font-medium text-[#1A2F24]">
                            ₹{Number(o.total_price).toLocaleString("en-IN")}
                          </td>
                          <td className="py-4 pr-4">
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full border outline-none cursor-pointer transition-colors ${
                                o.status === "completed" 
                                  ? "bg-[#1A2F24]/5 text-[#1A2F24] border-[#1A2F24]/20" 
                                  : o.status === "cancelled"
                                  ? "bg-[#8C2131]/5 text-[#8C2131] border-[#8C2131]/20"
                                  : "bg-amber-500/5 text-amber-600 border-amber-500/20"
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 text-[#5C7065] font-light">
                            {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stems Catalog Tab */}
        {activeTab === "stems" && (
          <div className="space-y-6 animate-fade-in">
            {/* Catalog Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 border border-[#E5E0D8] rounded-full px-4 py-2.5 bg-white w-full md:max-w-xs shadow-sm">
                <Search size={16} className="text-[#5C7065]" />
                <input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search active catalog…"
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
              <button
                onClick={() => openProductModal()}
                className="bg-[#1A2F24] hover:bg-[#2C4A3A] text-[#FAF8F5] rounded-full px-6 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-md md:self-end"
              >
                <Plus size={16} /> Add Flower Stem
              </button>
            </div>

            {/* Stems Inventory List */}
            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 md:p-8 shadow-sm">
              {loadingProducts ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#1A2F24]" /></div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-20 text-center text-[#5C7065]">No flowers matching search filter.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E0D8] text-xs uppercase tracking-widest text-[#5C7065] pb-4">
                        <th className="py-4 font-semibold">Stem Photo</th>
                        <th className="py-4 font-semibold">Name & Category</th>
                        <th className="py-4 font-semibold">Retail Price</th>
                        <th className="py-4 font-semibold">Wholesale Info</th>
                        <th className="py-4 font-semibold text-center">Stock status</th>
                        <th className="py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D8]/60 text-sm">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-[#FAF8F5]/40 transition-colors">
                          <td className="py-4 pr-4">
                            <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-lg bg-[#E5E0D8]" />
                          </td>
                          <td className="py-4 pr-4">
                            <div className="font-serif-display text-lg text-[#1A2F24]">{p.name}</div>
                            <div className="text-xs uppercase tracking-wider text-[#5C7065] mt-1">{p.category} · {p.color || "None"}</div>
                          </td>
                          <td className="py-4 pr-4 font-medium text-[#1A2F24]">₹{p.retailPrice} / {p.unit || "stem"}</td>
                          <td className="py-4 pr-4">
                            <div className="font-medium text-[#8C2131]">₹{p.wholesalePrice}</div>
                            <div className="text-xs text-[#5C7065] mt-0.5">Min: {p.minWholesale}</div>
                          </td>
                          <td className="py-4 pr-4 text-center">
                            <button
                              onClick={() => handleToggleStock(p)}
                              className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors ${
                                p.inStock
                                  ? "bg-[#1A2F24]/5 text-[#1A2F24] border-[#1A2F24]/20 hover:bg-[#1A2F24]/10"
                                  : "bg-red-500/5 text-[#8C2131] border-red-500/20 hover:bg-red-500/10"
                              }`}
                              title="Click to toggle availability"
                            >
                              {p.inStock ? "In Stock" : "Out of Stock"}
                            </button>
                          </td>
                          <td className="py-4 text-right">
                            <div className="inline-flex gap-2">
                              <button 
                                onClick={() => openProductModal(p)}
                                className="p-2 border border-[#E5E0D8] hover:border-[#1A2F24] rounded-full text-[#1A2F24] transition-colors"
                                title="Edit product"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 border border-[#E5E0D8] hover:border-[#8C2131] hover:text-[#8C2131] rounded-full text-[#5C7065] transition-colors"
                                title="Delete product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CRM Leads Tab */}
        {activeTab === "crm" && (
          <div className="space-y-10 animate-fade-in">
            {/* Quote briefs list */}
            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="font-serif-display text-2xl text-[#1A2F24] mb-6">Custom Event Quote Briefs</h3>
              {loadingCRM ? (
                <div className="py-14 flex justify-center"><Loader2 className="animate-spin text-[#1A2F24]" /></div>
              ) : quotes.length === 0 ? (
                <div className="py-14 text-center text-[#5C7065]">No custom quote requests received.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E0D8] text-xs uppercase tracking-widest text-[#5C7065] pb-4">
                        <th className="py-4 font-semibold">Contact Info</th>
                        <th className="py-4 font-semibold">Event Specs</th>
                        <th className="py-4 font-semibold">Budget (INR)</th>
                        <th className="py-4 font-semibold">Designer Notes</th>
                        <th className="py-4 font-semibold">Received</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D8]/60 text-sm">
                      {quotes.map(q => (
                        <tr key={q.id} className="hover:bg-[#FAF8F5]/40 transition-colors">
                          <td className="py-4 pr-4">
                            <div className="font-medium text-[#1A2F24]">{q.name}</div>
                            <div className="text-xs text-[#5C7065] font-light mt-0.5">{q.email}</div>
                            <div className="text-xs text-[#5C7065] font-light mt-0.5">{q.phone}</div>
                            {q.company && <div className="text-xs font-semibold text-[#8C2131] mt-1">{q.company}</div>}
                          </td>
                          <td className="py-4 pr-4">
                            <div className="font-medium text-[#1A2F24] uppercase text-xs tracking-wider">{q.event_type}</div>
                            <div className="text-xs text-[#5C7065] mt-1">Date: {q.event_date}</div>
                            <div className="text-xs text-[#5C7065] mt-0.5">Location: {q.location}</div>
                            {q.guest_count && <div className="text-xs text-[#5C7065] mt-0.5">Guests: {q.guest_count}</div>}
                          </td>
                          <td className="py-4 pr-4 font-medium text-[#1A2F24]">
                            {q.budget ? `₹${q.budget}` : "Not Specified"}
                          </td>
                          <td className="py-4 pr-4 max-w-xs text-xs text-[#5C7065] leading-relaxed font-light">
                            {q.notes || "No extra designer notes added."}
                          </td>
                          <td className="py-4 text-xs text-[#5C7065] font-light">
                            {new Date(q.created_at).toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* General inquiries list */}
            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="font-serif-display text-2xl text-[#1A2F24] mb-6">General CRM Contact Inquiries</h3>
              {loadingCRM ? (
                <div className="py-14 flex justify-center"><Loader2 className="animate-spin text-[#1A2F24]" /></div>
              ) : contacts.length === 0 ? (
                <div className="py-14 text-center text-[#5C7065]">No contact form submissions received.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E0D8] text-xs uppercase tracking-widest text-[#5C7065] pb-4">
                        <th className="py-4 font-semibold">Sender Details</th>
                        <th className="py-4 font-semibold">Subject</th>
                        <th className="py-4 font-semibold">Message Content</th>
                        <th className="py-4 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D8]/60 text-sm">
                      {contacts.map(c => (
                        <tr key={c.id} className="hover:bg-[#FAF8F5]/40 transition-colors">
                          <td className="py-4 pr-4">
                            <div className="font-medium text-[#1A2F24]">{c.name}</div>
                            <div className="text-xs text-[#5C7065] font-light mt-0.5">{c.email}</div>
                          </td>
                          <td className="py-4 pr-4 font-medium text-[#1A2F24]">
                            {c.subject || "No Subject"}
                          </td>
                          <td className="py-4 pr-4 max-w-sm text-xs text-[#5C7065] leading-relaxed font-light">
                            {c.message}
                          </td>
                          <td className="py-4 text-xs text-[#5C7065] font-light">
                            {new Date(c.created_at).toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Create/Edit Modal */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2F24]/60 backdrop-blur-sm">
            <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 flex flex-col gap-6 relative">
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full border border-[#E5E0D8] hover:border-[#1A2F24] transition-colors text-[#5C7065] hover:text-[#1A2F24]"
              >
                <X size={16} />
              </button>

              <h2 className="font-serif-display text-3xl text-[#1A2F24]">
                {editingProduct ? `Edit Catalog Details: ${editingProduct.name}` : "Add New Flower to Catalog"}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Form fields (Left side - 7 cols) */}
                <form onSubmit={saveProduct} className="lg:col-span-7 space-y-4">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1">Flower ID / Slug</label>
                      <input
                        type="text"
                        disabled={!!editingProduct}
                        required
                        placeholder="e.g. tulip-red"
                        value={productForm.id}
                        onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
                        className="w-full bg-white border border-[#E5E0D8] rounded-full py-2.5 px-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] disabled:opacity-50 disabled:bg-[#E5E0D8]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1">Flower Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dutch Red Tulips"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full bg-white border border-[#E5E0D8] rounded-full py-2.5 px-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full bg-white border border-[#E5E0D8] rounded-full py-2.5 px-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                      >
                        <option value="wedding">Wedding</option>
                        <option value="birthday">Birthday</option>
                        <option value="corporate">Corporate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1">Colour</label>
                      <input
                        type="text"
                        placeholder="e.g. Saffron"
                        value={productForm.color}
                        onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                        className="w-full bg-white border border-[#E5E0D8] rounded-full py-2.5 px-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1">Season</label>
                      <input
                        type="text"
                        placeholder="e.g. Oct – Feb"
                        value={productForm.season}
                        onChange={(e) => setProductForm({ ...productForm, season: e.target.value })}
                        className="w-full bg-white border border-[#E5E0D8] rounded-full py-2.5 px-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1">Selling Size/Unit</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. bunch of 10 stems"
                        value={productForm.unit}
                        onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                        className="w-full bg-white border border-[#E5E0D8] rounded-full py-2.5 px-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6 pl-4">
                      <input
                        type="checkbox"
                        id="inStockCheck"
                        checked={productForm.inStock}
                        onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                        className="w-4 h-4 text-[#1A2F24] border-[#E5E0D8] rounded focus:ring-[#1A2F24]"
                      />
                      <label htmlFor="inStockCheck" className="text-xs uppercase tracking-wider text-[#1A2F24] font-bold cursor-pointer select-none">Currently In Stock</label>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1">Retail Price (₹)</label>
                      <input
                        type="number"
                        required
                        min={0}
                        placeholder="450"
                        value={productForm.retailPrice}
                        onChange={(e) => setProductForm({ ...productForm, retailPrice: e.target.value })}
                        className="w-full bg-white border border-[#E5E0D8] rounded-full py-2.5 px-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1">Wholesale Price (₹)</label>
                      <input
                        type="number"
                        required
                        min={0}
                        placeholder="300"
                        value={productForm.wholesalePrice}
                        onChange={(e) => setProductForm({ ...productForm, wholesalePrice: e.target.value })}
                        className="w-full bg-white border border-[#E5E0D8] rounded-full py-2.5 px-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1">Min Wholesale Qty</label>
                      <input
                        type="number"
                        required
                        min={1}
                        placeholder="25"
                        value={productForm.minWholesale}
                        onChange={(e) => setProductForm({ ...productForm, minWholesale: e.target.value })}
                        className="w-full bg-white border border-[#E5E0D8] rounded-full py-2.5 px-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1">Image URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full bg-white border border-[#E5E0D8] rounded-full py-2.5 px-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Velvety petals, sturdy stems..."
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full bg-white border border-[#E5E0D8] rounded-2xl py-3 px-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#1A2F24] hover:bg-[#2C4A3A] text-[#FAF8F5] py-3 rounded-full text-sm font-semibold transition-colors"
                    >
                      {editingProduct ? "Save Changes" : "Create Catalog Entry"}
                    </button>
                  </div>

                </form>

                {/* Serper Image Finder (Right side - 5 cols) */}
                <div className="lg:col-span-5 border-l border-[#E5E0D8] pl-0 lg:pl-6 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C2131] font-bold">Photo Assist Tool</span>
                    <h4 className="font-serif-display text-xl text-[#1A2F24] mt-1">Find Unsplash / Google Images</h4>
                    <p className="text-xs text-[#5C7065] mt-1 font-light leading-relaxed">
                      Search keywords to locate stock photos. Click any image to automatically copy its URL into the form.
                    </p>
                  </div>

                  <form onSubmit={handleImageSearch} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. orange marigold"
                      value={imageQuery}
                      onChange={(e) => setImageQuery(e.target.value)}
                      className="w-full bg-white border border-[#E5E0D8] rounded-full py-2 px-4 text-xs outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={searchingImages}
                      className="bg-[#1A2F24] hover:bg-[#2C4A3A] disabled:opacity-50 text-[#FAF8F5] text-xs font-semibold px-4 rounded-full transition-colors shrink-0 flex items-center justify-center gap-1.5"
                    >
                      {searchingImages ? <Loader2 size={12} className="animate-spin" /> : "Search"}
                    </button>
                  </form>

                  {searchingImages ? (
                    <div className="h-44 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-[#1A2F24]" /></div>
                  ) : searchedImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                      {searchedImages.slice(0, 8).map((img, index) => (
                        <div 
                          key={index} 
                          onClick={() => {
                            setProductForm({ ...productForm, image: img.image_url });
                            toast.success("Image URL copied to form.");
                          }}
                          className="aspect-square bg-[#E5E0D8] rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#8C2131] transition-all relative group"
                        >
                          <img src={img.image_url} alt="Searched Flower" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-[#1A2F24]/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[10px] text-white font-medium bg-[#1A2F24] px-2 py-1 rounded">Use Link</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-44 border border-dashed border-[#E5E0D8] rounded-2xl flex flex-col items-center justify-center text-center p-4">
                      <Image size={24} className="text-[#5C7065]/40 mb-2" />
                      <span className="text-xs text-[#5C7065] font-light">No image search results. Try a search query above.</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
