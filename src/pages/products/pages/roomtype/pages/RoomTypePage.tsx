import React from 'react';
import { RoomCard } from '../components/RoomCard';
import { useRoomTypes } from '../hooks/roomTypeHook';
import { HomeHeader } from '../../../../../components/Header/HomeHeader';
import { HomeFooter } from '../../../../../components/Footer/HomeFooter';
import HomeHero from '../../../../../components/HomeLayout/HomeHero';

const RoomList: React.FC = () => {
  const { rooms, loading, error, searchInfo } = useRoomTypes();

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      <HomeHeader />
      <HomeHero />
      <div className="w-full bg-gray-50 min-h-screen py-8">

        {/* Banner kết quả tìm kiếm */}
        {searchInfo && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <span className="font-bold">Kết quả tìm kiếm:</span>{' '}
            Nhận phòng <strong>{formatDate(searchInfo.check_in)}</strong> → Trả phòng <strong>{formatDate(searchInfo.check_out)}</strong>
            {' '}({searchInfo.nights} đêm) · {searchInfo.adults} người lớn
            {searchInfo.children > 0 && ` · ${searchInfo.children} trẻ em`}
            {' '}· {searchInfo.quantity_rooms} phòng
            <span className="ml-2 text-blue-600 font-bold">— {rooms.length} loại phòng phù hợp</span>
          </div>
        )}

        <header className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Chọn loại phòng</h1>
          <p className="text-gray-500 text-sm">Vui lòng chọn phòng phù hợp với nhu cầu của bạn</p>
        </header>

        {loading && <div className="text-center py-10 italic">Đang tải danh sách phòng...</div>}
        {error && <div className="text-red-500 text-center py-10">Lỗi: {error}</div>}

        {!loading && !error && (
          <div className="flex flex-col">
            {rooms.length > 0 ? (
              rooms.map(room => (
                <RoomCard key={room.room_type_id} room={room} />
              ))
            ) : (
              <div className="text-center py-20 text-gray-400">
                {searchInfo ? 'Không tìm thấy phòng phù hợp với tiêu chí tìm kiếm.' : 'Không tìm thấy loại phòng nào.'}
              </div>
            )}
          </div>
        )}
      </div>
      <HomeFooter />
    </>
  );
};

export default RoomList;
