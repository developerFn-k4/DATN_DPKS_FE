import React from 'react';

const HomeBanner: React.FC = () => {
  return (
    <section className="w-full px-6 md:px-12 py-16 bg-white">
      <div className="relative w-full h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl group">
        <img 
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1920" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          alt="Summer Vacation"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent flex flex-col items-start justify-center text-left px-12 md:px-24">
          <h2 className="text-white text-4xl md:text-7xl font-black mb-6 leading-[1.1] drop-shadow-2xl">
            Trải Nghiệm Kỳ Nghỉ <br/> Tuyệt Vời Của Bạn
          </h2>
          <p className="text-white/90 text-xl mb-10 max-w-xl font-light">
            Giảm giá tới 30% cho các dịch vụ nghỉ dưỡng cao cấp tại các thành phố biển trong mùa hè này.
          </p>
          <button className="bg-white text-slate-900 hover:!bg-emerald-600 hover:text-white font-bold py-5 px-14 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl text-lg">
            Khám Phá Ưu Đãi
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;