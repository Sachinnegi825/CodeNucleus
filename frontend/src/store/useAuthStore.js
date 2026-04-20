import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      // Dedicated Branding State
      branding: {
        name: 'CodeNucleus',
        logoUrl: '',
        primaryColor: '#3b82f6',
        fontFamily: 'Inter'
      },

      // Function to update only branding
      setBranding: (data) => {
        set((state) => ({
          branding: {
            name: data.name || state.branding.name,
            logoUrl: data.logoUrl || state.branding.logoUrl,
            primaryColor: data.primaryColor || state.branding.primaryColor,
            fontFamily: data.fontFamily || state.branding.fontFamily
          }
        }));
        if (data.primaryColor) document.documentElement.style.setProperty('--brand-color', data.primaryColor);
        if (data.fontFamily) document.documentElement.style.setProperty('--brand-font', data.fontFamily);
      },

      login: (userData) => {
        set({ user: userData, isAuthenticated: true });
        
        if (userData.organization) {
          const org = userData.organization;
          // API returns flattened properties (primaryColor) or nested (settings.primaryColor)
          const branding = {
            name: org.name,
            logoUrl: org.logoUrl,
            primaryColor: org.primaryColor || org.settings?.primaryColor || '#3b82f6',
            fontFamily: org.fontFamily || org.settings?.fontFamily || 'Inter'
          };
          set({ branding });
          document.documentElement.style.setProperty('--brand-color', branding.primaryColor);
          document.documentElement.style.setProperty('--brand-font', branding.fontFamily);
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, branding: { name: 'CodeNucleus', logoUrl: '', primaryColor: '#3b82f6', fontFamily: 'Inter' } });
        document.documentElement.style.setProperty('--brand-color', '#3b82f6');
        document.documentElement.style.setProperty('--brand-font', 'Inter');
        localStorage.removeItem('auth-storage');
      }
    }),
     {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage)
    }

  )
);