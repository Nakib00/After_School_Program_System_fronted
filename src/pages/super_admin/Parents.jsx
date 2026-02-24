import React, { useState, useEffect } from "react";
import { Plus, User as UserIcon } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
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
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string().min(6, "Confirm password is required"),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "parents",
    },
  });

  const fetchParents = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getParents();
      setParents(data.data || data); // Handle both wrapped and unwrapped data
    } catch (error) {
      console.error("Failed to fetch parents:", error);
      toast.error("Failed to load parents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);
      formData.append("role", "parent");
      if (data.phone) formData.append("phone", data.phone);
      if (data.address) formData.append("address", data.address);

      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      await adminService.registerUser(formData);
      toast.success("Parent registered successfully");
      setIsModalOpen(false);
      reset();
      setProfileImage(null);
      fetchParents();
    } catch (error) {
      console.error("Registration failed:", error);
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (info) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
            <UserIcon size={14} className="text-purple-600" />
          </div>
          <span className="font-medium text-gray-900">{info.getValue()}</span>
        </div>
      ),
    },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Address", accessorKey: "address" },
    {
      header: "Created",
      accessorKey: "created_at",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parents</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage parent accounts and their connections
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-100"
        >
          <Plus size={18} className="mr-2" />
          Add Parent
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500">Loading parents...</p>
          </div>
        ) : (
          <DataTable columns={columns} data={parents} />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Parent"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...register("name")}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-all border-gray-300"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-all border-gray-300"
                placeholder="parent@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-all border-gray-300"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                {...register("password_confirmation")}
                type="password"
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-all border-gray-300"
                placeholder="••••••••"
              />
              {errors.password_confirmation && (
                <p className="text-xs text-red-500">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                {...register("phone")}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-all border-gray-300"
                placeholder="016xxxxxxx"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                {...register("address")}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-all border-gray-300"
                placeholder="Feni, Bangladesh"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Profile Image (Optional)
            </label>
            <FileUpload
              onFileSelect={setProfileImage}
              accept=".jpg,.jpeg,.png"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center shadow-lg shadow-purple-100 disabled:opacity-70"
            >
              {submitting ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <Plus size={18} className="mr-2" />
              )}
              Register Parent
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Parents;
