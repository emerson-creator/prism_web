"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useApiFetch } from "@/libs/hooks/useApiFetch";
import * as api from "@/libs/api";
import type { Role, User } from "@/libs/types";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default function AdminUsersPage() {
  const currentUser = useAuthStore((s) => s.user);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  const {
    data: users,
    isLoading,
    error: loadError,
  } = useApiFetch(() => api.fetchAllUsers(), [refreshKey], {
    fallbackError: "Could not load users",
  });

  async function handleRoleChange(user: User, nextRole: Role) {
    setRowError(null);

    if (user.id === currentUser?.id && nextRole !== "ADMIN") {
      setRowError("You can't remove your own admin access.");
      return;
    }

    if (!confirm(`Change ${user.email}'s role to ${nextRole}?`)) return;

    setUpdatingId(user.id);
    try {
      await api.adminUpdateUser(user.id, { role: nextRole });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setRowError(err instanceof Error ? err.message : "Could not update role");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(user: User) {
    if (user.id === currentUser?.id) {
      setRowError("You can't delete your own account from here.");
      return;
    }
    if (!confirm(`Delete ${user.email}? This cannot be undone.`)) return;

    setUpdatingId(user.id);
    setRowError(null);
    try {
      await api.adminDeleteUser(user.id);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setRowError(err instanceof Error ? err.message : "Could not delete user");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Users
      </h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {users ? `${users.length} user${users.length === 1 ? "" : "s"}` : ""}
      </p>

      {rowError && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
          {rowError}
        </p>
      )}

      {isLoading ? (
        <p className="mt-8 text-[13px] text-muted-foreground">Loading users…</p>
      ) : loadError ? (
        <p className="mt-8 text-[13px] text-red-600">{loadError}</p>
      ) : !users || users.length === 0 ? (
        <p className="mt-8 text-[13px] text-muted-foreground">
          No users found.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-border text-[11.5px] uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => {
                const isSelf = user.id === currentUser?.id;
                const isUpdating = updatingId === user.id;
                return (
                  <tr key={user.id}>
                    <td className="px-4 py-3 text-foreground">
                      {user.name} {user.lastName}
                      {isSelf && (
                        <span className="ml-1.5 text-[11px] text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.createdAt
                        ? dateFormat.format(new Date(user.createdAt))
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.Role}
                        disabled={isUpdating}
                        onChange={(e) =>
                          handleRoleChange(user, e.target.value as Role)
                        }
                        className="h-8 rounded-lg border border-border bg-background px-2 text-[12.5px] text-foreground outline-none transition-colors focus:border-foreground disabled:opacity-50"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          aria-label={`Delete ${user.email}`}
                          onClick={() => handleDelete(user)}
                          disabled={isUpdating || isSelf}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                        >
                          <Trash2
                            className="h-[15px] w-[15px]"
                            strokeWidth={1.75}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
