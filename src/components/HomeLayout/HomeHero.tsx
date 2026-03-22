import React, { useState } from 'react';

const HomeHero: React.FC = () => {
    // Quản lý state cho các ô nhập mới
    const [searchData, setSearchData] = useState({
        roomType: '',
        checkIn: '',
        checkOut: '',
        adults: 1,
        children: 0,
        rooms: 1
    });

    return (
        <div className="w-full">
            {/* Banner Section */}
            <div className="relative h-[450px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920")' }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Đặt Phòng Khách Sạn VietStay</h1>
                    <p className="text-lg opacity-90 font-light">Trải nghiệm không gian 5 sao đẳng cấp</p>
                </div>
            </div>

            {/* Search Form Section - Cấu trúc lại để chứa nhiều input */}
            <div className="max-w-[1400px] mx-auto -mt-20 relative z-20 px-6">
                <form className="bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col gap-6">
                    
                    {/* Hàng 1: Loại phòng và Ngày tháng */}
                    <div className="flex flex-wrap lg:flex-nowrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-[11px] font-black text-blue-600 uppercase ml-1 mb-1 block tracking-wider">Loại phòng</label>
                            <select className="w-full p-3.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium">
                                <option value="">-- Chọn loại phòng --</option>
                                <option value="suite">Phòng Suite</option>
                                <option value="deluxe">Phòng Deluxe</option>
                            </select>
                        </div>
                        
                        <div className="w-full md:w-1/2 lg:w-48">
                            <label className="text-[11px] font-black text-blue-600 uppercase ml-1 mb-1 block tracking-wider">Ngày nhận</label>
                            <input type="date" className="w-full p-3.5 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                        </div>
                        
                        <div className="w-full md:w-1/2 lg:w-48">
                            <label className="text-[11px] font-black text-blue-600 uppercase ml-1 mb-1 block tracking-wider">Ngày trả</label>
                            <input type="date" className="w-full p-3.5 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                        </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-4 items-end pt-2 border-t border-gray-50">
                        <div className="w-full md:flex-1 grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-[11px] font-black text-gray-400 uppercase ml-1 mb-1 block tracking-wider">Người lớn</label>
                                <select className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold">
                                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} người</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-gray-400 uppercase ml-1 mb-1 block tracking-wider">Trẻ em</label>
                                <select className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold">
                                    {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} trẻ em</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-gray-400 uppercase ml-1 mb-1 block tracking-wider">Số phòng</label>
                                <select className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold">
                                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} phòng</option>)}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="w-full md:w-auto !bg-blue-600 hover:bg-red-600 text-white px-12 py-4 rounded-xl font-black transition-all shadow-xl shadow-blue-100 uppercase text-sm tracking-widest active:scale-95">
                            Tìm phòng ngay
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomeHero;