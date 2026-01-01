// Modern, vibrant theme system with gradients and dynamic colors
export const themes = {
  home: {
    primary: '#8b5cf6',
    primaryDark: '#7c3aed',
    primaryLight: '#a78bfa',
    secondary: '#ec4899',
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
    gradientHover: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #d97706 100%)',
    name: 'Vibrant Purple Pink',
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(245, 158, 11, 0.1) 100%)'
  },
  guest: {
    primary: '#f97316',
    primaryDark: '#ea580c',
    primaryLight: '#fb923c',
    secondary: '#f59e0b',
    accent: '#eab308',
    gradient: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #eab308 100%)',
    gradientHover: 'linear-gradient(135deg, #ea580c 0%, #d97706 50%, #ca8a04 100%)',
    name: 'Warm Sunset',
    bgGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(245, 158, 11, 0.1) 50%, rgba(234, 179, 8, 0.1) 100%)'
  },
  hotel: {
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    primaryLight: '#60a5fa',
    secondary: '#06b6d4',
    accent: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)',
    gradientHover: 'linear-gradient(135deg, #2563eb 0%, #0891b2 50%, #7c3aed 100%)',
    name: 'Ocean Blue',
    bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(139, 92, 246, 0.1) 100%)'
  },
  rental: {
    primary: '#10b981',
    primaryDark: '#059669',
    primaryLight: '#34d399',
    secondary: '#06b6d4',
    accent: '#3b82f6',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)',
    gradientHover: 'linear-gradient(135deg, #059669 0%, #0891b2 50%, #2563eb 100%)',
    name: 'Emerald Ocean',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)'
  },
  login: {
    primary: '#14b8a6',
    primaryDark: '#0d9488',
    primaryLight: '#5eead4',
    secondary: '#06b6d4',
    accent: '#3b82f6',
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #3b82f6 100%)',
    gradientHover: 'linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #2563eb 100%)',
    name: 'Teal Flow',
    bgGradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)'
  },
  search: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    primaryLight: '#818cf8',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
    gradientHover: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
    name: 'Deep Indigo',
    bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)'
  },
  property: {
    primary: '#a855f7',
    primaryDark: '#9333ea',
    primaryLight: '#c084fc',
    secondary: '#ec4899',
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f59e0b 100%)',
    gradientHover: 'linear-gradient(135deg, #9333ea 0%, #db2777 50%, #d97706 100%)',
    name: 'Violet Magic',
    bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(245, 158, 11, 0.1) 100%)'
  }
}

export const getTheme = (page) => {
  return themes[page] || themes.home
}
