supabase
  .from("battery_swaps")
  .select("*")
  .eq("user_uid", auth.currentUser.uid)
  .order("swapped_at", { ascending: false });
