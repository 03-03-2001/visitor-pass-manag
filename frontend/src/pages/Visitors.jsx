
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import api from "../services/api";

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    idProof: "",
  });


  const fetchVisitors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/visitors");

      // Supports both:
      // response.data = []
      // response.data.data = []
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setVisitors(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load visitors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (editingId) {
        await api.put(
          `/visitors/${editingId}`,
          formData
        );
      } else {
        await api.post("/visitors", formData);
      }

      resetForm();
      fetchVisitors();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save visitor"
      );
    }
  };

 
  const handleEdit = (visitor) => {
    setEditingId(visitor._id);

    setFormData({
      fullName: visitor.fullName || "",
      email: visitor.email || "",
      phone: visitor.phone || "",
      address: visitor.address || "",
      company: visitor.company || "",
      idProof: visitor.idProof || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this visitor?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/visitors/${id}`);

      fetchVisitors();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete visitor"
      );
    }
  };

 
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      company: "",
      idProof: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  
  const filteredVisitors = visitors.filter((visitor) => {
    const searchText = search.toLowerCase();

    return (
      visitor.fullName
        ?.toLowerCase()
        .includes(searchText) ||
      visitor.email
        ?.toLowerCase()
        .includes(searchText) ||
      visitor.phone
        ?.toLowerCase()
        .includes(searchText) ||
      visitor.company
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Visitors
          </h1>

          <p className="text-gray-500 mt-1">
            Manage registered visitors
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          <Plus size={20} />
          Add Visitor
        </button>
      </div>

      
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

     
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">

        <div className="relative max-w-md">

          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search visitor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading visitors...
          </div>
        ) : filteredVisitors.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No visitors found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">
                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Visitor
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Email
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Phone
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Company
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredVisitors.map((visitor) => (
                  <tr
                    key={visitor._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">
                        {visitor.fullName}
                      </div>

                      <div className="text-sm text-gray-400">
                        {visitor.idProof || "No ID proof"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {visitor.email}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {visitor.phone}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {visitor.company || "-"}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2">

                        <button
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleEdit(visitor)
                          }
                          className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(visitor._id)
                          }
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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

      
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">

           
            <div className="flex items-center justify-between p-6 border-b">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingId
                    ? "Edit Visitor"
                    : "Add Visitor"}
                </h2>

                <p className="text-sm text-gray-500">
                  Enter visitor information
                </p>
              </div>

              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>

            </div>

           
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              <input
                type="text"
                name="fullName"
                placeholder="Enter Your Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                name="email"
                placeholder=" Enter Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="address"
                placeholder=" Enter Your Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="company"
                placeholder=" Enter Your Company"
                value={formData.company}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="idProof"
                placeholder="ID Proof"
                value={formData.idProof}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  {editingId
                    ? "Update Visitor"
                    : "Add Visitor"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Visitors;

