import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  QrCode,
  X,
} from "lucide-react";
import api from "../services/api";

const Passes = () => {
  const [passes, setPasses] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    visitor: "",
    appointment: "",
    expiryAt: "",
  });

  

  const fetchPasses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/passes");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setPasses(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load passes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
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
          `/passes/${editingId}`,
          formData
        );
      } else {
        await api.post("/passes", formData);
      }

      resetForm();
      fetchPasses();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save pass"
      );
    }
  };

 

  const handleEdit = (pass) => {
    setEditingId(pass._id);

    setFormData({
      visitor:
        pass.visitor?._id ||
        pass.visitor ||
        "",

      appointment:
        pass.appointment?._id ||
        pass.appointment ||
        "",

      expiryAt: pass.expiryAt
        ? new Date(pass.expiryAt)
            .toISOString()
            .slice(0, 16)
        : "",
    });

    setShowForm(true);
  };

  

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pass?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/passes/${id}`);

      fetchPasses();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete pass"
      );
    }
  };

 

  const handleDownloadPdf = async (pass) => {
    try {
      const response = await api.get(
        `/passes/${pass._id}/pdf`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${pass.passNumber || "visitor-pass"}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);

      setError("Unable to download PDF");
    }
  };

 

  const resetForm = () => {
    setFormData({
      visitor: "",
      appointment: "",
      expiryAt: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  

  const filteredPasses = passes.filter((pass) => {
    const searchText = search.toLowerCase();

    const passNumber =
      pass.passNumber?.toLowerCase() || "";

    const visitorName =
      pass.visitor?.fullName?.toLowerCase() || "";

    const visitorEmail =
      pass.visitor?.email?.toLowerCase() || "";

    const matchesSearch =
      passNumber.includes(searchText) ||
      visitorName.includes(searchText) ||
      visitorEmail.includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      pass.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

 

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Checked-In":
        return "bg-blue-100 text-blue-700";

      case "Checked-Out":
        return "bg-gray-100 text-gray-700";

      case "Expired":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

     

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Visitor Passes
          </h1>

          <p className="text-gray-500 mt-1">
            Manage visitor passes and QR codes
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
          Generate Pass
        </button>

      </div>

      

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

     

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">

            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search pass number or visitor..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Checked-In">
              Checked-In
            </option>
            <option value="Checked-Out">
              Checked-Out
            </option>
            <option value="Expired">Expired</option>
          </select>

        </div>

      </div>

     

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading passes...
          </div>
        ) : filteredPasses.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No passes found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Pass Number
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Visitor
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Issued
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Expiry
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredPasses.map((pass) => (

                  <tr
                    key={pass._id}
                    className="border-t hover:bg-gray-50"
                  >

                   

                    <td className="px-6 py-4">

                      <div className="font-semibold text-gray-800">
                        {pass.passNumber || "-"}
                      </div>

                    </td>

                    

                    <td className="px-6 py-4">

                      <div className="font-medium text-gray-800">
                        {pass.visitor?.fullName ||
                          "Unknown Visitor"}
                      </div>

                      <div className="text-sm text-gray-400">
                        {pass.visitor?.email || ""}
                      </div>

                    </td>

                  

                    <td className="px-6 py-4 text-gray-600">

                      {pass.issuedAt
                        ? new Date(
                            pass.issuedAt
                          ).toLocaleDateString()
                        : "-"}

                    </td>

                   
                    <td className="px-6 py-4 text-gray-600">

                      {pass.expiryAt
                        ? new Date(
                            pass.expiryAt
                          ).toLocaleDateString()
                        : "-"}

                    </td>

                  

                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                          pass.status
                        )}`}
                      >
                        {pass.status || "Active"}
                      </span>

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
                          className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100"
                          title="QR Code"
                        >
                          <QrCode size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDownloadPdf(pass)
                          }
                          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                          title="Download PDF"
                        >
                          <Download size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleEdit(pass)
                          }
                          className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(pass._id)
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
                    ? "Edit Pass"
                    : "Generate Visitor Pass"}
                </h2>

                <p className="text-sm text-gray-500">
                  Enter pass information
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
                name="visitor"
                placeholder="Visitor ID"
                value={formData.visitor}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="appointment"
                placeholder="Appointment ID"
                value={formData.appointment}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>

                <input
                  type="datetime-local"
                  name="expiryAt"
                  value={formData.expiryAt}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              

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
                    ? "Update Pass"
                    : "Generate Pass"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Passes;