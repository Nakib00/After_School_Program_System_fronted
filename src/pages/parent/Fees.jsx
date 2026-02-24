import React from "react";
import Badge from "../../components/ui/Badge";
import { DollarSign, Printer } from "lucide-react";

const ParentFees = () => {
  const fees = [
    {
      id: 1,
      month: "February 2024",
      amount: "BDT 2,500",
      due_date: "2024-02-10",
      status: "paid",
      paid_at: "2024-02-08",
    },
    {
      id: 2,
      month: "March 2024",
      amount: "BDT 2,500",
      due_date: "2024-03-10",
      status: "unpaid",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Fee History</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                Month
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                Due Date
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {fees.map((fee) => (
              <tr key={fee.id}>
                <td className="px-6 py-4 font-medium">{fee.month}</td>
                <td className="px-6 py-4">{fee.amount}</td>
                <td className="px-6 py-4">{fee.due_date}</td>
                <td className="px-6 py-4 text-center">
                  <Badge variant={fee.status === "paid" ? "green" : "yellow"}>
                    {fee.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  {fee.status === "paid" ? (
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Printer size={18} />
                    </button>
                  ) : (
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700">
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParentFees;
