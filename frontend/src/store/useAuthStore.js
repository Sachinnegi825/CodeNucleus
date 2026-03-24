import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      // Dedicated Branding State
      branding: {
        name: 'CodeNucleus',
        logoUrl: '',
        primaryColor: '#3b82f6'
      },

      // Function to update only branding
      setBranding: (data) => set((state) => ({
        branding: {
          name: data.name || state.branding.name,
          logoUrl: data.logoUrl || state.branding.logoUrl,
          primaryColor: data.primaryColor || state.branding.primaryColor
        }
      })),

      login: (userData) => {
        set({ user: userData, isAuthenticated: true });
        
        if (userData.organization) {
          const org = userData.organization;
          set({
            branding: {
              name: org.name,
              logoUrl: org.logoUrl,
              primaryColor: org.settings?.primaryColor || '#3b82f6'
            }
          });
          document.documentElement.style.setProperty('--brand-color', org.settings?.primaryColor || '#3b82f6');
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, branding: { name: 'CodeNucleus', logoUrl: '', primaryColor: '#3b82f6' } });
        document.documentElement.style.setProperty('--brand-color', '#3b82f6');
        localStorage.removeItem('auth-storage');
      }
    }),
    { name: 'auth-storage' }
  )
);