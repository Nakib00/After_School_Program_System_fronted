import React, { useState, useEffect } from "react";
import {
  Plus,
  DollarSign,
  Calendar,
  User,
  Building2,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Search,
  Eye,
  Phone,
  MapPin,
  Users,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { feeService } from "../../services/feeService";
import { centerService } from "../../services/centerService";
import { studentService } from "../../services/studentService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const feeSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format must be YYYY-MM"),
  center_id: z.coerce.number().optional().nullable(),
  due_date: z.string().min(1, "Due date is required"),
});

const paymentSchema = z.object({
  payment_method: z.string().min(1, "Payment method is required"),
  transaction_id: z.string().optional(),
  paid_date: z.string().optional(),
});

const FeeModule = ({ role = "super_admin", initialFilters = {} }) => {
  const [fees, setFees] = useState([]);
  const [centers, setCenters] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      month: new Date().toISOString().slice(0, 7),
      due_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        .toISOString()
        .split("T")[0],
    },
  });

  const {
    register: registerPay,
    handleSubmit: handleSubmitPay,
    reset: resetPay,
    formState: { errors: payErrors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: "Cash",
      paid_date: new Date().toISOString().split("T")[0],
    },
  });

  const [report, setReport] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { ...initialFilters };
      const [feesRes, centersRes, studentsRes, reportRes] = await Promise.all([
        feeService.getAll(params),
        role === "super_admin"
          ? centerService.getAll()
          : Promise.resolve({ data: { data: [] } }),
        role !== "parents"
          ? studentService.getAll(params)
          : Promise.resolve({ data: { data: [] } }),
        role !== "parents"
          ? feeService.getReport(params)
          : Promise.resolve({ data: { data: [] } }),
      ]);
      setFees(feesRes.data.data || []);
      if (role === "super_admin") setCenters(centersRes.data.data || []);
      if (role !== "parents") setStudents(studentsRes.data.data || []);
      if (role !== "parents") setReport(reportRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch fee data:", error);
      toast.error("Failed to load fees data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(initialFilters)]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await feeService.generate(data);
      toast.success("Invoice generated successfully");
      setIsModalOpen(false);
      reset();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Generation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async (paymentData) => {
    try {
      setSubmitting(true);
      await feeService.pay(selectedFee.id, paymentData);
      toast.success("Payment recorded successfully");
      setIsPayModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkOverdue = async () => {
    if (
      !window.confirm(
        "Are you sure you want to mark all past-due unpaid fees as overdue?",
      )
    )
      return;
    try {
      setSubmitting(true);
      const { data } = await feeService.markAllOverdue();
      toast.success(
        data.message ||
          `Marked ${data.data?.updated_count || 0} fees as overdue`,
      );
      fetchData();
    } catch (error) {
      toast.error("Failed to update overdue fees");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Invoice",
      accessorKey: "invoice_no",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <FileText size={18} />
          </div>
          <div>
            <div className="font-bold text-gray-900">
              {row.original.invoice_no || `INV-${row.original.id}`}
            </div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {row.original.status}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Student",
      accessorKey: "student.name",
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3 text-indigo-600 border border-indigo-100 flex-shrink-0">
            <User size={14} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 leading-tight">
              {row.original.student?.user?.name || "N/A"}
            </span>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
              ID: {row.original.student?.enrollment_no || "N/A"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ getValue }) => (
        <span className="font-bold text-gray-900">৳{getValue()}</span>
      ),
    },
    {
      header: "Due Date",
      accessorKey: "due_date",
      cell: ({ getValue }) => (
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar size={14} className="mr-1.5" />
          {new Date(getValue()).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const val = getValue()?.toLowerCase();
        const variant =
          val === "paid" ? "green" : val === "overdue" ? "red" : "orange";
        return <Badge variant={variant}>{val || "pending"}</Badge>;
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {role !== "parents" && row.original.status !== "paid" && (
            <button
              onClick={() => {
                setSelectedFee(row.original);
                setIsPayModalOpen(true);
                resetPay({
                  payment_method: "Cash",
                  paid_date: new Date().toISOString().split("T")[0],
                });
              }}
              className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
              Record Payment
            </button>
          )}
          <button
            onClick={() => {
              setSelectedFee(row.original);
              setIsViewModalOpen(true);
            }}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
            <Download size={18} />
          </button>
        </div>
      ),
    },
  ];

  const summaryData = [
    { label: "Total Paid", status: "paid", color: "green", icon: CheckCircle },
    { label: "Unpaid", status: "unpaid", color: "orange", icon: Clock },
    { label: "Overdue", status: "overdue", color: "red", icon: AlertCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {role === "parents" ? "Fee History" : "Fee Management"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {role === "parents"
              ? "View and track your tuition fee records"
              : "Track and manage student invoices and payments"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {role !== "parents" && (
            <button
              onClick={handleMarkOverdue}
              disabled={submitting}
              className="flex items-center justify-center px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all font-semibold"
            >
              <AlertCircle size={18} className="mr-2" /> Mark Overdue
            </button>
          )}
          {role !== "parents" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg font-semibold"
            >
              <Plus size={18} className="mr-2" /> Generate Monthly Fees
            </button>
          )}
        </div>
      </div>

      {role !== "parents" && report.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryData.map((item) => {
            const stats = report.find((r) => r.status === item.status) || {
              count: 0,
              total_amount: 0,
            };
            return (
              <div
                key={item.status}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 bg-${item.color}-50 text-${item.color}-600 rounded-xl`}
                  >
                    <item.icon size={24} />
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider text-${item.color}-600`}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    ৳{Number(stats.total_amount).toLocaleString()}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {stats.count} Records
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <DataTable columns={columns} data={fees} />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Monthly Fees"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Fee Month (YYYY-MM)
            </label>
            <input
              type="month"
              {...register("month")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.month && (
              <p className="text-xs text-red-500">{errors.month.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              {...register("due_date")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
            {errors.due_date && (
              <p className="text-xs text-red-500">{errors.due_date.message}</p>
            )}
          </div>

          {role === "super_admin" && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Center (Optional)
              </label>
              <select
                {...register("center_id")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              >
                <option value="">User's Center</option>
                {centers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-2">
            <p className="text-xs text-indigo-700 leading-relaxed font-medium">
              Generating fees will create an unpaid invoice for every active
              student in the selected center based on their "Monthly Fee"
              setting.
            </p>
          </div>

          <div className="flex justify-end pt-4 font-bold">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-gray-600 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg"
            >
              {submitting ? <Spinner size="sm" /> : "Generate Now"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Record Payment"
        size="sm"
      >
        <form onSubmit={handleSubmitPay(handlePay)} className="space-y-6">
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
              Total Amount Due
            </p>
            <p className="text-3xl font-bold text-green-700">
              ৳{selectedFee?.amount}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Payment Method
              </label>
              <select
                {...registerPay("payment_method")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Mobile Banking">Mobile Banking</option>
              </select>
              {payErrors.payment_method && (
                <p className="text-xs text-red-500">
                  {payErrors.payment_method.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Transaction ID (Optional)
              </label>
              <input
                {...registerPay("transaction_id")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                placeholder="TXN-123456"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Payment Date
              </label>
              <input
                type="date"
                {...registerPay("paid_date")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 font-bold">
            <button
              type="button"
              onClick={() => setIsPayModalOpen(false)}
              className="flex-1 py-2.5 bg-gray-100 rounded-xl text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-xl shadow-lg flex items-center justify-center"
            >
              {submitting ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                "Confirm Payment"
              )}
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Fee Details"
        size="md"
      >
        {selectedFee && (
          <div className="space-y-6 pb-2">
            {/* Premium Header with Profile Image */}
            <div className="relative p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl text-white overflow-hidden shadow-xl mb-4">
              <div className="relative z-10 flex items-center space-x-6">
                <div className="w-24 h-24 rounded-2xl border-2 border-white/20 overflow-hidden bg-white/10 backdrop-blur-sm flex-shrink-0 shadow-inner group transition-all">
                  {selectedFee.student?.user?.profile_photo_path ? (
                    <img
                      src={selectedFee.student.user.profile_photo_path}
                      alt={selectedFee.student.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50">
                      <User size={40} strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 opacity-80 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {selectedFee.center?.name || "Premium LMS Student"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight leading-tight mb-2">
                    {selectedFee.student?.user?.name || "N/A"}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="px-2.5 py-1 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
                      ID: {selectedFee.student?.enrollment_no || "N/A"}
                    </span>
                    <Badge
                      variant={
                        selectedFee.status === "paid"
                          ? "green"
                          : selectedFee.status === "overdue"
                            ? "red"
                            : "orange"
                      }
                      className="bg-white/10 text-white border-white/20 backdrop-blur-md px-3 py-1 font-black text-[10px] uppercase tracking-wider"
                    >
                      {selectedFee.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold opacity-60 uppercase mb-1">
                    {selectedFee.invoice_no || `INV-${selectedFee.id}`}
                  </p>
                  <p className="text-3xl font-black">
                    ৳{Number(selectedFee.amount).toLocaleString()}
                  </p>
                </div>
              </div>
              {/* Decorative background circle */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Parent & Contact Info Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center">
                    <Users size={14} className="mr-2" /> Guardian Info
                  </h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-50 rounded-lg mr-3 text-indigo-600">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                        Parent Name
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedFee.student?.parent?.name || "Not Mentioned"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-50 rounded-lg mr-3 text-indigo-600">
                      <Phone size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                        Contact Phone
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedFee.student?.parent?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-50 rounded-lg mr-3 text-indigo-600">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                        Installation Address
                      </p>
                      <p className="text-xs font-medium text-gray-600 leading-relaxed max-w-[200px]">
                        {selectedFee.student?.user?.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing & Payment Summary Card */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center">
                    <FileText size={14} className="mr-2" /> Invoice Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-gray-400 text-[10px] uppercase">
                        Billing Month
                      </span>
                      <span className="text-gray-900">
                        {new Date(selectedFee.month + "-01").toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" },
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-gray-400 text-[10px] uppercase">
                        Due Date
                      </span>
                      <span className="text-gray-900">
                        {new Date(selectedFee.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200/50 flex justify-between items-end">
                      <span className="text-gray-400 text-[10px] uppercase font-black">
                        Current Outstanding
                      </span>
                      <span className="text-2xl font-black text-indigo-600 leading-none">
                        ৳{Number(selectedFee.amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Specific Footer Note */}
                {selectedFee.status === "paid" ? (
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-900">
                        Payment Realized
                      </p>
                      <p className="text-[10px] text-green-600 font-medium">
                        Via {selectedFee.payment_method} on{" "}
                        {new Date(selectedFee.paid_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-900">
                        Payment Pending
                      </p>
                      <p className="text-[10px] text-amber-600 font-medium">
                        Last notification sent recently
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Transactional Details (Expanded for Paid only) */}
            {selectedFee.status === "paid" && selectedFee.transaction_id && (
              <div className="mt-4 p-4 border border-indigo-100 rounded-2xl bg-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-indigo-600">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Transaction Reference
                    </p>
                    <p className="text-xs font-mono font-bold text-gray-900">
                      {selectedFee.transaction_id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Receipt
                  </p>
                  <button className="text-[10px] font-bold text-indigo-600 underline hover:text-indigo-800">
                    Download PDF
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeeModule;
