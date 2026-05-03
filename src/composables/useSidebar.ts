import { ref, watch } from 'vue';

const isSidebarOpen = ref(false);
const isMobile = ref(false);

// Lock/unlock body scroll
const lockBodyScroll = () => {
  if (typeof document !== 'undefined' && isMobile.value) {
    document.body.style.overflow = 'hidden';
  }
};

const unlockBodyScroll = () => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
};

// Check if screen is mobile
if (typeof window !== 'undefined') {
  const checkMobile = () => {
    const wasMobile = isMobile.value;
    isMobile.value = window.innerWidth < 1024; // lg breakpoint
    
    // Auto-open sidebar on desktop, close on mobile
    if (!isMobile.value && wasMobile) {
      // Switched from mobile to desktop
      isSidebarOpen.value = true;
      unlockBodyScroll();
    } else if (isMobile.value && !wasMobile) {
      // Switched from desktop to mobile
      isSidebarOpen.value = false;
      unlockBodyScroll();
    }
  };

  checkMobile();
  // Set initial state based on screen size
  isSidebarOpen.value = !isMobile.value;
  
  window.addEventListener('resize', checkMobile);
  
  // Watch sidebar state for body scroll lock on mobile
  watch([isSidebarOpen, isMobile], ([isOpen, mobile]) => {
    if (mobile && isOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  });
}

export function useSidebar() {
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const closeSidebar = () => {
    isSidebarOpen.value = false;
  };

  const openSidebar = () => {
    isSidebarOpen.value = true;
  };

  return {
    isSidebarOpen,
    isMobile,
    toggleSidebar,
    closeSidebar,
    openSidebar
  };
}

