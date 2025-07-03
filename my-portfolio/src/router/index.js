import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '@/services/supabase';

// Import all of your page/view components AND the new layout
import HomePage from '@/views/HomePage.vue';
import ProjectDetailPage from '@/views/ProjectDetailPage.vue';
import ServicesPage from '@/views/ServicesPage.vue';
import AboutPage from '@/views/AboutPage.vue';
import ContactPage from '@/views/ContactPage.vue';
import ConsultationView from '@/views/ConsultationView.vue';
import LoginPage from '@/views/LoginPage.vue';
import AdminLayout from '@/layouts/AdminLayout.vue'; // <-- NEW: Import the layout
import AdminPage from '@/views/AdminPage.vue'; // This is the dashboard page itself

const routes = [
  // Public-facing routes
  { path: '/', name: 'Home', component: HomePage },
  { path: '/project/:slug', name: 'ProjectDetail', component: ProjectDetailPage },
  { path: '/services', name: 'Services', component: ServicesPage },
  { path: '/about', name: 'About', component: AboutPage },
  { path: '/contact', name: 'Contact', component: ContactPage },
  { path: '/consultation', name: 'Consultation', component: ConsultationView },
  
  // Auth route
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  
  // ** RE-STRUCTURED ADMIN ROUTE **
  {
    path: '/admin',
    component: AdminLayout, // The parent component is the new layout shell
    meta: { requiresAuth: true }, // The entire layout and its children are protected
    children: [
      {
        path: '', // This makes AdminPage the default component for the /admin route
        name: 'AdminDashboard',
        component: AdminPage,
      },
      // In the future, you could add more admin pages like:
      // { path: 'settings', name: 'AdminSettings', component: AdminSettingsPage }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0 };
  }
});

// Navigation Guard (remains the same, it's already correct)
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (!requiresAuth) {
    next();
    return;
  }
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    next();
  } else {
    next({ name: 'Login' });
  }
});

export default router;