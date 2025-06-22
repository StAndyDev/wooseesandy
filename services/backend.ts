import api from './api';

// --------------------- list api view -------------------
export const fetchVisitorsData = async (BASE_URL: string, limit: number, offset: number) => {
  try {
    const res = await api.get(`${BASE_URL}/visitors-infos-list/?limit=${limit}&offset=${offset}`);
    return res.data;
  } catch (error: any) {
    console.error('Erreur fetchVisitorsData :', error.message);
    return null;
  }
};

export const fetchCVDownloadsData = async (BASE_URL: string, limit: number, offset: number) => {
  try {
    const res = await api.get(`${BASE_URL}/cv-downloads-list/?limit=${limit}&offset=${offset}`);
    return res.data;
  } catch (error: any) {
    console.error('Erreur fetchCVDownloadsData :', error.message);
    return null;
  }
};

export const fetchPortfolioDetailsViewData = async (BASE_URL: string, limit: number, offset: number) => {
  try {
    const res = await api.get(`${BASE_URL}/portfolio-details-view-list/?limit=${limit}&offset=${offset}`);
    return res.data;
  } catch (error: any) {
    console.error('Erreur fetchPortfolioDetailsViewData :', error.message);
    return null;
  }
};

// ------------------- mark as read ---------------
export const markVisitInfoAsRead = async (BASE_URL: string, id: string) => {
  try {
    const res = await api.post(`${BASE_URL}/mark-visit-info-as-read/${id}/`);
    return { data: res.data, status: res.status };
  } catch (error: any) {
    console.error('Erreur markVisitInfoAsRead :', error.message);
    return null;
  }
};

export const markCVDownloadAsRead = async (BASE_URL: string, id: string) => {
  try {
    const res = await api.post(`${BASE_URL}/mark-cv-download-as-read/${id}/`);
    return { data: res.data, status: res.status };
  } catch (error: any) {
    console.error('Erreur markCVDownloadAsRead :', error.message);
    return null;
  }
};

export const markPortfolioDetailViewAsRead = async (BASE_URL: string, id: string) => {
  try {
    const res = await api.post(`${BASE_URL}/mark-portfolio-detail-view-as-read/${id}/`);
    return { data: res.data, status: res.status };
  } catch (error: any) {
    console.error('Erreur markPortfolioDetailViewAsRead :', error.message);
    return null;
  }
};

// ---------------- delete -----------------
export const deleteVisitInfo = async (BASE_URL: string, id: string) => {
  try {
    const res = await api.delete(`${BASE_URL}/delete-visit-info/${id}/`);
    return { data: res.data, status: res.status };
  } catch (error: any) {
    console.error('Erreur deleteVisitInfo :', error.message);
    return null;
  }
};

export const deleteCVDownload = async (BASE_URL: string, id: string) => {
  try {
    const res = await api.delete(`${BASE_URL}/delete-cv-download/${id}/`);
    return { data: res.data, status: res.status };
  } catch (error: any) {
    console.error('Erreur deleteCVDownload :', error.message);
    return null;
  }
};

export const deletePortfolioDetailView = async (BASE_URL: string, id: string) => {
  try {
    const res = await api.delete(`${BASE_URL}/delete-portfolio-detail-view/${id}/`);
    return { data: res.data, status: res.status };
  } catch (error: any) {
    console.error('Erreur deletePortfolioDetailView :', error.message);
    return null;
  }
};

// ------------- get notification count ------------
interface NotificationCountResponse {
  visitinfo_count: number;
  cvdownload_count: number;
  portfoliodetailview_count: number;
}

export const fetchNotificationCount = async (
  BASE_URL: string,
  isRead?: boolean
): Promise<{ data: NotificationCountResponse; status: number } | null> => {
  const url = isRead !== undefined
    ? `${BASE_URL}/notifications/count/?is_read=${isRead}`
    : `${BASE_URL}/notifications/count/`;

  try {
    const response = await api.get<NotificationCountResponse>(url);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error('Erreur fetchNotificationCount :', error.message);
    return null;
  }
};

// -------------- get visitor count --------------
export const fetchVisitorCount = async (BASE_URL: string) => {
  try {
    const response = await api.get(`${BASE_URL}/visitor/count/`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error('Erreur fetchVisitorCount :', error.message);
    return null;
  }
};

// -------------- get cv_download count -------------
export const fetchCVDownloadsCount = async (BASE_URL: string) => {
  try {
    const response = await api.get(`${BASE_URL}/cv-download/count/`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error('Erreur fetchCVDownloadsCount :', error.message);
    return null;
  }
};

// -------------- get portfolio_details_view count ------------
export const fetchPortfolioDetailsViewCount = async (BASE_URL: string) => {
  try {
    const response = await api.get(`${BASE_URL}/portfolio-details-view/count/`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error('Erreur fetchPortfolioDetailsViewCount :', error.message);
    return null;
  }
};

// ---------- STATS PAR MOIS ET VARIATION ----------
interface MonthlyResponse {
  current_month: number;
  last_month: number;
}

export const fetchVisitInfoStatsMonthly = async (BASE_URL: string): Promise<{ data: MonthlyResponse; status: number } | null> => {
  try {
    const response = await api.get(`${BASE_URL}/visit-info-stats/monthly/`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error('Erreur fetchVisitInfoStatsMonthly :', error.message);
    return null;
  }
};

export const fetchPortfolioDetailMonthly = async (BASE_URL: string): Promise<{ data: MonthlyResponse; status: number } | null> => {
  try {
    const response = await api.get(`${BASE_URL}/portfolio-detail-stats/monthly/`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error('Erreur fetchPortfolioDetailMonthly :', error.message);
    return null;
  }
};

export const fetchCvDownloadMonthly = async (BASE_URL: string): Promise<{ data: MonthlyResponse; status: number } | null> => {
  try {
    const response = await api.get(`${BASE_URL}/cv-download-stats/monthly/`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error('Erreur fetchCvDownloadMonthly :', error.message);
    return null;
  }
};

// ---------- 7 DERNIERS STATS ----------
export async function getSevenLastVisitInfoStats(BASE_URL: string, mode = 'month') {
  try {
    const response = await api.get(`${BASE_URL}/seven-last-visit-info/stats/`, {
      params: { mode }
    });
    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error('Erreur getSevenLastVisitInfoStats :', error.message);
    return null;
  }
}

export async function getSevenLastCVDownloadStats(BASE_URL: string, mode = 'month') {
  try {
    const response = await api.get(`${BASE_URL}/seven-last-cv-download/stats/`, {
      params: { mode }
    });
    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error('Erreur getSevenLastCVDownloadStats :', error.message);
    return null;
  }
}

export async function getSevenLastPortfolioDetailViewStats(BASE_URL: string, mode = 'month') {
  try {
    const response = await api.get(`${BASE_URL}/seven-last-portfolio-detail/stats/`, {
      params: { mode }
    });
    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error('Erreur getSevenLastPortfolioDetailViewStats :', error.message);
    return null;
  }
}

// ---------- browser stats ----------
export async function getBrowserStats(BASE_URL: string) {
  try {
    const response = await api.get(`${BASE_URL}/browser-stats/`);
    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error('Erreur getBrowserStats :', error.message);
    return null;
  }
} 
