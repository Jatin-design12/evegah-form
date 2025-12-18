import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import StatCard from "../../components/admin/StatCard";
import { apiFetch } from "../../config/api";

import {
	Menu,
	Search,
	Moon,
	Bell,
	Globe,
	Users,
	Bike,
	IndianRupee,
	Clock,
} from "lucide-react";

import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	AreaChart,
	Area,
	PieChart,
	Pie,
	Cell,
} from "recharts";

import {
	adminBatterySwapsDaily,
	adminBatterySwapsTopBatteries,
	adminBatterySwapsTopVehicles,
	adminBatterySwapsLatestByVehicle,
	adminDeleteBatterySwap,
	adminListBatterySwaps,
	adminUpdateBatterySwap,
} from "../../utils/adminBatterySwaps";

const PIE_COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

export default function AdminDashboard() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [stats, setStats] = useState([
		{ title: "Total Riders", value: "-", icon: Users },
		{ title: "Total Rentals", value: "-", icon: Bike },
		{ title: "Revenue", value: "-", icon: IndianRupee },
		{ title: "Active Rides", value: "-", icon: Clock },
	]);

	const [revenueData, setRevenueData] = useState([]);
	const [rentalsData, setRentalsData] = useState([]);
	const [returnsData, setReturnsData] = useState([]);
	const [rentalsByPackageData, setRentalsByPackageData] = useState([]);
	const [rentalsByZoneData, setRentalsByZoneData] = useState([]);
	const [batterySwaps, setBatterySwaps] = useState([]);
	const [batterySwapsDailyData, setBatterySwapsDailyData] = useState([]);
	const [batteryTopBatteriesData, setBatteryTopBatteriesData] = useState([]);
	const [batteryTopVehiclesData, setBatteryTopVehiclesData] = useState([]);
	const [latestVehicleBatteries, setLatestVehicleBatteries] = useState([]);
	const [swapSearch, setSwapSearch] = useState("");
	const [swapRefresh, setSwapRefresh] = useState(0);
	const [editingSwapId, setEditingSwapId] = useState("");
	const [swapDraft, setSwapDraft] = useState(null);
	const [swapBusy, setSwapBusy] = useState(false);
	const [recentUsers, setRecentUsers] = useState([]);
	const [activeRentals, setActiveRentals] = useState([]);

	const inr = useMemo(
		() => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }),
		[]
	);

	const formatDuration = (startTime) => {
		const start = startTime ? new Date(startTime).getTime() : 0;
		if (!start) return "-";
		const mins = Math.max(0, Math.floor((Date.now() - start) / 60000));
		if (mins < 60) return `${mins} mins`;
		const hours = Math.floor(mins / 60);
		const rem = mins % 60;
		return rem ? `${hours}h ${rem}m` : `${hours}h`;
	};

	const toDateTimeLocal = (value) => {
		if (!value) return "";
		const d = new Date(value);
		if (Number.isNaN(d.getTime())) return "";
		const pad = (n) => String(n).padStart(2, "0");
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
			d.getHours()
		)}:${pad(d.getMinutes())}`;
	};

	useEffect(() => {
		let mounted = true;

		const load = async () => {
			setLoading(true);
			setError("");
			try {
				const [
					summary,
					recentRiders,
					activeRows,
					revenueSeries,
					rentalsSeries,
					returnsSeries,
					packageSeries,
					zoneSeries,
					swapRows,
					swapDaily,
					topBatteries,
					topVehicles,
					latestByVehicle,
				] =
					await Promise.all([
						apiFetch("/api/dashboard/summary"),
						apiFetch("/api/dashboard/recent-riders?limit=3"),
						apiFetch("/api/dashboard/active-rentals?limit=5"),
						apiFetch("/api/dashboard/revenue-months?months=6"),
						apiFetch("/api/dashboard/rentals-week"),
						apiFetch("/api/dashboard/returns-week"),
						apiFetch("/api/dashboard/rentals-by-package?days=30"),
						apiFetch("/api/dashboard/rentals-by-zone?days=30"),
						adminListBatterySwaps({ limit: 10, search: swapSearch }).catch(() => []),
						adminBatterySwapsDaily({ days: 14 }).catch(() => []),
						adminBatterySwapsTopBatteries({ days: 30, limit: 5 }).catch(() => []),
						adminBatterySwapsTopVehicles({ days: 30, limit: 10 }).catch(() => []),
						adminBatterySwapsLatestByVehicle({ limit: 10 }).catch(() => []),
					]);

				if (!mounted) return;

				setStats([
					{ title: "Total Riders", value: inr.format(Number(summary?.totalRiders || 0)), icon: Users },
					{ title: "Total Rentals", value: inr.format(Number(summary?.totalRentals || 0)), icon: Bike },
					{ title: "Revenue", value: `₹${inr.format(Number(summary?.revenue || 0))}`, icon: IndianRupee },
					{ title: "Active Rides", value: inr.format(Number(summary?.activeRides || 0)), icon: Clock },
				]);

				setRevenueData(Array.isArray(revenueSeries) ? revenueSeries : []);
				setRentalsData(Array.isArray(rentalsSeries) ? rentalsSeries : []);
				setReturnsData(Array.isArray(returnsSeries) ? returnsSeries : []);
				setRentalsByPackageData(Array.isArray(packageSeries) ? packageSeries : []);
				setRentalsByZoneData(Array.isArray(zoneSeries) ? zoneSeries : []);
				setBatterySwaps(Array.isArray(swapRows) ? swapRows : []);
				setBatterySwapsDailyData(Array.isArray(swapDaily) ? swapDaily : []);
				setBatteryTopBatteriesData(Array.isArray(topBatteries) ? topBatteries : []);
				setBatteryTopVehiclesData(Array.isArray(topVehicles) ? topVehicles : []);
				setLatestVehicleBatteries(Array.isArray(latestByVehicle) ? latestByVehicle : []);
				setRecentUsers(
					(Array.isArray(recentRiders) ? recentRiders : []).map((r) => ({
						name: r?.full_name || "-",
						mobile: r?.mobile || "-",
					}))
				);
				setActiveRentals(
					(Array.isArray(activeRows) ? activeRows : []).map((r) => ({
						id: r?.id,
						user: r?.full_name || "-",
						vehicle: r?.vehicle_number || "-",
						duration: formatDuration(r?.start_time),
					}))
				);
			} catch (e) {
				if (!mounted) return;
				setError(String(e?.message || e || "Unable to load dashboard"));
			} finally {
				if (mounted) setLoading(false);
			}
		};

		load();

		const interval = setInterval(load, 15000);
		return () => {
			mounted = false;
			clearInterval(interval);
		};
	}, [inr, swapSearch, swapRefresh]);

	const fmtSwapTime = (value) => {
		if (!value) return "-";
		const d = new Date(value);
		if (Number.isNaN(d.getTime())) return "-";
		return d.toLocaleString("en-GB");
	};

	const startEditSwap = (row) => {
		setEditingSwapId(String(row?.id || ""));
		setSwapDraft({
			vehicle_number: row?.vehicle_number || "",
			battery_out: row?.battery_out || "",
			battery_in: row?.battery_in || "",
			swapped_at: toDateTimeLocal(row?.swapped_at || row?.created_at),
			notes: row?.notes || "",
			employee_email: row?.employee_email || "",
			employee_uid: row?.employee_uid || "",
		});
	};

	const cancelEditSwap = () => {
		setEditingSwapId("");
		setSwapDraft(null);
	};

	const saveSwap = async (id) => {
		if (!id || !swapDraft) return;
		setSwapBusy(true);
		try {
			const swappedAtIso = swapDraft.swapped_at ? new Date(swapDraft.swapped_at).toISOString() : null;
			const updated = await adminUpdateBatterySwap(id, {
				vehicle_number: swapDraft.vehicle_number,
				battery_out: swapDraft.battery_out,
				battery_in: swapDraft.battery_in,
				swapped_at: swappedAtIso,
				notes: swapDraft.notes,
				employee_email: swapDraft.employee_email,
				employee_uid: swapDraft.employee_uid,
			});
			setBatterySwaps((prev) =>
				(prev || []).map((r) => (String(r?.id) === String(id) ? { ...r, ...(updated || {}) } : r))
			);
			cancelEditSwap();
			setSwapRefresh((x) => x + 1);
		} catch (e) {
			setError(String(e?.message || e || "Unable to update swap"));
		} finally {
			setSwapBusy(false);
		}
	};

	const deleteSwap = async (id) => {
		if (!id) return;
		const ok = window.confirm("Delete this battery swap?");
		if (!ok) return;
		setSwapBusy(true);
		try {
			await adminDeleteBatterySwap(id);
			setBatterySwaps((prev) => (prev || []).filter((r) => String(r?.id) !== String(id)));
			if (String(editingSwapId) === String(id)) cancelEditSwap();
			setSwapRefresh((x) => x + 1);
		} catch (e) {
			setError(String(e?.message || e || "Unable to delete swap"));
		} finally {
			setSwapBusy(false);
		}
	};

	return (
		<div className="flex min-h-screen bg-evegah-bg">
			<AdminSidebar />

			<div className="flex-1 p-6">
				{/* Topbar */}
				<div className="sticky top-0 z-10 mb-6 flex items-center justify-between gap-4 rounded-2xl border border-evegah-border bg-white/80 px-4 py-3 shadow-card backdrop-blur">
					<div className="flex items-center gap-3 min-w-0">
						<button
							type="button"
							className="w-10 h-10 rounded-xl border border-evegah-border bg-white grid place-items-center text-gray-700"
							aria-label="Menu"
						>
							<Menu size={18} />
						</button>

						<div className="hidden sm:flex items-center gap-2 rounded-xl border border-evegah-border bg-white px-3 py-2 min-w-[320px]">
							<Search size={16} className="text-gray-400" />
							<input className="w-full bg-transparent text-sm outline-none" placeholder="Search" />
						</div>
					</div>

					<div className="flex items-center gap-2">
						<button
							type="button"
							className="w-10 h-10 rounded-xl grid place-items-center text-gray-600 hover:bg-gray-100"
							aria-label="Theme"
						>
							<Moon size={18} />
						</button>
						<button
							type="button"
							className="w-10 h-10 rounded-xl grid place-items-center text-gray-600 hover:bg-gray-100"
							aria-label="Notifications"
						>
							<Bell size={18} />
						</button>
						<button
							type="button"
							className="w-10 h-10 rounded-xl grid place-items-center text-gray-600 hover:bg-gray-100"
							aria-label="Language"
						>
							<Globe size={18} />
						</button>
						<div className="w-10 h-10 rounded-xl bg-gray-200" aria-hidden="true" />
					</div>
				</div>

				<div className="mb-6">
					<h1 className="text-2xl font-semibold text-evegah-text">Dashboard</h1>
					<p className="text-sm text-evegah-muted">Overview of riders, rentals, and revenue.</p>
				</div>

				{error ? (
					<div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{error}
					</div>
				) : null}

				{/* KPI cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
					{stats.map((item, i) => (
						<StatCard key={i} title={item.title} value={item.value} icon={item.icon} />
					))}
				</div>

				{/* Main grid */}
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
					<div className="xl:col-span-2 bg-evegah-card border border-evegah-border shadow-card rounded-2xl p-6">
						<div className="flex items-center justify-between gap-4 mb-4">
							<h2 className="text-base font-semibold text-evegah-text">Revenue Overview</h2>
							<div className="flex items-center gap-2">
								<button type="button" className="px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-50 text-blue-700">
									24 hours
								</button>
								<button type="button" className="px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100">
									30 days
								</button>
								<button type="button" className="px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100">
									1 year
								</button>
							</div>
						</div>

						<div className="text-blue-600">
							<ResponsiveContainer width="100%" height={260}>
								<LineChart data={revenueData}>
									<Line type="monotone" dataKey="revenue" stroke="currentColor" strokeWidth={3} dot={false} />
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip />
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>

					<div className="bg-evegah-card border border-evegah-border shadow-card rounded-2xl p-6">
						<div className="flex items-center justify-between gap-4 mb-4">
							<h2 className="text-base font-semibold text-evegah-text">Weekly Rentals</h2>
							<button type="button" className="text-xs font-medium text-gray-600 hover:text-gray-900">
								Download
							</button>
						</div>

						<div className="text-blue-600">
							<ResponsiveContainer width="100%" height={260}>
								<BarChart data={rentalsData}>
									<Bar dataKey="rentals" fill="currentColor" radius={[8, 8, 0, 0]} />
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="day" />
									<YAxis />
									<Tooltip />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					<div className="bg-evegah-card border border-evegah-border shadow-card rounded-2xl p-6">
						<div className="flex items-center justify-between gap-4 mb-4">
							<h2 className="text-base font-semibold text-evegah-text">Recent Users</h2>
							<span className="text-xs text-evegah-muted">History</span>
						</div>

						<div className="space-y-3">
							{recentUsers.map((u, i) => (
								<div key={i} className="rounded-2xl border border-evegah-border bg-white p-4">
									<div className="text-sm font-semibold text-evegah-text">{u.name}</div>
									<div className="text-xs text-evegah-muted">{u.mobile}</div>
								</div>
							))}
						</div>
					</div>

					<div className="xl:col-span-2 bg-evegah-card border border-evegah-border shadow-card rounded-2xl p-6">
						<div className="flex items-center justify-between gap-4 mb-4">
							<h2 className="text-base font-semibold text-evegah-text">Active Rentals</h2>
							<span className="text-xs text-evegah-muted">Live</span>
						</div>

						<div className="divide-y divide-evegah-border">
							{activeRentals.map((r, i) => (
								<div key={i} className="flex items-center justify-between gap-4 py-4">
									<div>
										<div className="text-sm font-semibold text-evegah-text">{r.user}</div>
										<div className="text-xs text-evegah-muted">
											{r.vehicle} • {r.id}
										</div>
									</div>
									<div className="text-sm font-semibold text-blue-700">{r.duration}</div>
								</div>
							))}

							{loading && activeRentals.length === 0 ? (
								<div className="py-4 text-sm text-evegah-muted">Loading...</div>
							) : null}
						</div>
					</div>

					<div className="bg-evegah-card border border-evegah-border shadow-card rounded-2xl p-6">
						<div className="flex items-center justify-between gap-4 mb-4">
							<h2 className="text-base font-semibold text-evegah-text">Rentals by Package (30 Days)</h2>
							<span className="text-xs text-evegah-muted">Breakdown</span>
						</div>

						<div className="text-blue-600">
							<ResponsiveContainer width="100%" height={260}>
								<BarChart data={rentalsByPackageData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="package" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="rentals" fill="currentColor" radius={[8, 8, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					<div className="bg-evegah-card border border-evegah-border shadow-card rounded-2xl p-6">
						<div className="flex items-center justify-between gap-4 mb-4">
							<h2 className="text-base font-semibold text-evegah-text">Returns This Week</h2>
							<span className="text-xs text-evegah-muted">Trend</span>
						</div>

						<div className="text-blue-600">
							<ResponsiveContainer width="100%" height={260}>
								<BarChart data={returnsData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="day" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="returns" fill="currentColor" radius={[8, 8, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					<div className="bg-evegah-card border border-evegah-border shadow-card rounded-2xl p-6">
						<div className="flex items-center justify-between gap-4 mb-4">
							<h2 className="text-base font-semibold text-evegah-text">Rentals by Zone (30 Days)</h2>
							<span className="text-xs text-evegah-muted">Distribution</span>
						</div>

						<div className="text-blue-600">
							<ResponsiveContainer width="100%" height={260}>
								<BarChart data={rentalsByZoneData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="zone" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="rentals" fill="currentColor" radius={[8, 8, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					<div className="xl:col-span-2 bg-evegah-card border border-evegah-border shadow-card rounded-2xl p-6">
						<div className="flex items-center justify-between gap-4 mb-4">
							<h2 className="text-base font-semibold text-evegah-text">Battery Swaps (14 Days)</h2>
							<span className="text-xs text-evegah-muted">Area</span>
						</div>

						<div className="text-blue-600">
							<ResponsiveContainer width="100%" height={260}>
								<AreaChart data={batterySwapsDailyData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="day" />
									<YAxis />
									<Tooltip />
									<Area type="monotone" dataKey="swaps" stroke="currentColor" fill="currentColor" fillOpacity={0.18} strokeWidth={2} />
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</div>

					<div className="bg-evegah-card border border-evegah-border shadow-card rounded-2xl p-6">
						<div className="flex items-center justify-between gap-4 mb-4">
							<h2 className="text-base font-semibold text-evegah-text">Top Batteries (30 Days)</h2>
							<span className="text-xs text-evegah-muted">Pie</span>
						</div>

						<ResponsiveContainer width="100%" height={260}>
							<PieChart>
								<Pie
									data={batteryTopBatteriesData}
									dataKey="installs"
									nameKey="battery_id"
									outerRadius={90}
									label
								>
									{(batteryTopBatteriesData || []).map((_, index) => (
										<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>

					<div className="xl:col-span-3 bg-evegah-card border border-evegah-border shadow-card rounded-2xl p-6">
						<div className="flex items-center justify-between gap-4 mb-4">
							<h2 className="text-base font-semibold text-evegah-text">Battery Swaps</h2>
							<div className="flex items-center gap-2">
								<input
									value={swapSearch}
									onChange={(e) => setSwapSearch(e.target.value)}
									placeholder="Search vehicle / battery / rider / employee"
									className="input w-[260px]"
								/>
								<button
									type="button"
									className="btn-primary"
									disabled={swapBusy}
									onClick={() => setSwapRefresh((x) => x + 1)}
								>
									Refresh
								</button>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
							<div className="rounded-2xl border border-evegah-border bg-white p-4">
								<div className="flex items-center justify-between gap-3 mb-3">
									<div>
										<div className="text-sm font-semibold text-evegah-text">Swap Frequency per Vehicle</div>
										<div className="text-xs text-evegah-muted">Top vehicles (30 days)</div>
									</div>
								</div>
								<div className="overflow-x-auto">
									<table className="min-w-full text-sm">
										<thead>
											<tr className="text-left text-evegah-muted">
												<th className="py-2 pr-3">Vehicle</th>
												<th className="py-2 pr-3">Swaps</th>
												<th className="py-2 pr-3">Last Swap</th>
												<th className="py-2">Current Battery</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-evegah-border">
											{(batteryTopVehiclesData || []).length === 0 ? (
												<tr>
													<td className="py-3 text-evegah-muted" colSpan={4}>
														No vehicle swap data.
													</td>
												</tr>
											) : (
												(batteryTopVehiclesData || []).map((v) => (
													<tr key={v.vehicle_number}>
														<td className="py-2 pr-3 whitespace-nowrap">{v.vehicle_number}</td>
														<td className="py-2 pr-3">{v.swaps}</td>
														<td className="py-2 pr-3 whitespace-nowrap text-evegah-muted">{fmtSwapTime(v.last_swapped_at)}</td>
														<td className="py-2 whitespace-nowrap">{v.battery_in || "-"}</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>

							<div className="rounded-2xl border border-evegah-border bg-white p-4">
								<div className="flex items-center justify-between gap-3 mb-3">
									<div>
										<div className="text-sm font-semibold text-evegah-text">Latest Battery per Vehicle</div>
										<div className="text-xs text-evegah-muted">Most recent swap (current battery = Battery IN)</div>
									</div>
								</div>
								<div className="overflow-x-auto">
									<table className="min-w-full text-sm">
										<thead>
											<tr className="text-left text-evegah-muted">
												<th className="py-2 pr-3">Vehicle</th>
												<th className="py-2 pr-3">Battery IN</th>
												<th className="py-2 pr-3">Battery OUT</th>
												<th className="py-2">Swapped At</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-evegah-border">
											{(latestVehicleBatteries || []).length === 0 ? (
												<tr>
													<td className="py-3 text-evegah-muted" colSpan={4}>
														No latest vehicle battery data.
													</td>
												</tr>
											) : (
												(latestVehicleBatteries || []).map((row) => (
													<tr key={row.id}>
														<td className="py-2 pr-3 whitespace-nowrap">{row.vehicle_number}</td>
														<td className="py-2 pr-3 whitespace-nowrap">{row.battery_in || "-"}</td>
														<td className="py-2 pr-3 whitespace-nowrap">{row.battery_out || "-"}</td>
														<td className="py-2 whitespace-nowrap text-evegah-muted">{fmtSwapTime(row.swapped_at)}</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="text-left text-evegah-muted">
										<th className="py-2 pr-3">Time</th>
										<th className="py-2 pr-3">Rider</th>
										<th className="py-2 pr-3">Mobile</th>
										<th className="py-2 pr-3">Vehicle</th>
										<th className="py-2 pr-3">Battery Out</th>
										<th className="py-2 pr-3">Battery In</th>
										<th className="py-2 pr-3">Employee</th>
										<th className="py-2 pr-3">Notes</th>
										<th className="py-2">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-evegah-border">
									{(batterySwaps || []).map((row) => {
										const isEditing = String(editingSwapId) === String(row?.id);
										return (
											<tr key={row?.id} className="align-top">
												<td className="py-3 pr-3 whitespace-nowrap">
													{isEditing ? (
														<input
															type="datetime-local"
															className="input"
															value={swapDraft?.swapped_at || ""}
															onChange={(e) => setSwapDraft((p) => ({ ...(p || {}), swapped_at: e.target.value }))}
														/>
													) : (
														new Date(row?.swapped_at || row?.created_at).toLocaleString()
													)}
												</td>
												<td className="py-3 pr-3">
													{row?.rider_full_name || "-"}
												</td>
												<td className="py-3 pr-3 whitespace-nowrap">
													{row?.rider_mobile || "-"}
												</td>
												<td className="py-3 pr-3">
													{isEditing ? (
														<input
															className="input"
															value={swapDraft?.vehicle_number || ""}
															onChange={(e) => setSwapDraft((p) => ({ ...(p || {}), vehicle_number: e.target.value }))}
														/>
													) : (
														row?.vehicle_number || "-"
													)}
												</td>
												<td className="py-3 pr-3">
													{isEditing ? (
														<input
															className="input"
															value={swapDraft?.battery_out || ""}
															onChange={(e) => setSwapDraft((p) => ({ ...(p || {}), battery_out: e.target.value }))}
														/>
													) : (
														row?.battery_out || "-"
													)}
												</td>
												<td className="py-3 pr-3">
													{isEditing ? (
														<input
															className="input"
															value={swapDraft?.battery_in || ""}
															onChange={(e) => setSwapDraft((p) => ({ ...(p || {}), battery_in: e.target.value }))}
														/>
													) : (
														row?.battery_in || "-"
													)}
												</td>
												<td className="py-3 pr-3">
													{isEditing ? (
														<div className="space-y-2">
															<input
																className="input"
																placeholder="employee email"
																value={swapDraft?.employee_email || ""}
																onChange={(e) => setSwapDraft((p) => ({ ...(p || {}), employee_email: e.target.value }))}
															/>
															<input
																className="input"
																placeholder="employee uid"
																value={swapDraft?.employee_uid || ""}
																onChange={(e) => setSwapDraft((p) => ({ ...(p || {}), employee_uid: e.target.value }))}
															/>
														</div>
													) : (
														row?.employee_email || row?.employee_uid || "-"
													)}
												</td>
												<td className="py-3 pr-3 max-w-[280px]">
													{isEditing ? (
														<textarea
															className="textarea h-[78px]"
															value={swapDraft?.notes || ""}
															onChange={(e) => setSwapDraft((p) => ({ ...(p || {}), notes: e.target.value }))}
														/>
													) : (
														row?.notes || "-"
													)}
												</td>
												<td className="py-3 whitespace-nowrap">
													{isEditing ? (
														<div className="flex items-center gap-2">
															<button type="button" className="btn-primary" disabled={swapBusy} onClick={() => saveSwap(row?.id)}>
																Save
															</button>
															<button type="button" className="btn-muted" disabled={swapBusy} onClick={cancelEditSwap}>
																Cancel
															</button>
														</div>
													) : (
														<div className="flex items-center gap-2">
															<button type="button" className="btn-outline" disabled={swapBusy} onClick={() => startEditSwap(row)}>
																Edit
															</button>
															<button type="button" className="btn-muted" disabled={swapBusy} onClick={() => deleteSwap(row?.id)}>
																Delete
															</button>
														</div>
													)}
												</td>
											</tr>
										);
									})}

									{loading && (batterySwaps || []).length === 0 ? (
										<tr>
											<td className="py-3 text-evegah-muted" colSpan={7}>
												Loading...
											</td>
										</tr>
									) : null}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

}
