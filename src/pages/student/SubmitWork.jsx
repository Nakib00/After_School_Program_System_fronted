import React from "react";
import { Upload, Download, FileText } from "lucide-react";

const SubmitWork = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Submit Your Work</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Assignment
            </label>
            <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
              <option>Math Worksheet B-10</option>
              <option>English Reading A-05</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors w-full justify-center font-medium">
              <Download size={18} className="mr-2" />
              Download Worksheet (PDF)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Upload Completed Work
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 transition-colors cursor-pointer group">
            <div className="p-4 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
              <Upload
                size={32}
                className="text-gray-400 group-hover:text-blue-500"
              />
            </div>
            <p className="mt-4 font-medium">Click or drag & drop to upload</p>
            <p className="text-xs mt-1">Accepts PDF, JPG, PNG (Max 10MB)</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
            Submit Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitWork;
