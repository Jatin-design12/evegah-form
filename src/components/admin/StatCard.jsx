import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4 hover:shadow-lg transition"
    >
      <div className="w-12 h-12 flex items-center justify-center bg-purple-100 text-purple-600 rounded-lg">
        <Icon size={28} />
      </div>

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </motion.div>
  );
}
