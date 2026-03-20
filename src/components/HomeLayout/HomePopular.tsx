import React from 'react';

const hotels = [
  { id: 1, name: 'Grand City Hotel', price: '1.500.000', rating: 4.6, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'Beach Resort Nha Trang', price: '2.700.000', rating: 4.7, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600' },
  { id: 3, name: 'Mountain View Retreat', price: '1.100.000', rating: 4.7, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600' },
  { id: 4, name: 'Luxe Paradise Villa', price: '3.800.000', rating: 4.8, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600' },
];

const HomePopular: React.FC = () => {
  return (
    <section className="w-full px-6 md:px-12 py-20 bg-white" id="popular">
      <div className="flex justify-between items-end mb-12 w-full">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Gợi ý cho bạn</h2>
        <a href="#" className="text-blue-600 font-bold hover:underline text-lg">Xem tất cả &rsaquo;</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="group cursor-pointer w-full">
            <div className="relative overflow-hidden rounded-[2rem] h-80 mb-4 shadow-lg w-full">
               <img src={hotel.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-1">{hotel.name}</h3>
            <div className="text-emerald-600 font-bold text-2xl mb-1">{hotel.price} đ <span className="text-gray-400 text-sm font-normal">/ đêm</span></div>
            <div className="text-sm font-medium text-emerald-600">{hotel.rating} ★ Tuyệt vời</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomePopular;