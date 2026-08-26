import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Bell,
  Mail,
  MessageSquare,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import api from "../services/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    type: "Email",
    recipient: "",
    subject: "",
    message: "",
  });

 

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setNotifications(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
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
      setMessage("");

      await api.post("/notifications", formData);

      setMessage("Notification sent successfully.");

      resetForm();

      fetchNotifications();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to send notification"
      );
    }
  };

 

  const handleResend = async (notification) => {
    try {
      setError("");
      setMessage("");

      await api.post(
        `/notifications/${notification._id}/resend`
      );

      setMessage("Notification resent successfully.");

      fetchNotifications();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to resend notification"
      );
    }
  };



  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/notifications/${id}`);

      setMessage("Notification deleted.");

      fetchNotifications();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete notification"
      );
    }
  };

 

  const resetForm = () => {
    setFormData({
      type: "Email",
      recipient: "",
      subject: "",
      message: "",
    });

    setShowForm(false);
  };



  const filteredNotifications =
    notifications.filter((notification) => {
      const searchText = search.toLowerCase();

      const recipient =
        notification.recipient
          ?.toLowerCase() || "";

      const subject =
        notification.subject
          ?.toLowerCase() || "";

      const notificationMessage =
        notification.message
          ?.toLowerCase() || "";

      const matchesSearch =
        recipient.includes(searchText) ||
        subject.includes(searchText) ||
        notificationMessage.includes(searchText);

      const matchesType =
        typeFilter === "All" ||
        notification.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        notification.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });

 

  const getStatusClass = (status) => {
    switch (status) {
      case "Sent":
        return "bg-green-100 text-green-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

     

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>

          <div className="flex items-center gap-3">

            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <Bell size={25} />
            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              Notifications
            </h1>

          </div>

          <p className="text-gray-500 mt-2">
            Manage email and SMS visitor notifications
          </p>

        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          <Plus size={20} />
          Send Notification
        </button>

      </div>

     

      {message && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

    

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

     

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-3">

            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <Bell size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {notifications.length}
              </p>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-3">

            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <Mail size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Sent
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {
                  notifications.filter(
                    (item) =>
                      item.status === "Sent"
                  ).length
                }
              </p>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-3">

            <div className="bg-red-100 text-red-600 p-3 rounded-lg">
              <MessageSquare size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Failed
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {
                  notifications.filter(
                    (item) =>
                      item.status === "Failed"
                  ).length
                }
              </p>
            </div>

          </div>

        </div>

      </div>

    

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">

        <div className="flex flex-col md:flex-row gap-4">

       

          <div className="relative flex-1">

            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search recipient or message..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

       

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Types</option>
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
          </select>

        

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Sent">Sent</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

        </div>

      </div>

     

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="flex items-center justify-between p-6 border-b">

          <div>

            <h2 className="text-xl font-bold text-gray-800">
              Notification History
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Track all email and SMS notifications
            </p>

          </div>

          <button
            onClick={fetchNotifications}
            className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </div>

        {loading ? (

          <div className="p-10 text-center text-gray-500">
            Loading notifications...
          </div>

        ) : filteredNotifications.length === 0 ? (

          <div className="p-10 text-center text-gray-500">
            No notifications found.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Type
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Recipient
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Subject
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Message
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Date
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredNotifications.map(
                  (notification) => (

                    <tr
                      key={notification._id}
                      className="border-t hover:bg-gray-50"
                    >

                      {/* TYPE */}

                      <td className="px-6 py-4">

                        {notification.type === "SMS" ? (

                          <div className="flex items-center gap-2 text-purple-600">

                            <MessageSquare size={18} />

                            <span className="font-medium">
                              SMS
                            </span>

                          </div>

                        ) : (

                          <div className="flex items-center gap-2 text-blue-600">

                            <Mail size={18} />

                            <span className="font-medium">
                              Email
                            </span>

                          </div>

                        )}

                      </td>

                    

                      <td className="px-6 py-4 text-gray-700">
                        {notification.recipient || "-"}
                      </td>

                    

                      <td className="px-6 py-4 text-gray-700">
                        {notification.subject || "-"}
                      </td>

                    

                      <td className="px-6 py-4">

                        <div className="max-w-xs truncate text-gray-600">
                          {notification.message || "-"}
                        </div>

                      </td>

                     

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            notification.status
                          )}`}
                        >
                          {notification.status ||
                            "Pending"}
                        </span>

                      </td>

                     

                      <td className="px-6 py-4 text-gray-600">

                        {notification.createdAt
                          ? new Date(
                              notification.createdAt
                            ).toLocaleString()
                          : "-"}

                      </td>

                    

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2">

                          {notification.status ===
                            "Failed" && (

                            <button
                              onClick={() =>
                                handleResend(
                                  notification
                                )
                              }
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                              title="Resend"
                            >
                              <RefreshCw
                                size={18}
                              />
                            </button>

                          )}

                          <button
                            onClick={() =>
                              handleDelete(
                                notification._id
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
                  Send Notification
                </h2>

                <p className="text-sm text-gray-500">
                  Send an email or SMS notification
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

          

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Email">
                    Email
                  </option>

                  <option value="SMS">
                    SMS
                  </option>
                </select>

              </div>

           

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient
                </label>

                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  placeholder={
                    formData.type === "Email"
                      ? "visitor@example.com"
                      : "+91XXXXXXXXXX"
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

             

              {formData.type === "Email" && (

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Visitor Pass Notification"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              )}

             
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter notification message..."
                  rows="5"
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
                  Send Notification
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Notifications;