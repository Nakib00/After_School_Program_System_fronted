import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  BadgeDollarSign,
  CheckCircle2,
  AlertCircle,
  User,
  Clock,
  TrendingUp,
  Receipt,
  GraduationCap,
} from "lucide-react";
import { feeService } from "../../services/feeService";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { toast } from "react-hot-toast";

const ParentFees = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        const res = await feeService.getChildrenFees();
        const data = res.data.data;
        setReports(data);
        if (data.length > 0) {
          setSelectedReport(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch children fees:", error);
        toast.error("Failed to load fee information");
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  const getStatusConfig = (status, dueDate) => {
    const isOverdue = status === "unpaid" && new Date(dueDate) < new Date();

    if (status === "paid") {
      return {
        icon: CheckCircle2,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-100",
        badge: "green",
        label: "Paid",
      };
    }

    if (isOverdue) {
      return {
        icon: AlertCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-100",
        badge: "red",
        label: "Overdue",
      };
    }

    return {
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      badge: "yellow",
      label: "Unpaid",
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Fee Management
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            Track tuition fees, payment history, and upcoming dues for your
            children.
          </p>
        </div>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-10">
          {/* Child Selection Bar */}
          <div className="flex flex-wrap gap-4 p-2 bg-gray-50/50 rounded-[2rem] border border-gray-100">
            {reports.map((report) => (
              <button
                key={report.student_info.id}
                onClick={() => setSelectedReport(report)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-3xl transition-all duration-300 ${
                  selectedReport?.student_info.id === report.student_info.id
                    ? "bg-white shadow-xl shadow-indigo-100 border-indigo-100 border text-indigo-700 scale-[1.02]"
                    : "bg-transparent text-gray-500 hover:bg-white/60 border border-transparent"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedReport?.student_info.id === report.student_info.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <User size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">
                    Child
                  </p>
                  <p className="text-sm font-bold truncate max-w-[120px]">
                    {report.student_info.name}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Fee Info for Selected Child */}
          {selectedReport && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-5">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Receipt size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">
                      {selectedReport.fees.length}
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Total Invoices
                    </p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-5">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">
                      {
                        selectedReport.fees.filter((f) => f.status === "paid")
                          .length
                      }
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Paid Invoices
                    </p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-5">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                    <AlertCircle size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">
                      {
                        selectedReport.fees.filter((f) => f.status === "unpaid")
                          .length
                      }
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Pending Dues
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {selectedReport.fees.length > 0 ? (
                  [...selectedReport.fees]
                    .sort((a, b) => b.month.localeCompare(a.month))
                    .map((fee) => {
                      const config = getStatusConfig(fee.status, fee.due_date);
                      return (
                        <div
                          key={fee.id}
                          className="bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/40 transition-all overflow-hidden group"
                        >
                          <div className="p-8">
                            <div className="flex flex-col lg:flex-row items-center gap-8">
                              <div
                                className={`w-20 h-20 rounded-[2rem] ${config.bg} ${config.color} flex items-center justify-center shadow-inner`}
                              >
                                <BadgeDollarSign size={40} />
                              </div>

                              <div className="flex-1 text-center lg:text-left">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 mb-2">
                                  <h4 className="text-2xl font-black text-gray-900">
                                    {new Date(
                                      fee.month + "-01",
                                    ).toLocaleDateString(undefined, {
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </h4>
                                  <div className="flex justify-center">
                                    <Badge
                                      variant={config.badge}
                                      className="font-bold"
                                    >
                                      {config.label}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm font-bold text-gray-400">
                                  <div className="flex items-center">
                                    <Calendar size={14} className="mr-1.5" />
                                    Due:{" "}
                                    {new Date(
                                      fee.due_date,
                                    ).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock size={14} className="mr-1.5" />
                                    Invoice Date:{" "}
                                    {new Date(
                                      fee.created_at,
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>

                              <div className="text-center lg:text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                  Payable Amount
                                </p>
                                <p className="text-4xl font-black text-gray-900">
                                  {formatCurrency(fee.amount)}
                                </p>
                                {fee.paid_date && (
                                  <p className="text-xs font-bold text-green-600 mt-2 flex items-center justify-center lg:justify-end">
                                    <CheckCircle2 size={12} className="mr-1" />
                                    Paid on{" "}
                                    {new Date(
                                      fee.paid_date,
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>

                              <div className="lg:pl-8 lg:border-l border-gray-100">
                                <button
                                  disabled={fee.status === "paid"}
                                  className={`px-8 py-4 rounded-2xl font-black text-sm shadow-lg transition-all ${
                                    fee.status === "paid"
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-95"
                                  }`}
                                >
                                  {fee.status === "paid"
                                    ? "Receipt Details"
                                    : "Pay Now"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-24 bg-gray-50 rounded-[4rem] border border-dashed border-gray-200">
                    <CreditCard
                      size={64}
                      className="mx-auto text-gray-200 mb-4"
                    />
                    <h5 className="text-xl font-black text-gray-400 tracking-tight">
                      No fee records found for this child
                    </h5>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-24 rounded-[4rem] border border-dashed border-gray-200 text-center shadow-inner">
          <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center mx-auto mb-8 border border-gray-100">
            <GraduationCap size={48} className="text-gray-300" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
            No billing history found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto font-medium text-lg leading-relaxed">
            We couldn't find any financial records for your children at this
            time.
          </p>
        </div>
      )}
    </div>
  );
};

export default ParentFees;
