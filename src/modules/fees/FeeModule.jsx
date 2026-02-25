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
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-gray-500">
            <User size={14} />
          </div>
          <span className="font-medium text-gray-700">
            {row.original.student?.name}
          </span>
        </div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ getValue }) => (
        <span className="font-bold text-gray-900">${getValue()}</span>
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
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
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
        {role !== "parents" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg font-semibold"
          >
            <Plus size={18} className="mr-2" /> Generate Monthly Fees
          </button>
        )}
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
                    ${Number(stats.total_amount).toLocaleString()}
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
              ${selectedFee?.amount}
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
    </div>
  );
};

export default FeeModule;
