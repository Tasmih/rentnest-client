'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  ShieldAlert,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { categoryService, Category } from '@/services/category.service';
import { useAuth } from '@/hooks/useAuth';
import { showToast } from '@/components/ui/toastConfig';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  // Add / Edit Form state
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  // Fetch all categories GET /api/categories
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    enabled: user?.role === 'ADMIN',
  });

  // Create Category Mutation
  const createMutation = useMutation({
    mutationFn: (payload: { name: string; description?: string }) =>
      categoryService.createCategory(payload),
    onSuccess: () => {
      showToast.success('Category created successfully');
      setIsAddModalOpen(false);
      setCategoryName('');
      setCategoryDescription('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create category';
      showToast.error(msg);
    },
  });

  // Update Category Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name: string; description?: string } }) =>
      categoryService.updateCategory(id, payload),
    onSuccess: () => {
      showToast.success('Category updated successfully');
      setEditingCategory(null);
      setCategoryName('');
      setCategoryDescription('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update category';
      showToast.error(msg);
    },
  });

  // Delete Category Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      showToast.success('Category deleted successfully');
      setDeleteCategoryId(null);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete category';
      showToast.error(msg);
      setDeleteCategoryId(null);
    },
  });

  const handleOpenAddModal = () => {
    setCategoryName('');
    setCategoryDescription('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryDescription(cat.description || '');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      showToast.error('Category name is required');
      return;
    }
    createMutation.mutate({
      name: categoryName.trim(),
      description: categoryDescription.trim() || undefined,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!categoryName.trim()) {
      showToast.error('Category name is required');
      return;
    }
    updateMutation.mutate({
      id: editingCategory.id,
      payload: {
        name: categoryName.trim(),
        description: categoryDescription.trim() || undefined,
      },
    });
  };

  // Authorization Check
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white p-8 border border-rose-100 max-w-md w-full text-center space-y-3 shadow-sm">
          <ShieldAlert className="h-12 w-12 text-[#E91E63] mx-auto" />
          <h2 className="text-lg font-extrabold text-[#1F2937]">Admin Permission Required</h2>
          <p className="text-xs text-gray-500">
            You must be logged in as an Administrator to access category management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-[#E91E63] mb-1">
            <FolderTree className="h-3.5 w-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Property Categories Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Create, update, and manage property taxomony categories across RentNest.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
            <span>Refresh</span>
          </button>

          <PrimaryButton
            onClick={handleOpenAddModal}
            size="md"
            className="rounded-xl font-semibold text-xs inline-flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Category</span>
          </PrimaryButton>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4 shadow-sm animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-full bg-gray-100 rounded-xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-2xl bg-white border border-rose-100 p-8 text-center max-w-md mx-auto space-y-3 shadow-sm">
          <AlertCircle className="h-10 w-10 text-[#E91E63] mx-auto" />
          <h3 className="text-base font-bold text-[#1F2937]">Failed to load categories</h3>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#E91E63] rounded-xl hover:bg-[#D81B60]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && categories.length === 0 && (
        <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-rose-100 text-[#E91E63] flex items-center justify-center mx-auto">
            <FolderTree className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">No categories found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Click the button below to add your first property category.
            </p>
          </div>
          <PrimaryButton onClick={handleOpenAddModal} size="md" className="rounded-xl font-semibold">
            Add First Category
          </PrimaryButton>
        </div>
      )}

      {/* Category Table */}
      {!isLoading && !isError && categories.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#1F2937]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-rose-50/20 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4 font-extrabold text-[#1F2937]">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-teal-50 text-[#0EA5A4] flex items-center justify-center font-bold text-xs shrink-0">
                          {cat.name[0]}
                        </div>
                        <span>{cat.name}</span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 text-gray-600 text-xs max-w-md truncate">
                      {cat.description || 'No description provided.'}
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                      {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                          title="Edit Category"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteCategoryId(cat.id)}
                          className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-[#E91E63] hover:bg-rose-100 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-gray-100">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="border-b border-gray-100 pb-3 pr-8">
              <h3 className="text-base font-extrabold text-[#1F2937]">Add New Category</h3>
              <p className="text-xs text-gray-500">Create a new property listing category.</p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Category Name *</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Modern Apartment"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Description</label>
                <textarea
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  rows={3}
                  placeholder="Brief description of this category..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <PrimaryButton
                  type="submit"
                  isLoading={createMutation.isPending}
                  fullWidth
                  size="md"
                  className="rounded-xl font-semibold"
                >
                  Create Category
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-gray-100">
            <button
              onClick={() => setEditingCategory(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="border-b border-gray-100 pb-3 pr-8">
              <h3 className="text-base font-extrabold text-[#1F2937]">Edit Category</h3>
              <p className="text-xs text-gray-500">Update property category details.</p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Category Name *</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Description</label>
                <textarea
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs sm:text-sm text-[#1F2937] focus:border-[#E91E63] focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <PrimaryButton
                  type="submit"
                  isLoading={updateMutation.isPending}
                  fullWidth
                  size="md"
                  className="rounded-xl font-semibold"
                >
                  Save Changes
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCategoryId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-gray-100 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-100 text-[#E91E63] flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">Delete Category?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete this category? Categories with active properties cannot be deleted.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteCategoryId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteCategoryId)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors shadow-md shadow-rose-500/20 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
