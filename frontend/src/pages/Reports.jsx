import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Search,
  RefreshCw,
  Download,
  Users,
  CalendarDays,
  Ticket,
  LogIn,
} from "lucide-react";
import api from "../services/api";

const Reports = () => {
  const [visitors, setVisitors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [passes, setPasses] = useState([]);
  const [checkLogs, setCheckLogs] = useState([]);

  const [reportType, setReportType] = useState("Visitors");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        visitorsResponse,
        appointmentsResponse,
        passesResponse,
        logsResponse,
      ] = await Promise.all([
        api.get("/visitors"),
        api.get("/appointments"),
        api.get("/passes"),
        api.get("/cheaklogs"),
      ]);

      const getData = (response) => {
        if (Array.isArray(response.data)) {
          return response.data;
        }

        return response.data?.data || [];
      };

      setVisitors(getData(visitorsResponse));
      setAppointments(getData(appointmentsResponse));
      setPasses(getData(passesResponse));
      setCheckLogs(getData(logsResponse));
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load report data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);


  const isDateInRange = (item) => {
    const date =
      item.createdAt ||
      item.visitDate ||
      item.issuedAt ||
      item.cheakInTime ||
      item.checkInTime;

    if (!date) {
      return true;
    }

    const itemDate = new Date(date);

    if (Number.isNaN(itemDate.getTime())) {
      return true;
    }

    if (fromDate) {
      const start = new Date(`${fromDate}T00:00:00`);

      if (itemDate < start) {
        return false;
      }
    }

    if (toDate) {
      const end = new Date(`${toDate}T23:59:59`);

      if (itemDate > end) {
        return false;
      }
    }

    return true;
  };

  

  const filteredVisitors = useMemo(() => {
    return visitors.filter((visitor) => {
      const text = search.toLowerCase();

      const name =
        visitor.fullName?.toLowerCase() || "";

      const email =
        visitor.email?.toLowerCase() || "";

      const phone =
        visitor.phone?.toLowerCase() || "";

      return (
        (name.includes(text) ||
          email.includes(text) ||
          phone.includes(text)) &&
        isDateInRange(visitor)
      );
    });
  }, [visitors, search, fromDate, toDate]);

  

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const visitorName =
        appointment.visitor?.fullName?.toLowerCase() ||
        "";

      const purpose =
        appointment.purpose?.toLowerCase() || "";

      const employeeName =
        appointment.employee?.name?.toLowerCase() || "";

      const text = search.toLowerCase();

      const matchesSearch =
        visitorName.includes(text) ||
        purpose.includes(text) ||
        employeeName.includes(text);

      const matchesStatus =
        status === "All" ||
        appointment.status === status;

      return (
        matchesSearch &&
        matchesStatus &&
        isDateInRange(appointment)
      );
    });
  }, [
    appointments,
    search,
    status,
    fromDate,
    toDate,
  ]);

 

  const filteredPasses = useMemo(() => {
    return passes.filter((pass) => {
      const visitorName =
        pass.visitor?.fullName?.toLowerCase() ||
        "";

      const passNumber =
        pass.passNumber?.toLowerCase() || "";

      const text = search.toLowerCase();

      const matchesSearch =
        visitorName.includes(text) ||
        passNumber.includes(text);

      const matchesStatus =
        status === "All" ||
        pass.status === status;

      return (
        matchesSearch &&
        matchesStatus &&
        isDateInRange(pass)
      );
    });
  }, [
    passes,
    search,
    status,
    fromDate,
    toDate,
  ]);

 

  const filteredCheckLogs = useMemo(() => {
    return checkLogs.filter((log) => {
      const visitorName =
        log.visitor?.fullName?.toLowerCase() ||
        log.pass?.visitor?.fullName?.toLowerCase() ||
        "";

      const passNumber =
        log.pass?.passNumber?.toLowerCase() ||
        log.passNumber?.toLowerCase() ||
        "";

      const text = search.toLowerCase();

      const matchesSearch =
        visitorName.includes(text) ||
        passNumber.includes(text);

      return (
        matchesSearch &&
        isDateInRange(log)
      );
    });
  }, [
    checkLogs,
    search,
    fromDate,
    toDate,
  ]);

  

  const exportCSV = () => {
    let data = [];
    let headers = [];

    if (reportType === "Visitors") {
      data = filteredVisitors;

      headers = [
        "Name",
        "Email",
        "Phone",
        "Company",
        "Address",
        "Created At",
      ];
    }

    if (reportType === "Appointments") {
      data = filteredAppointments;

      headers = [
        "Visitor",
        "Purpose",
        "Visit Date",
        "Status",
        "Remarks",
      ];
    }

    if (reportType === "Passes") {
      data = filteredPasses;

      headers = [
        "Pass Number",
        "Visitor",
        "Status",
        "Issued At",
        "Expiry At",
      ];
    }

    if (reportType === "CheckLogs") {
      data = filteredCheckLogs;

      headers = [
        "Visitor",
        "Pass Number",
        "Check In",
        "Check Out",
        "Remarks",
      ];
    }

    const rows = data.map((item) => {
      if (reportType === "Visitors") {
        return [
          item.fullName,
          item.email,
          item.phone,
          item.company,
          item.address,
          item.createdAt,
        ];
      }

      if (reportType === "Appointments") {
        return [
          item.visitor?.fullName || "",
          item.purpose || "",
          item.visitDate || "",
          item.status || "",
          item.remarks || "",
        ];
      }

      if (reportType === "Passes") {
        return [
          item.passNumber || "",
          item.visitor?.fullName || "",
          item.status || "",
          item.issuedAt || "",
          item.expiryAt || "",
        ];
      }

      return [
        item.visitor?.fullName ||
          item.pass?.visitor?.fullName ||
          "",
        item.pass?.passNumber ||
          item.passNumber ||
          "",
        item.cheakInTime ||
          item.checkInTime ||
          "",
        item.cheakOutTime ||
          item.checkOutTime ||
          "",
        item.remarks || "",
      ];
    });

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value ?? "").replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      `${reportType.toLowerCase()}-report.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

 
  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setFromDate("");
    setToDate("");
  };

 

  const currentCount =
    reportType === "Visitors"
      ? filteredVisitors.length
      : reportType === "Appointments"
      ? filteredAppointments.length
      : reportType === "Passes"
      ? filteredPasses.length
      : filteredCheckLogs.length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

     

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>

          <div className="flex items-center gap-3">

            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <BarChart3 size={26} />
            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              Reports
            </h1>

          </div>

          <p className="text-gray-500 mt-2">
            Search, filter and export visitor management reports
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={fetchReports}
            className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-3 rounded-lg"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold"
          >
            <Download size={18} />
            Export CSV
          </button>

        </div>

      </div>

    

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

     

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-3">

            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <Users size={22} />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Visitors
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {visitors.length}
              </p>

            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-3">

            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
              <CalendarDays size={22} />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Appointments
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {appointments.length}
              </p>

            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-3">

            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
              <Ticket size={22} />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Passes
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {passes.length}
              </p>

            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-3">

            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <LogIn size={22} />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Check Logs
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {checkLogs.length}
              </p>

            </div>

          </div>

        </div>

      </div>

     

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

         

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report
            </label>

            <select
              value={reportType}
              onChange={(e) =>
                setReportType(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Visitors">
                Visitors
              </option>

              <option value="Appointments">
                Appointments
              </option>

              <option value="Passes">
                Passes
              </option>

              <option value="CheckLogs">
                Check-In / Check-Out
              </option>

            </select>

          </div>

       

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>

            <div className="relative">

              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

        

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Checked-In">
                Checked-In
              </option>

              <option value="Checked-Out">
                Checked-Out
              </option>

              <option value="Expired">
                Expired
              </option>

            </select>

          </div>

         

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        <div className="mt-4">

          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear Filters
          </button>

        </div>

      </div>

     

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-xl font-bold text-gray-800">
            {reportType === "CheckLogs"
              ? "Check-In / Check-Out Report"
              : `${reportType} Report`}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {currentCount} records found
          </p>

        </div>

        {loading ? (

          <div className="p-10 text-center text-gray-500">
            Loading reports...
          </div>

        ) : reportType === "Visitors" ? (

          <VisitorTable data={filteredVisitors} />

        ) : reportType === "Appointments" ? (

          <AppointmentTable data={filteredAppointments} />

        ) : reportType === "Passes" ? (

          <PassTable data={filteredPasses} />

        ) : (

          <CheckLogTable data={filteredCheckLogs} />

        )}

      </div>

    </div>
  );
};



const VisitorTable = ({ data }) => {
  if (data.length === 0) {
    return <EmptyReport />;
  }

  return (
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm">
              Name
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Email
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Phone
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Company
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Created
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map((visitor) => (

            <tr
              key={visitor._id}
              className="border-t hover:bg-gray-50"
            >

              <td className="px-6 py-4 font-medium">
                {visitor.fullName}
              </td>

              <td className="px-6 py-4">
                {visitor.email || "-"}
              </td>

              <td className="px-6 py-4">
                {visitor.phone || "-"}
              </td>

              <td className="px-6 py-4">
                {visitor.company || "-"}
              </td>

              <td className="px-6 py-4">
                {visitor.createdAt
                  ? new Date(
                      visitor.createdAt
                    ).toLocaleDateString()
                  : "-"}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};



const AppointmentTable = ({ data }) => {
  if (data.length === 0) {
    return <EmptyReport />;
  }

  return (
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm">
              Visitor
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Purpose
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Visit Date
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map((appointment) => (

            <tr
              key={appointment._id}
              className="border-t hover:bg-gray-50"
            >

              <td className="px-6 py-4 font-medium">
                {appointment.visitor?.fullName ||
                  "-"}
              </td>

              <td className="px-6 py-4">
                {appointment.purpose || "-"}
              </td>

              <td className="px-6 py-4">
                {appointment.visitDate
                  ? new Date(
                      appointment.visitDate
                    ).toLocaleString()
                  : "-"}
              </td>

              <td className="px-6 py-4">

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  {appointment.status || "-"}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};


const PassTable = ({ data }) => {
  if (data.length === 0) {
    return <EmptyReport />;
  }

  return (
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm">
              Pass Number
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Visitor
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Status
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Issued
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Expiry
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map((pass) => (

            <tr
              key={pass._id}
              className="border-t hover:bg-gray-50"
            >

              <td className="px-6 py-4 font-semibold">
                {pass.passNumber}
              </td>

              <td className="px-6 py-4">
                {pass.visitor?.fullName || "-"}
              </td>

              <td className="px-6 py-4">

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  {pass.status}
                </span>

              </td>

              <td className="px-6 py-4">
                {pass.issuedAt
                  ? new Date(
                      pass.issuedAt
                    ).toLocaleString()
                  : "-"}
              </td>

              <td className="px-6 py-4">
                {pass.expiryAt
                  ? new Date(
                      pass.expiryAt
                    ).toLocaleString()
                  : "-"}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};



const CheckLogTable = ({ data }) => {
  if (data.length === 0) {
    return <EmptyReport />;
  }

  return (
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="px-6 py-4 text-left text-sm">
              Visitor
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Pass Number
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Check-In
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Check-Out
            </th>

            <th className="px-6 py-4 text-left text-sm">
              Remarks
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map((log) => (

            <tr
              key={log._id}
              className="border-t hover:bg-gray-50"
            >

              <td className="px-6 py-4 font-medium">
                {log.visitor?.fullName ||
                  log.pass?.visitor?.fullName ||
                  "-"}
              </td>

              <td className="px-6 py-4">
                {log.pass?.passNumber ||
                  log.passNumber ||
                  "-"}
              </td>

              <td className="px-6 py-4">
                {log.cheakInTime
                  ? new Date(
                      log.cheakInTime
                    ).toLocaleString()
                  : log.checkInTime
                  ? new Date(
                      log.checkInTime
                    ).toLocaleString()
                  : "-"}
              </td>

              <td className="px-6 py-4">
                {log.cheakOutTime
                  ? new Date(
                      log.cheakOutTime
                    ).toLocaleString()
                  : log.checkOutTime
                  ? new Date(
                      log.checkOutTime
                    ).toLocaleString()
                  : "-"}
              </td>

              <td className="px-6 py-4">
                {log.remarks || "-"}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};



const EmptyReport = () => {
  return (
    <div className="p-10 text-center text-gray-500">
      No records found for the selected filters.
    </div>
  );
};

export default Reports;