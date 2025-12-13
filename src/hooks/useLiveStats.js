import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";

export function useLiveStats() {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    retained: 0,
    returned: 0,
    earnings: 0
  });

  const fetchStats = async () => {
    const { count: total } = await supabase
      .from("riders")
      .select("*", { count: "exact", head: true });

    const { count: retained } = await supabase
      .from("riders")
      .select("*", { count: "exact", head: true })
      .eq("rider_type", "retain");

    const { count: returned } = await supabase
      .from("returns")
      .select("*", { count: "exact", head: true });

    const { data: earnings } = await supabase
      .from("rentals")
      .select("rental_amount");

    const totalEarnings =
      earnings?.reduce((sum, r) => sum + Number(r.rental_amount || 0), 0) || 0;

    setStats({
      total,
      new: total - retained,
      retained,
      returned,
      earnings: totalEarnings
    });
  };

  useEffect(() => {
    fetchStats();

    const channel = supabase
      .channel("stats-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "riders" },
        fetchStats
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rentals" },
        fetchStats
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "returns" },
        fetchStats
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return stats;
}
