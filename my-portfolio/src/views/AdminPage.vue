<template>
  <div class="admin-dashboard-content">
    <header class="dashboard-header">
      <h1>Command Center</h1>
      <div class="header-actions">
        <button @click="exportToCSV" class="action-button" :disabled="!proposals || proposals.length === 0">
          <span class="icon">↓</span> Export as CSV
        </button>
        <button @click="handleLogout">Logout</button>
      </div>
    </header>

    <!-- KPI Section -->
    <section class="kpi-grid">
      <div class="kpi-card">
        <span class="kpi-value">{{ totalProposals }}</span>
        <span class="kpi-label">Total Leads</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-value">{{ mostPopularService }}</span>
        <span class="kpi-label">Most Popular Service</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-value">{{ newLeadsCount }}</span>
        <span class="kpi-label">New Leads</span>
      </div>
    </section>

    <!-- Main Content Grid (Chart + Table) -->
    <div class="main-grid">
      <section class="chart-container">
        <h3>Leads by Service Type</h3>
        <div class="chart-wrapper">
          <div v-if="chartError" class="error-state">
            <p><strong>Could not load chart.</strong></p>
            <p>{{ chartError }}</p>
          </div>
          <Doughnut v-else-if="proposals && proposals.length > 0" :data="chartData" :options="chartOptions" />
          <div v-else-if="isLoading" class="loading-state-small">Loading Chart...</div>
          <div v-else class="empty-state">No data to display chart.</div>
        </div>
      </section>

      <section class="table-container">
        <h3>All Submissions</h3>
        <div v-if="isLoading" class="loading-state">Loading proposals...</div>
        <div v-else-if="proposals && proposals.length > 0" class="proposals-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Received</th>
                <th>Client Email</th>
                <th>Project Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="proposal in proposals" :key="proposal.id">
                <td>{{ new Date(proposal.created_at).toLocaleDateString() }}</td>
                <td>{{ proposal.client_email }}</td>
                <td>{{ proposal.project_type?.label || 'N/A' }}</td>
                <td>
                  <span class="status-badge" :class="`status-${proposal.status}`">{{ proposal.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">No proposals have been submitted yet.</div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onErrorCaptured } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/services/supabase';

import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const router = useRouter();
const proposals = ref(null);
const isLoading = ref(true);
const chartError = ref(null);

onErrorCaptured((err) => {
  console.error("A rendering error occurred in a child component:", err.message);
  chartError.value = "An unexpected error occurred while rendering the chart. This could be due to invalid data or a library issue.";
  return false;
});

const totalProposals = computed(() => proposals.value?.length || 0);

const proposalClusters = computed(() => {
  if (!proposals.value || proposals.value.length === 0) return {};
  return proposals.value.reduce((acc, proposal) => {
    const type = proposal.project_type?.label || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
});

const mostPopularService = computed(() => {
  const clusters = proposalClusters.value;
  if (Object.keys(clusters).length === 0) return 'N/A';
  return Object.keys(clusters).reduce((a, b) => clusters[a] > clusters[b] ? a : b);
});

const newLeadsCount = computed(() => {
  if (!proposals.value) return 0;
  return proposals.value.filter(p => p.status === 'new').length;
});

const chartData = computed(() => ({
  labels: Object.keys(proposalClusters.value),
  datasets: [{
    backgroundColor: ['#B3402A', '#2C2726', '#9E988D', '#ECEAE3', '#C4A464'],
    data: Object.values(proposalClusters.value),
    borderWidth: 0,
  }],
}));

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'right' }, title: { display: false } },
});

const fetchProposals = async () => {
  isLoading.value = true;
  chartError.value = null;
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    proposals.value = data || [];
  } catch (error) {
    console.error('Error fetching proposals:', error.message);
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push({ name: 'Login' });
};

const exportToCSV = () => {
  if (!proposals.value || proposals.value.length === 0) {
    alert("No data to export.");
    return;
  }
  const headers = ['id', 'received_date', 'client_email', 'project_type', 'est_budget_min_kes', 'est_budget_max_kes', 'status'];
  const rows = proposals.value.map(p => [
    p.id, new Date(p.created_at).toISOString().split('T')[0], `"${p.client_email || ''}"`, `"${p.project_type?.label || 'N/A'}"`,
    p.estimated_budget?.min.replace(/,/g, '') || '0', p.estimated_budget?.max.replace(/,/g, '') || '0', p.status || 'N/A'
  ].join(','));
  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `proposal_leads_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  fetchProposals();
});
</script>

<style scoped>
/* Scoped styles are specific to this component's content */
.admin-dashboard-content {
  width: 100%;
}

/* --- START: HEADER LAYOUT FIX --- */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* Allows buttons to wrap below title on very small screens */
  gap: 1.5rem;      /* Creates space between title and buttons, especially when wrapped */
  margin-bottom: 2rem;
}
/* --- END: HEADER LAYOUT FIX --- */

h1 { margin: 0; font-size: 2.5rem; }
.header-actions { display: flex; gap: 1rem; }
button, .action-button { background-color: var(--color-text); color: var(--color-background); font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.1em; border: none; padding: 0.75rem 1.5rem; cursor: pointer; font-size: 0.9rem; transition: background-color 0.3s ease; border-radius: 4px; }
button:hover, .action-button:hover:not(:disabled) { background-color: var(--color-primary); }
button:disabled { background-color: var(--color-muted); cursor: not-allowed; opacity: 0.7; }
.action-button { background-color: transparent; color: var(--color-text); border: 1px solid var(--color-muted); }
.action-button .icon { margin-right: 0.5rem; }

.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
.kpi-card { background-color: #fff; padding: 1.5rem 2rem; border: 1px solid #e0e0e0; border-radius: 4px; }
.kpi-value { display: block; font-family: var(--font-display); font-size: 2.5rem; font-weight: 700; color: var(--color-primary); }
.kpi-label { display: block; font-size: 1rem; color: var(--color-muted); margin-top: 0.25rem; }

.main-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem; align-items: flex-start; }
.chart-container, .table-container { background-color: #fff; padding: 2rem; border: 1px solid #e0e0e0; border-radius: 4px; }
h3 { margin-top: 0; font-size: 1.5rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 1rem; margin-bottom: 1.5rem; }

.chart-wrapper { position: relative; height: 400px; width: 100%; display: flex; justify-content: center; align-items: center; }
.error-state { text-align: center; padding: 2rem; border: 1px dashed red; background-color: #fff5f5; color: #c53030; border-radius: 4px; }
.error-state p { margin: 0.5rem 0; }

.proposals-table-wrapper { width: 100%; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 1rem; border-bottom: 1px solid #e0e0e0; text-align: left; vertical-align: middle; }
th { font-family: var(--font-display); font-size: 0.9rem; }
td { font-size: 0.95rem; }
.status-badge { padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
.status-new { background-color: #e0f2fe; color: #0284c7; }
.empty-state, .loading-state, .loading-state-small { text-align: center; padding: 4rem; font-size: 1.2rem; color: var(--color-muted); }
.loading-state-small { padding: 6rem 4rem; }

@media (max-width: 1200px) { .main-grid { grid-template-columns: 1fr; } }
/* The problematic media query that forced the header into a column has been removed. */
/* @media (max-width: 768px) { .dashboard-header { flex-direction: column; ... } } */
</style>
