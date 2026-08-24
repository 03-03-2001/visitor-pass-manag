import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  CalendarDays,
} from "lucide-react";
import api from "../services/api";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    visitor: "",
    employee: "",
    visitDate: "",
    purpose: "",
    remarks: "",
  });

  

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setAppointments(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
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
          `/appointments/${editingId}`,
          formData
        );
      } else {
        await api.post("/appointments", formData);
      }

      resetForm();
      fetchAppointments();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save appointment"
      );
    }
  };

 

  const handleEdit = (appointment) => {
    setEditingId(appointment._id);

    setFormData({
      visitor:
        appointment.visitor?._id ||
        appointment.visitor ||
        "",

      employee:
        appointment.employee?._id ||
        appointment.employee ||
        "",

      visitDate: appointment.visitDate
        ? new Date(appointment.visitDate)
            .toISOString()
            .slice(0, 16)
        : "",

      purpose: appointment.purpose || "",

      remarks: appointment.remarks || "",
    });

    setShowForm(true);
  };



  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/appointments/${id}`);

      fetchAppointments();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete appointment"
      );
    }
  };

 

  const handleApprove = async (id) => {
    try {
      await api.put(`/appointments/${id}`, {
        status: "Approved",
      });

      fetchAppointments();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to approve appointment"
      );
    }
  };

 

  const handleReject = async (id) => {
    try {
      await api.put(`/appointments/${id}`, {
        status: "Rejected",
      });

      fetchAppointments();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to reject appointment"
      );
    }
  };

 

  const resetForm = () => {
    setFormData({
      visitor: "",
      employee: "",
      visitDate: "",
      purpose: "",
      remarks: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  

  const filteredAppointments = appointments.filter(
    (appointment) => {
      const visitorName =
        appointment.visitor?.fullName || "";

      const employeeName =
        appointment.employee?.name || "";

      const purpose =
        appointment.purpose || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        visitorName
          .toLowerCase()
          .includes(searchText) ||
        employeeName
          .toLowerCase()
          .includes(searchText) ||
        purpose
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

 

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Appointments
          </h1>

          <p className="text-gray-500 mt-1">
            Manage visitor appointments and approvals
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
          Add Appointment
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
              placeholder="Search visitor, employee or purpose..."
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
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>

        </div>

      </div>

     

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading appointments...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No appointments found.
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
                    Host
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Visit Date
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Purpose
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

                {filteredAppointments.map(
                  (appointment) => (

                    <tr
                      key={appointment._id}
                      className="border-t hover:bg-gray-50"
                    >

                      

                      <td className="px-6 py-4">

                        <div className="font-medium text-gray-800">
                          {appointment.visitor
                            ?.fullName ||
                            "Unknown Visitor"}
                        </div>

                        <div className="text-sm text-gray-400">
                          {appointment.visitor
                            ?.email || ""}
                        </div>

                      </td>

                    

                      <td className="px-6 py-4 text-gray-600">

                        {appointment.employee
                          ?.name ||
                          appointment.employee
                            ?.email ||
                          "Unknown Host"}

                      </td>

                     

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-gray-600">

                          <CalendarDays size={17} />

                          {appointment.visitDate
                            ? new Date(
                                appointment.visitDate
                              ).toLocaleString()
                            : "-"}

                        </div>

                      </td>

                     
                      <td className="px-6 py-4 text-gray-600">
                        {appointment.purpose || "-"}
                      </td>

                     

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            appointment.status
                          )}`}
                        >
                          {appointment.status ||
                            "Pending"}
                        </span>

                      </td>

                    

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2">

                          {appointment.status ===
                            "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleApprove(
                                    appointment._id
                                  )
                                }
                                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                                title="Approve"
                              >
                                <Check size={18} />
                              </button>

                              <button
                                onClick={() =>
                                  handleReject(
                                    appointment._id
                                  )
                                }
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                title="Reject"
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() =>
                              handleEdit(appointment)
                            }
                            className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                appointment._id
                              )
                            }
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

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
                    ? "Edit Appointment"
                    : "Add Appointment"}
                </h2>

                <p className="text-sm text-gray-500">
                  Enter appointment information
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
                name="employee"
                placeholder="Employee / Host ID"
                value={formData.employee}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="datetime-local"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="purpose"
                placeholder="Purpose of Visit"
                value={formData.purpose}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                name="remarks"
                placeholder="Remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
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
                    ? "Update Appointment"
                    : "Create Appointment"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Appointments;