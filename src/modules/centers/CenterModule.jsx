import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Building2,
  MapPin,
  Phone,
  User,
  BarChart3,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { centerService } from "../../services/centerService";
import { toast } from "react-hot-toast";

const CenterModule = ({ role = "super_admin" }) => {
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
    if (role !== "super_admin") return;
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
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setSubmitting(true);
    try {
      await centerService.delete(selectedCenter.id);
      toast.success("Center removed successfully");
      setIsDeleteModalOpen(false);
      fetchCenters();
    } catch (error) {
      toast.error("Failed to delete center");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Building2 size={18} />
          </div>
          <span className="font-semibold text-gray-900">
            {row.original.name}
          </span>
        </div>
      ),
    },
    { header: "City", accessorKey: "city" },
    {
      header: "Admin",
      accessorKey: "admin.name",
      cell: ({ getValue }) => getValue() || "N/A",
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
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(row.original)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Eye size={18} />
          </button>
          {role === "super_admin" && (
            <>
              <button
                onClick={() => handleEdit(row.original)}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDeleteClick(row.original)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Centers Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage all branches and administrators
          </p>
        </div>
        {role === "super_admin" && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg font-semibold"
          >
            <Plus size={18} className="mr-2" /> Add Center
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <DataTable columns={columns} data={centers} />
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCenter ? "Edit Branch Info" : "Register New Branch"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Center Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Uttara Branch"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Administrator
            </label>
            <select
              name="admin_id"
              value={formData.admin_id}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              required
            >
              <option value="">Assign Administrator</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                City
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                placeholder="City"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Phone
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                placeholder="Contact number"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              placeholder="Full address"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-gray-700"
            >
              Branch is active
            </label>
          </div>

          <div className="flex justify-end pt-6 border-t font-bold">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-gray-600 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl"
            >
              {submitting ? (
                <Spinner size="sm" />
              ) : editingCenter ? (
                "Save Changes"
              ) : (
                "Create Center"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Branch Details"
        size="md"
      >
        {selectedCenter && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-center space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-50 text-blue-600">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedCenter.name}
                </h3>
                <p className="text-sm text-gray-500">{selectedCenter.city}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start space-x-3 text-sm">
                <User size={16} className="text-gray-400 mt-1" />
                <div>
                  <p className="font-bold text-gray-900">
                    Admin: {selectedCenter.admin?.name || "Not Assigned"}
                  </p>
                  <p className="text-gray-500">{selectedCenter.admin?.email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <Phone size={16} className="text-gray-400 mt-1" />
                <p className="text-gray-900 font-medium">
                  {selectedCenter.phone || "N/A"}
                </p>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <MapPin size={16} className="text-gray-400 mt-1" />
                <p className="text-gray-900 font-medium">
                  {selectedCenter.address || "N/A"}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                <BarChart3 size={16} className="mr-2 text-blue-600" /> Key
                Performance Stats
              </h4>
              {statsLoading ? (
                <div className="text-center py-4">
                  <Spinner size="sm" />
                </div>
              ) : centerStats ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Students
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {centerStats.total_students}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Teachers
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {centerStats.total_teachers}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500 text-xs italic font-medium">
                  No stats available.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4 text-center">
          <Trash2 className="mx-auto text-red-600" size={40} />
          <h3 className="font-bold text-gray-900">Delete Center?</h3>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-bold">"{selectedCenter?.name}"</span>?
          </p>
          <div className="flex gap-3 pt-4 font-bold">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-2.5 bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-xl"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CenterModule;
