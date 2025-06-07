import ProgressRing from '@/components/ProgressElement';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import Chart from '../../components/ChartElement';
import MyDashboard from '../../components/DashboardElement';
import globalStyles from '../styles';
// redux
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
// recuder
import {
  addCurrentMonthCvDownload,
  addCurrentMonthPortfolioDetail,
  addCurrentMonthVisits,
  addCvDownloadCount,
  addLastMonthCvDownload,
  addLastMonthVisits,
  addVisitorCount,
  addVuesPortfolioDetailsCount,
  setCvDownloadPercentageMonthly,
  setPortfolioDetailPercentageMonthly,
  setVisitInfoPercentageMonthly
} from '../../features/counterSlice';
import { setReadNotificationCount, setUnreadNotificationCount } from '../../features/numberNotificationSlice';
// api
import {
  fetchCvDownloadMonthly,
  fetchCVDownloadsCount,
  fetchNotificationCount,
  fetchPortfolioDetailMonthly,
  fetchPortfolioDetailsViewCount,
  fetchVisitInfoStatsMonthly,
  fetchVisitorCount
} from '../../api/visitorsDataApi';

import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { calculateChangePercentage } from '../utils/stats';

const histogramData = [
  { page: "Home", visites: 100 },
  { page: "About", visites: 80 },
  { page: "Contact", visites: 50 },
  { page: "Blog", visites: 30 },
  { page: "Portfolio", visites: 20 },
  { page: "Services", visites: 10 },
  { page: "Testimonials", visites: 5 },
  { page: "FAQ", visites: 2 },
  { page: "Privacy Policy", visites: 1 },
  { page: "Terms of Service", visites: 1 },
  { page: "Sitemap", visites: 1 },
  { page: "Careers", visites: 1 },
];

export default function Dashboard() {
  /***** state *****/
  const [loadingVisitsCount, setLoadingVisitsCount] = useState(true);
  const [loadingPortfolioViews, setLoadingPortfolioViews] = useState(true);
  const [loadingCvDownloads, setLoadingCvDownloads] = useState(true);
  const [loadingVisitorCount, setLoadingVisitorCount] = useState(true);
  // visitinfo change percentage monthly

  const registeredOnlineVisitor = useSelector((state: RootState) => state.number_online.registered_visitor)
  const newOnlineVisitor = useSelector((state: RootState) => state.number_online.new_visitor)
  // reducers

  // notif non lu
  const visitinfo_unread_count = useSelector((state: RootState) => state.number_notification.unread.visitinfo_count)
  const cvdownload_unread_count = useSelector((state: RootState) => state.number_notification.unread.cvdownload_count)
  const portfoliodetailview_unread_count = useSelector((state: RootState) => state.number_notification.unread.portfoliodetailview_count)
  // notif lu
  const visitinfo_read_count = useSelector((state: RootState) => state.number_notification.read.visitinfo_count)
  const cvdownload_read_count = useSelector((state: RootState) => state.number_notification.read.cvdownload_count)
  const portfoliodetailview_read_count = useSelector((state: RootState) => state.number_notification.read.portfoliodetailview_count)
  // count
  const visitor_count = useSelector((state: RootState) => state.counter.visitor_count )
  const cv_download_count = useSelector((state: RootState) => state.counter.cv_download_count)
  const portfolio_details_view_count = useSelector((state: RootState) => state.counter.portfolio_details_view_count )
  // count per month
  const visit_info_per_month_percentage = useSelector( (state: RootState) => state.counter.visit_info_per_month_percentage )
  const cv_download_per_month_percentage = useSelector( (state: RootState) => state.counter.cv_download_per_month_percentage )
  const portfolio_detail_per_month_percentage = useSelector ( (state: RootState) => state.counter.portfolio_detail_per_month_percentage )

  const dispatch = useDispatch()

  useEffect(() => {
    const loadStatNotification = async () => {
      // fetch unread notif
      const res_unread = await fetchNotificationCount(false); // nbr notif non lu
      if (res_unread.status === 200) {
        const data_unread = {
          visitinfo_count: visitinfo_unread_count + res_unread.data.visitinfo_count,
          cvdownload_count: cvdownload_unread_count + res_unread.data.cvdownload_count,
          portfoliodetailview_count: portfoliodetailview_unread_count + res_unread.data.portfoliodetailview_count,
        }
        dispatch(setUnreadNotificationCount(data_unread));
        setLoadingVisitsCount(false);
      }
      // fetch read notif
      const res_read = await fetchNotificationCount(true); // nbr notif lu
      if (res_read.status === 200) {
        const data_read = {
          visitinfo_count : visitinfo_read_count + res_read.data.visitinfo_count,
          cvdownload_count : cvdownload_read_count + res_read.data.cvdownload_count,
          portfoliodetailview_count : portfoliodetailview_read_count + res_read.data.portfoliodetailview_count,
        }
        dispatch(setReadNotificationCount(data_read));
      }
      // fecth visitor count
      const visitor_nbr = await fetchVisitorCount();
      if (visitor_nbr.status === 200) {
        dispatch(addVisitorCount(visitor_nbr.data.visitor_count));
        setLoadingVisitorCount(false);
      }
      // fetch cv download count
      const cv_download_nbr = await fetchCVDownloadsCount();
      if (cv_download_nbr.status === 200) {
        dispatch(addCvDownloadCount(cv_download_nbr.data.cv_download_count));
        setLoadingCvDownloads(false);
      }
      // fetch portfolio details view count
      const portfolio_details_view_nbr = await fetchPortfolioDetailsViewCount();
      if (portfolio_details_view_nbr.status === 200) {
        dispatch(addVuesPortfolioDetailsCount(portfolio_details_view_nbr.data.portfolio_details_view_count));
        setLoadingPortfolioViews(false);
      }
      // fetch visit info stat monthly
      const visit_info_stat_monthly = await fetchVisitInfoStatsMonthly();
      if (visit_info_stat_monthly.status === 200) {
        const current_month_nbr = visit_info_stat_monthly.data.current_month;
        const last_month_nbr = visit_info_stat_monthly.data.last_month;
        const visitInfoMonthlyPercentage = calculateChangePercentage(current_month_nbr, last_month_nbr);
        dispatch(setVisitInfoPercentageMonthly(visitInfoMonthlyPercentage));
        dispatch(addCurrentMonthVisits(current_month_nbr));
        dispatch(addLastMonthVisits(last_month_nbr));
      }
      // fetch cv download stat monthly
      const cv_download_stat_monthly = await fetchCvDownloadMonthly();
      if (cv_download_stat_monthly.status === 200) {
        const current_month_nbr = cv_download_stat_monthly.data.current_month;
        const last_month_nbr = cv_download_stat_monthly.data.last_month;
        const cvDownloadMonthlyPercentage = calculateChangePercentage(current_month_nbr, last_month_nbr);
        dispatch(setCvDownloadPercentageMonthly(cvDownloadMonthlyPercentage));
        dispatch(addCurrentMonthCvDownload(current_month_nbr));
        dispatch(addLastMonthCvDownload(last_month_nbr));
      }
      // fetch portfolio detail stat monthly
      const portfolio_detail_stat_monthly = await fetchPortfolioDetailMonthly();
      if (portfolio_detail_stat_monthly.status === 200) {
        const current_month_nbr = portfolio_detail_stat_monthly.data.current_month;
        const last_month_nbr = portfolio_detail_stat_monthly.data.last_month;
        const portfolioDetailMonthlyPercentage = calculateChangePercentage(current_month_nbr, last_month_nbr);
        dispatch(setPortfolioDetailPercentageMonthly(portfolioDetailMonthlyPercentage));
        dispatch(addCurrentMonthPortfolioDetail(current_month_nbr));
        dispatch(addCurrentMonthPortfolioDetail(last_month_nbr));
      }
    }
    loadStatNotification();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.parent}>
        {/* ------  CARD : 1 ----- */}
        {registeredOnlineVisitor > 0 && newOnlineVisitor > 0 ? (
          <MyDashboard
            title="En ligne"
            ioniconsElementName="information-circle-outline"
            numbers={registeredOnlineVisitor + newOnlineVisitor}
            content={
              <Text>
                <Text style={{ color: globalStyles.primaryColor.color }}>{registeredOnlineVisitor}</Text> récurrent(s) et
                <Text style={{ color: globalStyles.primaryColor.color }}> {newOnlineVisitor}</Text> nouveau(x) visiteur(s) connecté(s)
              </Text>
            }
          />
        ) : registeredOnlineVisitor > 0 && newOnlineVisitor === 0 ? (
          <MyDashboard
            title="En ligne"
            ioniconsElementName="information-circle-outline"
            numbers={registeredOnlineVisitor}
            content={
              <>
              <Text style={{ color: globalStyles.primaryColor.color }}>{registeredOnlineVisitor}</Text> récurrent(s) visiteur(s) connecté(s)
              </>
            }
          />
        ) : registeredOnlineVisitor === 0 && newOnlineVisitor > 0 ? (
          <MyDashboard
            title="En ligne"
            ioniconsElementName="information-circle-outline"
            numbers={newOnlineVisitor}
            content={
              <>
              <Text style={{ color: globalStyles.primaryColor.color }}>{newOnlineVisitor}</Text> nouveau(x) visiteur(s) connecté(s)
              </>
            }
          />
        )
         : (
          <MyDashboard
            title="En ligne"
            ioniconsElementName="information-circle-outline"
            numbers={0}
            content="Aucun visiteur connecté pour le moment"
          />
        )}
        {/* ---------- CARD : 2 -------- */}
        <MyDashboard 
        title="Métriques de visites" 
        ioniconsElementName="people" 
        numbers={visitinfo_unread_count + visitinfo_read_count}
        loadingNumbers={loadingVisitsCount}
        // content="Nombre total de visites accumulés" 
        ioniconsName={(visit_info_per_month_percentage > 0)
          ? "arrow-up"
          : (visit_info_per_month_percentage === 0)
            ? "remove"
            : "arrow-down"}
        percentage={`${Math.abs(visit_info_per_month_percentage)}%`}
        textPercentage="de visites depuis le mois dernier"
        content={
          <Text>
            <Text>Pour </Text>
              {
                loadingVisitorCount ? (<ActivityIndicator color={globalStyles.secondaryText.color} size="small" />) : (
                  <Text style={{ color: globalStyles.primaryColor.color }}>
                    {visitor_count}
                  </Text>
                )
              }
            <Text> visites au total</Text>
        </Text>
        }
        />

        {/* --------- CARD : 3 -------- */}
        <MyDashboard 
        title="Vues du portfolio-détails" 
        ioniconsElementName="eye" 
        numbers={portfolio_details_view_count}
        loadingNumbers={loadingPortfolioViews}
        content="Total des vues de pages sur le portfolio"
        ioniconsName={(portfolio_detail_per_month_percentage > 0)
          ? "arrow-up"
          : (portfolio_detail_per_month_percentage === 0)
            ? "remove"
            : "arrow-down"}
        percentage={`${Math.abs(portfolio_detail_per_month_percentage)}%`}
        textPercentage=" depuis le mois dernier" />

        {/* --------- CARD : 4 --------- */}
        <MyDashboard 
        title="CV download" 
        ioniconsElementName="download" 
        numbers={cv_download_count}
        loadingNumbers={loadingCvDownloads}
        content="Nombre de CV téléchargés" 
        ioniconsName={(cv_download_per_month_percentage > 0)
          ? "arrow-up"
          : (cv_download_per_month_percentage === 0)
            ? "remove"
            : "arrow-down"}
        percentage={`${Math.abs(cv_download_per_month_percentage)}%`}
        textPercentage=" depuis le mois dernier" />
      </View>
      <View style={styles.parent}>
        <Chart />
        {/* <Histogram data={histogramData}/> */}
        <ProgressRing/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor,
  },
  parent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    columnGap: 15,
    rowGap: 15,
  },
});