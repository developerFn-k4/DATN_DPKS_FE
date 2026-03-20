import React from 'react';
import { 
  EnvironmentOutlined, 
  SafetyCertificateOutlined, 
  ThunderboltOutlined, 
  CustomerServiceOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const HomeFeatures: React.FC = () => {
  const features = [
    {
      icon: <EnvironmentOutlined className="text-3xl text-blue-600" />,
      title: "Vị Trí Đắc Địa",
      desc: "Nằm ngay trung tâm thủ đô Hà Nội, thuận tiện di chuyển đến các điểm tham quan nổi tiếng."
    },
    {
      icon: <SafetyCertificateOutlined className="text-3xl text-emerald-600" />,
      title: "Tiêu Chuẩn 5 Sao",
      desc: "Dịch vụ đẳng cấp quốc tế với đội ngũ nhân viên chuyên nghiệp, tận tâm phục vụ 24/7."
    },
    {
      icon: <ThunderboltOutlined className="text-3xl text-amber-500" />,
      title: "Tiện Nghi Hiện Đại",
      desc: "Hệ thống phòng nghỉ thông minh, Wifi tốc độ cao và hồ bơi vô cực ngắm nhìn toàn cảnh thành phố."
    }
  ];

  return (
    <div className="w-full px-6 md:px-12 py-20 bg-slate-50" id="features">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-800 mb-4 uppercase tracking-tight">
          Tại sao nên chọn VietStay Hà Nội?
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Chúng tôi mang đến trải nghiệm lưu trú hoàn hảo với sự kết hợp giữa nét truyền thống Hà Thành và tiện nghi hiện đại.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((item, index) => (
          <div 
            key={index} 
            className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white hover:-translate-y-2 transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
              {item.icon}
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-4">{item.title}</h4>
            <p className="text-slate-500 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Phần banner phụ giới thiệu về Hà Nội (Nếu cần) */}
      <div className="mt-16 w-full bg-blue-600 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
        <div className="max-w-xl">
          <h3 className="text-3xl font-bold mb-4">Bạn đã sẵn sàng khám phá Thủ Đô?</h3>
          <p className="text-blue-100 opacity-90">
            VietStay luôn có những ưu đãi đặc biệt dành cho khách hàng đặt phòng trực tuyến. Hãy để chúng tôi làm phần còn lại cho chuyến đi của bạn.
          </p>
        </div>
        <Link to="/rooms">
          <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-yellow-400 hover:text-slate-900 transition-all shadow-xl uppercase tracking-widest text-sm shrink-0">
          Xem danh sách loại phòng
        </button>
        </Link>
      
      </div>
    </div>
  );
};

export default HomeFeatures;