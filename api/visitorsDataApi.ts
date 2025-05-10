import axios from 'axios';

// const BASE_URL = 'http://localhost:8000/api'; // URL de base
const BASE_URL = 'http://192.168.137.1:8000/api';

// list api view
export const fetchVisitorsData = async (limit: number, offset: number) => {
  const res = await axios.get(`${BASE_URL}/visitors-infos-list/?limit=${limit}&offset=${offset}`);
  return res.data;
}

export const fetchCVDownloadsData = async (limit: number, offset: number) => {
  const res = await axios.get(`${BASE_URL}/cv-downloads-list/?limit=${limit}&offset=${offset}`);
  return res.data;
}

export const fetchPortfolioDetailsViewData = async (limit: number, offset: number) => {
  const res = await axios.get(`${BASE_URL}/portfolio-details-view-list/?limit=${limit}&offset=${offset}`);
  return res.data;
}
// ---- mark as read api -----
// VisitInfo
export const markVisitInfoAsRead = async (id: string) => {
  const res = await axios.post(`${BASE_URL}/mark-visit-info-as-read/${id}/`);
  return {
    data: res.data,
    status: res.status,
  };
}
// CVDownload
export const markCVDownloadAsRead = async (id: string) => {
  const res = await axios.post(`${BASE_URL}/mark-cv-download-as-read/${id}/`);
  return {
    data: res.data,
    status: res.status,
  };
}
// PortfolioDetailView
export const markPortfolioDetailViewAsRead = async (id: string) => {
  const res = await axios.post(`${BASE_URL}/mark-portfolio-detail-view-as-read/${id}/`);
  return {
    data: res.data,
    status: res.status,
  };
}