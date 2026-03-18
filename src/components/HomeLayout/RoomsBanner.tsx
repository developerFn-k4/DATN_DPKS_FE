import { motion } from "framer-motion";

export function RoomsBanner() {
    return (
        <section className="relative overflow-hidden min-h-[400px] md:min-h-[450px]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=600&fit=crop" 
                    alt="Hotel Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-24">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold leading-tight md:text-5xl text-white">
                        Đặt Phòng Hoàn Hảo
                    </h1>
                    <p className="mt-3 text-lg text-white/90">
                        Trải nghiệm không gian 5 sao đẳng cấp
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
