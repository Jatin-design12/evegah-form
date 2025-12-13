import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";

export default function useRiderAnalytics() {
  const [totalRiders, setTotalRiders] = useState(0);
  const [activeRiders, setActiveRiders] = useState(0);
  const [suspendedRiders, setSuspendedRiders] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const [zoneStats, setZoneStats] = useState([]);

  useEffect(() => {
    loadStats();
    loadZoneStats();
  }, []);

  async function loadStats() {
    const { count: total } = await supabase
      .from("riders")
      .select("*", { count: "exact" });

    const { count: active } = await supabase
      .from("riders")
      .select("*", { count: "exact" })
      .eq("status", "active");

    const { count: suspended } = await supabase
      .from("riders")
      .select("*", { count: "exact" })
      .eq("status", "suspended");

    const { count: rides } = await supabase
      .from("rentals")
      .select("*", { count: "exact" });

    setTotalRiders(total || 0);
    setActiveRiders(active || 0);
    setSuspendedRiders(suspended || 0);
    setTotalRides(rides || 0);
  }

  async function loadZoneStats() {
    const { data, error } = await supabase
      .from("rentals")
      .select("zone");

    if (error || !data) {
      console.error("Zone stats error", error);
      setZoneStats([]);
      return;
    }

    const grouped = {};

    data.forEach((r) => {
      if (!r.zone) return;
      grouped[r.zone] = (grouped[r.zone] || 0) + 1;
    });

    setZoneStats(
      Object.entries(grouped).map(([zone, value]) => ({
        zone,
        value,
      }))
    );
  }

  return {
    totalRiders,
    activeRiders,
    suspendedRiders,
    totalRides,
    zoneStats,
  };
}
