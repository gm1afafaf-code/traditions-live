import { useEffect, useState } from 'react';
import { useRequireAuth, useRequireApproval, useNotification } from '@/hooks';
import { AppLayout } from '@/components/layout';
import { Card, Button, Input, Select, Modal, Loading } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productFormSchema, ProductFormData } from '@/lib/validations';
import { PRODUCT_TYPES, QUALITY_GRADES, UNITS } from '@/lib/constants';
import { getProductsByCompany, createProduct } from '@/api/product.service';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

export function BrokerDashboard() {
  useRequireAuth();
  const { user } = useRequireApproval();
  const { showSuccess, showError } = useNotification();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
  });

  useEffect(() => {
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getProductsByCompany(user.uid);
      setProducts(data);
    } catch (error) {
      showError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!user) return;

    try {
      const productData: ProductFormData = {
        name: data.name,
        type: data.type,
        description: data.description || '',
        thc: data.thc ?? undefined,
        cbd: data.cbd ?? undefined,
        quality: data.quality ?? undefined,
        price: data.price,
        unit: data.unit,
        stock: data.stock,
        minOrder: data.minOrder ?? undefined,
        coaUrl: data.coaUrl,
      };
      await createProduct(user.uid, user.companyName, user.licenseNumber, productData as any);
      showSuccess('Product created successfully!');
      reset();
      setIsModalOpen(false);
      loadProducts();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to create product');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="serif text-4xl font-semibold text-charcoal tracking-[0.08em]">
              Vendor Portal
            </h1>
            <p className="text-slate text-sm mt-1">Manage your inventory</p>
          </div>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Add Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card>
            <p className="text-sm text-slate mb-1">Total Products</p>
            <p className="text-3xl font-light text-gold">{products.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate mb-1">Active Listings</p>
            <p className="text-3xl font-light text-gold">{products.filter(p => p.active).length}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate mb-1">Total Stock</p>
            <p className="text-3xl font-light text-gold">
              {products.reduce((sum, p) => sum + p.stock, 0)}
            </p>
          </Card>
        </div>

        {/* Products Table */}
        {isLoading ? (
          <Loading size="lg" text="Loading products..." />
        ) : (
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-marble-dark border-b border-black/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">THC %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-marble-dark/50">
                      <td className="px-6 py-4 text-sm text-charcoal font-medium">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-slate">{product.type}</td>
                      <td className="px-6 py-4 text-sm text-slate">
                        {formatCurrency(product.price)}/{product.unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate">{product.stock}</td>
                      <td className="px-6 py-4 text-sm text-slate">{product.thc || '-'}</td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate">
                        No products yet. Add your first product to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Add Product Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product" size="lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input label="Product Name" {...register('name')} error={errors.name?.message} required />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Type"
                {...register('type')}
                error={errors.type?.message}
                options={[
                  { value: '', label: 'Select type' },
                  ...PRODUCT_TYPES.map((type) => ({ value: type, label: type })),
                ]}
                required
              />
              <Select
                label="Quality"
                {...register('quality')}
                error={errors.quality?.message}
                options={[
                  { value: '', label: 'Select quality' },
                  ...QUALITY_GRADES.map((grade) => ({ value: grade, label: grade })),
                ]}
              />
            </div>

            <Input
              label="Description"
              {...register('description')}
              error={errors.description?.message}
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="THC %"
                type="number"
                step="0.1"
                {...register('thc', { valueAsNumber: true })}
                error={errors.thc?.message}
              />
              <Input
                label="CBD %"
                type="number"
                step="0.1"
                {...register('cbd', { valueAsNumber: true })}
                error={errors.cbd?.message}
              />
              <Input
                label="Price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                error={errors.price?.message}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Select
                label="Unit"
                {...register('unit')}
                error={errors.unit?.message}
                options={UNITS.map((unit) => ({ value: unit, label: unit }))}
                required
              />
              <Input
                label="Stock"
                type="number"
                {...register('stock', { valueAsNumber: true })}
                error={errors.stock?.message}
                required
              />
              <Input
                label="Min Order"
                type="number"
                {...register('minOrder', { valueAsNumber: true })}
                error={errors.minOrder?.message}
              />
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t border-black/10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Create Product
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
