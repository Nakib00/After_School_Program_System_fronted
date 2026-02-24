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
  student_id: z.coerce.number().min(1, "Student is required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  due_date: z.string().min(1, "Due date is required"),
  description: z.string().optional(),
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
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { ...initialFilters };
      const [feesRes, centersRes, studentsRes] = await Promise.all([
        feeService.getAll(params),
        role === "super_admin"
          ? centerService.getAll()
          : Promise.resolve({ data: { data: [] } }),
        studentService.getAll(params),
      ]);
      setFees(feesRes.data.data || []);
      if (role === "super_admin") setCenters(centersRes.data.data || []);
      setStudents(studentsRes.data.data || []);
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
          {row.original.status !== "paid" && (
            <button
              onClick={() => {
                setSelectedFee(row.original);
                setIsPayModalOpen(true);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fee Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage student invoices and payments
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg font-semibold"
        >
          <Plus size={18} className="mr-2" /> Generate Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <DataTable columns={columns} data={fees} />
        )}
      </div>

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate New Invoice"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Student
            </label>
            <select
              {...register("student_id")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.center?.name})
                </option>
              ))}
            </select>
            {errors.student_id && (
              <p className="text-xs text-red-500">
                {errors.student_id.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <DollarSign size={18} />
                </span>
                <input
                  type="number"
                  {...register("amount")}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-red-500">{errors.amount.message}</p>
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
                <p className="text-xs text-red-500">
                  {errors.due_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Description / Memo
            </label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none min-h-[80px]"
              placeholder="Monthly tuition fee for March..."
            />
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
              {submitting ? <Spinner size="sm" /> : "Generate Invoice"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Record Payment"
        size="sm"
      >
        <div className="space-y-6">
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
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>Credit Card</option>
                <option>Mobile Banking</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Transaction ID (Optional)
              </label>
              <input
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                placeholder="TXN-123456"
              />
            </div>
          </div>

          <div className="flex gap-3 font-bold">
            <button
              onClick={() => setIsPayModalOpen(false)}
              className="flex-1 py-2.5 bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={() => handlePay({ payment_method: "Cash" })}
              disabled={submitting}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-xl shadow-lg"
            >
              {submitting ? <Spinner size="sm" /> : "Confirm Payment"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FeeModule;
