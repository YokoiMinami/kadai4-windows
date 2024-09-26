import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AttendanceTablePage = ({ month }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const accounts_id = localStorage.getItem('user'); // ログインユーザーのIDを取得
      try {
        const response = await fetch(`http://localhost:3000/attendance/${accounts_id}/${month}`);
        const data = await response.json();
        setAttendanceData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setAttendanceData([]);
      }
    };
    fetchAttendance();
  }, [month]);

  useEffect(() => {
    const getDaysInMonth = (year, month) => {
      const date = new Date(year, month, 1);
      const days = [];
      while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return days;
    };

    const currentYear = new Date().getFullYear();
    const days = getDaysInMonth(currentYear, month - 1); // monthは1-12の範囲なので-1する
    setDaysInMonth(days);
  }, [month]);

  const getDayOfWeek = (date) => {
    return date.toLocaleDateString('ja-JP', { weekday: 'long' });
  };

  const findAttendanceRecord = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return attendanceData.find(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === formattedDate;
    });
  };

  return (
    <div>
      <h1>勤怠一覧</h1>
      <Link to="/top">ホームページに戻る</Link>
      <h2>{month}月の勤怠サマリー</h2>
      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>曜日</th>
            <th>出勤時間</th>
            <th>特記</th>
            <th>出勤備考</th>
            <th>退勤時間</th>
            <th>特記</th>
            <th>退勤備考</th>
            <th>勤務時間</th>
          </tr>
        </thead>
        <tbody>
          {daysInMonth.map((date) => {
            const record = findAttendanceRecord(date);
            return (
              <tr key={date.toISOString()}>
                <td>{date.toISOString().split('T')[0]}</td>
                <td>{getDayOfWeek(date)}</td>
                <td>{record ? record.check_in_time : '-'}</td>
                <td>{record ? record.remarks1 : '-'}</td>
                <td>{record ? record.remarks2 : '-'}</td>
                <td>{record ? record.check_out_time : '-'}</td>
                <td>{record ? record.out_remarks1 : '-'}</td>
                <td>{record ? record.out_remarks2 : '-'}</td>
                <td>{record && record.work_hours ? `${record.work_hours.hours}時間 ${record.work_hours.minutes}分` : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTablePage;
