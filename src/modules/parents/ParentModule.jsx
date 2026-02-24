import React, { useState, useEffect } from "react";
import {
  Plus,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Search,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import { adminService } from "../../services/adminService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Spinner from "../../components/ui/Spinner";
import { toast } from "react-hot-toast";
import FileUpload from "../../components/ui/FileUpload";

const userSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional()
      .or(z.literal("")),
    password_confirmation: z
      .string()
      .min(6, "Confirm password is required")
      .optional()
      .or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.password_confirmation) {
        return data.password === data.password_confirmation;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["password_confirmation"],
    },
  );

const ParentModule = ({ role = "super_admin", initialFilters = {} }) => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [mode, setMode] = useState("add");
  const [submitting, setSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  const fetchParents = async () => {
    try {
      setLoading(true);
      const params = { ...initialFilters };
      const { data } = await adminService.getParents(params);
      setParents(data.data || data);
    } catch (error) {
      console.error("Failed to fetch parents:", error);
      toast.error("Failed to load parents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [JSON.stringify(initialFilters)]);

  const handleAdd = () => {
    setMode("add");
    setProfileImage(null);
    setSelectedParent(null);
    reset({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone: "",
      address: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (parent) => {
    setMode("edit");
    setSelectedParent(parent);
    setProfileImage(null);
    reset({
      name: parent.name || "",
      email: parent.email || "",
      password: "",
      password_confirmation: "",
      phone: parent.phone || "",
      address: parent.address || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (parent) => {
    setSelectedParent(parent);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setSubmitting(true);
      await adminService.deleteParent(selectedParent.id);
      toast.success("Parent deleted successfully");
      setIsDeleteModalOpen(false);
      fetchParents();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete parent");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.password) {
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);
      }
      formData.append("role", "parent");
      if (data.phone) formData.append("phone", data.phone);
      if (data.address) formData.append("address", data.address);

      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      if (mode === "add") {
        await adminService.registerUser(formData);
        toast.success("Parent registered successfully");
      } else {
        await adminService.updateParent(selectedParent.id, formData);
        toast.success("Parent updated successfully");
      }

      setIsModalOpen(false);
      reset();
      setProfileImage(null);
      fetchParents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Parent Info",
      accessorKey: "name",
      cell: ({ row }) => {
        const parent = row.original;
        return (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 overflow-hidden border border-gray-100">
              {parent.profile_photo_path ? (
                <img
                  src={parent.profile_photo_path}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon size={20} className="text-purple-600" />
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{parent.name}</div>
              <div className="text-xs text-gray-500">{parent.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      header: "Address",
      accessorKey: "address",
      cell: ({ getValue }) => (
        <div className="max-w-xs truncate">{getValue() || "N/A"}</div>
      ),
    },
    {
      header: "Joined",
      accessorKey: "created_at",
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Parent Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage parent accounts and their registrations
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 font-semibold"
        >
          <Plus size={18} className="mr-2" />
          Register Parent
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <DataTable columns={columns} data={parents} />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          mode === "add" ? "Register Parent Account" : "Update Parent Account"
        }
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <UserIcon size={18} />
                </span>
                <input
                  {...register("name")}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Enter name"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Mail size={18} />
                </span>
                <input
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="parent@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder={
                  mode === "add" ? "••••••••" : "Leave blank to keep current"
                }
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("password_confirmation")}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder={
                  mode === "add" ? "••••••••" : "Leave blank to keep current"
                }
              />
              {errors.password_confirmation && (
                <p className="text-xs text-red-500">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Phone
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Phone size={18} />
                </span>
                <input
                  {...register("phone")}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <MapPin size={18} />
                </span>
                <input
                  {...register("address")}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Residential address"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Profile Image
            </label>
            <FileUpload
              onFileSelect={setProfileImage}
              accept=".jpg,.jpeg,.png"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t font-semibold">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-100"
            >
              {submitting ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                mode === "add" && <Plus size={18} className="mr-2 inline" />
              )}
              {mode === "add" ? "Register Parent" : "Update Account"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-2xl flex items-center space-x-3 text-red-600">
            <Trash2 size={24} />
            <p className="font-semibold">This action cannot be undone.</p>
          </div>
          <p className="text-gray-600 text-sm">
            Are you sure you want to delete the parent record for{" "}
            <span className="font-bold text-gray-900">
              {selectedParent?.name}
            </span>
            ? This will also remove their system access.
          </p>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={submitting}
              className="px-8 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 flex items-center disabled:opacity-70"
            >
              {submitting ? (
                <Spinner
                  size="sm"
                  className="mr-2 border-white/30 border-t-white"
                />
              ) : null}
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ParentModule;
