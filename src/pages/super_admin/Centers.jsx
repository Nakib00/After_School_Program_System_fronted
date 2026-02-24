import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  User,
  Phone,
  MapPin,
  Building2,
  BarChart3,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import StatCard from "../../components/ui/StatCard";
import Spinner from "../../components/ui/Spinner";
import { centerService } from "../../services/centerService";
import { toast } from "react-hot-toast";

const Centers = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [centerStats, setCenterStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    admin_id: "",
    is_active: true,
  });

  const fetchAdmins = async () => {
    try {
      setAdminsLoading(true);
      const { data } = await centerService.getAdmins();
      setAdmins(data.data ?? []);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    } finally {
      setAdminsLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const { data } = await centerService.getAll();
      setCenters(data.data ?? []);
    } catch (error) {
      console.error("Failed to fetch centers:", error);
      toast.error("Failed to load centers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
    fetchAdmins();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      phone: "",
      admin_id: "",
      is_active: true,
    });
    setEditingCenter(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (center) => {
    setEditingCenter(center);
    setFormData({
      name: center.name,
      address: center.address || "",
      city: center.city || "",
      phone: center.phone || "",
      admin_id: center.admin_id || "",
      is_active: !!center.is_active,
    });
    setIsModalOpen(true);
  };

  const handleView = async (center) => {
    setSelectedCenter(center);
    setIsViewModalOpen(true);
    setStatsLoading(true);
    try {
      const { data } = await centerService.getStats(center.id);
      setCenterStats(data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast.error("Failed to load center statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleDeleteClick = (center) => {
    setSelectedCenter(center);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCenter) {
        await centerService.update(editingCenter.id, formData);
        toast.success("Center updated successfully");
      } else {
        await centerService.create(formData);
        toast.success("Center created successfully");
      }
      setIsModalOpen(false);
      fetchCenters();
    } catch (error) {
      console.error("Submit failed:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setSubmitting(true);
    try {
      await centerService.delete(selectedCenter.id);
      toast.success("Center deleted successfully");
      setIsDeleteModalOpen(false);
      fetchCenters();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete center");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "City", accessorKey: "city" },
    { header: "Phone", accessorKey: "phone" },
    {
      header: "Admin",
      accessorKey: "admin",
      cell: ({ getValue }) => getValue()?.name || "No Admin",
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? "green" : "red"}>
          {getValue() ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const center = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleView(center)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => handleEdit(center)}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title="Edit"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDeleteClick(center)}
              className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      },
    },
  ];

  if (loading && centers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Centers Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage all your branches and their administrators.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          <Plus size={18} className="mr-2" />
          Add Center
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={centers} />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCenter ? "Edit Center" : "Add New Center"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Center Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="e.g. Uttara Branch"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Assign Administrator
            </label>
            <select
              name="admin_id"
              value={formData.admin_id}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white cursor-pointer"
              required
            >
              <option value="">Select an Administrator</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name} ({admin.email})
                </option>
              ))}
            </select>
            {adminsLoading && (
              <p className="text-xs text-blue-500">Loading administrators...</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="e.g. Dhaka"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="e.g. 017..."
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
              placeholder="Full address of the center"
            />
          </div>
          <div className="flex items-center space-x-2 py-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-gray-700"
            >
              Set as Active
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner
                    size="sm"
                    className="mr-2 border-white/30 border-t-white"
                  />
                  Saving...
                </>
              ) : editingCenter ? (
                "Save Changes"
              ) : (
                "Create Center"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Center Details"
      >
        {selectedCenter && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                <Building2 className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">
                    Center Name
                  </p>
                  <p className="font-bold text-gray-900">
                    {selectedCenter.name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase">
                      City
                    </p>
                    <p className="font-semibold text-gray-900">
                      {selectedCenter.city || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase">
                      Phone
                    </p>
                    <p className="font-semibold text-gray-900">
                      {selectedCenter.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">
                    Admin
                  </p>
                  <p className="font-semibold text-gray-900">
                    {selectedCenter.admin?.name || "No Admin Assigned"}
                  </p>
                  {selectedCenter.admin?.email && (
                    <p className="text-xs text-gray-500">
                      {selectedCenter.admin.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-900 flex items-center">
                  <BarChart3 size={16} className="mr-2 text-blue-600" />
                  Statistics
                </h4>
              </div>

              {statsLoading ? (
                <div className="flex justify-center py-4">
                  <Spinner size="md" />
                </div>
              ) : centerStats ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-[10px] font-bold text-blue-400 uppercase">
                      Students
                    </p>
                    <p className="text-lg font-bold text-blue-700">
                      {centerStats.total_students}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-[10px] font-bold text-green-400 uppercase">
                      Teachers
                    </p>
                    <p className="text-lg font-bold text-green-700">
                      {centerStats.total_teachers}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg col-span-2">
                    <p className="text-[10px] font-bold text-purple-400 uppercase text-center">
                      Total Revenue
                    </p>
                    <p className="text-lg font-bold text-purple-700 text-center">
                      ${centerStats.total_revenue}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">
                  No statistics available
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-xl text-red-700 text-sm">
            <p className="font-bold mb-1">Warning!</p>
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedCenter?.name}</strong>? This action cannot be
              undone and may affect associated data.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner
                    size="sm"
                    className="mr-2 border-white/30 border-t-white"
                  />
                  Deleting...
                </>
              ) : (
                "Delete Center"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Centers;
