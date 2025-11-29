import { useEffect, useState } from 'react';
import { useRequireRole, useNotification } from '@/hooks';
import { AppLayout } from '@/components/layout';
import { Card, Button, Loading } from '@/components/ui';
import { getAllUsers, approveUserAccount } from '@/api/user.service';
import { formatDateTime } from '@/lib/utils';
import type { User } from '@/types';

export function AdminDashboard() {
  useRequireRole(['admin']);
  const { showSuccess, showError } = useNotification();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      showError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (uid: string, role: 'admin' | 'employee' | 'broker') => {
    try {
      await approveUserAccount(uid, role);
      showSuccess('User approved successfully!');
      loadUsers();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to approve user');
    }
  };

  const pendingUsers = users.filter((u) => !u.approved);
  const approvedUsers = users.filter((u) => u.approved);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="serif text-4xl font-semibold text-charcoal tracking-[0.08em] mb-8">
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card>
            <p className="text-sm text-slate mb-1">Total Users</p>
            <p className="text-3xl font-light text-gold">{users.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate mb-1">Pending Approval</p>
            <p className="text-3xl font-light text-gold">{pendingUsers.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate mb-1">Approved</p>
            <p className="text-3xl font-light text-gold">{approvedUsers.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate mb-1">Brokers</p>
            <p className="text-3xl font-light text-gold">
              {users.filter((u) => u.role === 'broker').length}
            </p>
          </Card>
        </div>

        {isLoading ? (
          <Loading size="lg" text="Loading users..." />
        ) : (
          <>
            {/* Pending Approvals */}
            {pendingUsers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-charcoal mb-4">Pending Approvals</h2>
                <Card padding="none">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-marble-dark border-b border-black/5">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">License</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Created</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-slate uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {pendingUsers.map((user) => (
                          <tr key={user.uid} className="hover:bg-marble-dark/50">
                            <td className="px-6 py-4 text-sm text-charcoal font-medium">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate">{user.email}</td>
                            <td className="px-6 py-4 text-sm text-slate">{user.companyName}</td>
                            <td className="px-6 py-4 text-sm text-slate">{user.licenseNumber}</td>
                            <td className="px-6 py-4 text-sm text-slate">
                              {formatDateTime(user.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-right text-sm space-x-2">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleApprove(user.uid, 'broker')}
                              >
                                Approve as Broker
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(user.uid, 'employee')}
                              >
                                Approve as Employee
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {/* All Users */}
            <div>
              <h2 className="text-xl font-semibold text-charcoal mb-4">All Users</h2>
              <Card padding="none">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-marble-dark border-b border-black/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase">Last Sign In</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {approvedUsers.map((user) => (
                        <tr key={user.uid} className="hover:bg-marble-dark/50">
                          <td className="px-6 py-4 text-sm text-charcoal font-medium">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate">{user.email}</td>
                          <td className="px-6 py-4 text-sm text-slate">{user.companyName}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gold/10 text-gold">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Approved
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate">
                            {formatDateTime(user.lastSignIn)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
