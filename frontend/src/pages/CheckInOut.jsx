import { useEffect, useState } from "react";
import {
  Search,
  LogIn,
  LogOut,
  RefreshCw,
  UserCheck,
  Clock,
} from "lucide-react";
import api from "../services/api";

const CheckInOut = () => {
  const [passNumber, setPassNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

 

  const fetchTodayLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cheaklogs/today");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setLogs(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load today's visitor logs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayLogs();
  }, []);

 

  const handleCheckIn = async (e) => {
    e.preventDefault();

    if (!passNumber.trim()) {
      setError("Please enter a pass number");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response = await api.post(
        "/cheaklogs/cheakin",
        {
          passNumber: passNumber.trim(),
          remarks,
        }
      );

      setMessage(
        response.data?.message ||
          "Visitor checked in successfully"
      );

      setPassNumber("");
      setRemarks("");

      fetchTodayLogs();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to check in visitor"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // CHECK-OUT
  // =========================

  const handleCheckOut = async (id) => {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response = await api.put(
        `/cheaklogs/cheakout/${id}`
      );

      setMessage(
        response.data?.message ||
          "Visitor checked out successfully"
      );

      fetchTodayLogs();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to check out visitor"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredLogs = logs.filter((log) => {
    const searchText = passNumber.toLowerCase();

    const logPassNumber =
      log.pass?.passNumber?.toLowerCase() ||
      log.passNumber?.toLowerCase() ||
      "";

    const visitorName =
      log.visitor?.fullName?.toLowerCase() ||
      log.pass?.visitor?.fullName?.toLowerCase() ||
      "";

    return (
      logPassNumber.includes(searchText) ||
      visitorName.includes(searchText)
    );
  });

  // =========================
  // FORMAT DATE
  // =========================

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Check-In / Check-Out
        </h1>

        <p className="text-gray-500 mt-1">
          Verify visitor passes and manage entry logs
        </p>

      </div>

      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* CHECK-IN CARD */}

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
            <UserCheck size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Visitor Check-In
            </h2>

            <p className="text-sm text-gray-500">
              Enter the visitor pass number
            </p>
          </div>

        </div>

        <form
          onSubmit={handleCheckIn}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >

          {/* PASS NUMBER */}

          <div className="md:col-span-1">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pass Number
            </label>

            <div className="relative">

              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={passNumber}
                onChange={(e) =>
                  setPassNumber(e.target.value)
                }
                placeholder="PASS-XXXXXXXX"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* REMARKS */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>

            <input
              type="text"
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
              placeholder="Optional remarks"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* BUTTON */}

          <div className="flex items-end">

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-3 rounded-lg font-semibold"
            >

              <LogIn size={20} />

              {actionLoading
                ? "Checking..."
                : "Check In"}

            </button>

          </div>

        </form>

      </div>

      {/* TODAY'S LOGS */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* TABLE HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-6 border-b">

          <div>

            <h2 className="text-xl font-bold text-gray-800">
              Today's Visitor Logs
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View all visitor check-in and check-out activity
            </p>

          </div>

          <button
            onClick={fetchTodayLogs}
            className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </div>

        {/* TABLE */}

        {loading ? (

          <div className="p-10 text-center text-gray-500">
            Loading visitor logs...
          </div>

        ) : filteredLogs.length === 0 ? (

          <div className="p-10 text-center text-gray-500">
            No visitor logs found.
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
                    Pass Number
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Check-In
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Check-Out
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredLogs.map((log) => {

                  const visitorName =
                    log.visitor?.fullName ||
                    log.pass?.visitor?.fullName ||
                    "Unknown Visitor";

                  const currentPassNumber =
                    log.pass?.passNumber ||
                    log.passNumber ||
                    "-";

                  const isCheckedOut =
                    Boolean(log.cheakOutTime);

                  return (

                    <tr
                      key={log._id}
                      className="border-t hover:bg-gray-50"
                    >

                      {/* VISITOR */}

                      <td className="px-6 py-4">

                        <div className="font-medium text-gray-800">
                          {visitorName}
                        </div>

                      </td>

                      {/* PASS */}

                      <td className="px-6 py-4">

                        <span className="font-semibold text-gray-700">
                          {currentPassNumber}
                        </span>

                      </td>

                      {/* CHECK-IN */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-gray-600">

                          <LogIn
                            size={17}
                            className="text-green-600"
                          />

                          {formatDateTime(
                            log.cheakInTime ||
                              log.checkInTime
                          )}

                        </div>

                      </td>

                      {/* CHECK-OUT */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-gray-600">

                          <LogOut
                            size={17}
                            className="text-red-600"
                          />

                          {formatDateTime(
                            log.cheakOutTime ||
                              log.checkOutTime
                          )}

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">

                        {isCheckedOut ? (

                          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                            Checked-Out
                          </span>

                        ) : (

                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            Checked-In
                          </span>

                        )}

                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-4">

                        {!isCheckedOut && (

                          <button
                            onClick={() =>
                              handleCheckOut(log._id)
                            }
                            disabled={actionLoading}
                            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-semibold"
                          >

                            <LogOut size={17} />

                            Check Out

                          </button>

                        )}

                        {isCheckedOut && (

                          <span className="text-gray-400 text-sm">
                            Completed
                          </span>

                        )}

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* INFO */}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white rounded-xl p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <LogIn size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Checked In
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {
                  logs.filter(
                    (log) =>
                      !log.cheakOutTime
                  ).length
                }
              </p>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <Clock size={22} />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Total Today
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {logs.length}
              </p>

            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="bg-red-100 text-red-600 p-3 rounded-lg">
              <LogOut size={22} />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Checked Out
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {
                  logs.filter(
                    (log) =>
                      log.cheakOutTime
                  ).length
                }
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CheckInOut;