import axios from 'axios';

// --------------------- list api view -------------------
export const fetchVisitorsData = async (BASE_URL: string, limit: number, offset: number) => {
  const res = await axios.get(`${BASE_URL}/visitors-infos-list/?limit=${limit}&offset=${offset}`);
  return res.data;
}

export const fetchCVDownloadsData = async (BASE_URL: string, limit: number, offset: number) => {
  const res = await axios.get(`${BASE_URL}/cv-downloads-list/?limit=${limit}&offset=${offset}`);
  return res.data;
}

export const fetchPortfolioDetailsViewData = async (BASE_URL: string, limit: number, offset: number) => {
  const res = await axios.get(`${BASE_URL}/portfolio-details-view-list/?limit=${limit}&offset=${offset}`);
  return res.data;
}
// ------------------- mark as read ---------------
// VisitInfo
export const markVisitInfoAsRead = async (BASE_URL: string, id: string) => {
  const res = await axios.post(`${BASE_URL}/mark-visit-info-as-read/${id}/`);
  return {
    data: res.data,
    status: res.status,
  };
}
// CVDownload
export const markCVDownloadAsRead = async (BASE_URL: string, id: string) => {
  const res = await axios.post(`${BASE_URL}/mark-cv-download-as-read/${id}/`);
  return {
    data: res.data,
    status: res.status,
  };
}
// PortfolioDetailView
export const markPortfolioDetailViewAsRead = async (BASE_URL: string, id: string) => {
  const res = await axios.post(`${BASE_URL}/mark-portfolio-detail-view-as-read/${id}/`);
  return {
    data: res.data,
    status: res.status,
  };
}
// ---------------- delete -----------------
// VisitInfo
export const deleteVisitInfo = async (BASE_URL: string, id: string) => {
  const res = await axios.delete(`${BASE_URL}/delete-visit-info/${id}/`);
  return {
    data: res.data,
    status: res.status,
  };
}
// CVDownload
export const deleteCVDownload = async (BASE_URL: string, id: string) => {
  const res = await axios.delete(`${BASE_URL}/delete-cv-download/${id}/`);
  return {
    data: res.data,
    status: res.status,
  };
}
// PortfolioDetailView
export const deletePortfolioDetailView = async (BASE_URL: string, id: string) => {
  const res = await axios.delete(`${BASE_URL}/delete-portfolio-detail-view/${id}/`);
  return {
    data: res.data,
    status: res.status,
  };
}
// ------------- get notification count ------------
interface NotificationCountResponse {
  visitinfo_count: number,
  cvdownload_count: number,
  portfoliodetailview_count: number,
}
export const fetchNotificationCount = async (
  BASE_URL: string,
  isRead?: boolean
): Promise<{ data: NotificationCountResponse; status: number }> => {
  const url = isRead !== undefined
    ? `${BASE_URL}/notifications/count/?is_read=${isRead}`
    : `${BASE_URL}/notifications/count/`

  const response = await axios.get<NotificationCountResponse>(url)

  return {
    data: response.data,
    status: response.status,
  }
}
/********* COUNT ********/
// -------------- get visitor count --------------
export const fetchVisitorCount = async (BASE_URL: string) => {
  const response = await axios.get(`${BASE_URL}/visitor/count/`);
  return {
    data: response.data,
    status: response.status,
  }
}
// -------------- get cv_download count -------------
export const fetchCVDownloadsCount = async (BASE_URL: string) => {
  const response = await axios.get(`${BASE_URL}/cv-download/count/`);
  return {
    data: response.data,
    status: response.status,
  }
}
// -------------- get portfolio_details_view count ------------
export const fetchPortfolioDetailsViewCount = async (BASE_URL: string) => {
  const response = await axios.get(`${BASE_URL}/portfolio-details-view/count/`);
  return {
    data: response.data,
    status: response.status,
  }
}
/* ----------
STATS PAR MOIS ET VARIATION
--------*/
interface MonthlyResponse {
  "current_month": number,
  "last_month": number,
}
export const fetchVisitInfoStatsMonthly = async (BASE_URL: string): Promise<{ data: MonthlyResponse; status: number }> => {
  const response = await axios.get(`${BASE_URL}/visit-info-stats/monthly/`);
  return {
    data: response.data,
    status: response.status,
  }
}
export const fetchPortfolioDetailMonthly = async (BASE_URL: string): Promise<{ data: MonthlyResponse; status: number }> => {
  const response = await axios.get(`${BASE_URL}/portfolio-detail-stats/monthly/`);
  return {
    data: response.data,
    status: response.status,
  };
};
export const fetchCvDownloadMonthly = async (BASE_URL: string): Promise<{ data: MonthlyResponse; status: number }> => {
  const response = await axios.get(`${BASE_URL}/cv-download-stats/monthly/`);
  return {
    data: response.data,
    status: response.status,
  };
};
/* ----------
LES 7 DERNIER STATS PAR MOIS/SEMAINE
--------*/
// mode = month | week
export async function getSevenLastVisitInfoStats(BASE_URL: string, mode = 'month') {
    const response = await axios.get(`${BASE_URL}/seven-last-visit-info/stats/`, {
      params: { mode }
    });
    return {
      data: response.data,
      status: response.status,
    };
}

export async function getSevenLastCVDownloadStats(BASE_URL: string, mode = 'month') {
    const response = await axios.get(`${BASE_URL}/seven-last-cv-download/stats/`, {
      params: { mode }
    });
    return {
      data: response.data,
      status: response.status,
    };
}

export async function getSevenLastPortfolioDetailViewStats(BASE_URL: string, mode = 'month') {
    const response = await axios.get(`${BASE_URL}/seven-last-portfolio-detail/stats/`, {
      params: { mode }
    });
    return {
      data: response.data,
      status: response.status,
    };
}
// browser stats
export async function getBrowserStats(BASE_URL: string) {
  const response = await axios.get(`${BASE_URL}/browser-stats/`);
  return {
    data: response.data,
    status: response.status,
  };
}
