import { motion } from "framer-motion";

export default function Loader({ message = "Loading..." }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col items-center justify-center py-12"
    >
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-500 border-t-transparent mb-4" />
      <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
    </motion.div>
  );
}
