import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";

export default function useLiveAnalytics({ zone, date }) {
  const [ridersData, setRidersData] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);

    // DAILY RIDERS
    let ridersQuery = supabase.from("daily_riders").select("*");
    if (zone) ridersQuery = ridersQuery.eq("zone", zone);
    if (date) ridersQuery = ridersQuery.eq("date", date);

    const { data: riders } = await ridersQuery;

    // EARNINGS
    let earningsQuery = supabase.from("daily_earnings").select("*");
    if (date) earningsQuery = earningsQuery.eq("date", date);

    const { data: earnings } = await earningsQuery;

    // ZONE DISTRIBUTION
    const { data: zones } = await supabase
      .from("riders")
      .select("zone, count:zone", { group: "zone" });

    setRidersData(riders || []);
    setEarningsData(earnings || []);
    setZoneData(zones || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();

    const channel = supabase
      .channel("analytics-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "riders" },
        fetchAnalytics
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rentals" },
        fetchAnalytics
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [zone, date]);

  return { ridersData, earningsData, zoneData, loading };
}
