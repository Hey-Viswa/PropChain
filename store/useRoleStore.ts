import { create } from 'zustand';

type Role = 'user' | 'oracle';

interface RoleStore {
  role: Role;
  setRole: (role: Role) => void;
  toggleRole: () => void;
}

export const useRoleStore = create<RoleStore>((set) => ({
  role: 'user', // Default role
  setRole: (role) => set({ role }),
  toggleRole: () => set((state) => ({ role: state.role === 'user' ? 'oracle' : 'user' })),
}));
