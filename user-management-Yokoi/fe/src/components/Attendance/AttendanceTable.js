// import React from 'react';
// import { BrowserRouter as Router, Route, Switch, Link, useNavigate } from 'react-router-dom';

// const AttendanceTablePage = () => (
//     <div>
//       <h1>勤怠一覧</h1>
//       <Link to="/top">Go back to Home Page</Link>
//     </div>
//   );

// export default AttendanceTablePage;

import React, { useEffect, useState } from 'react';

const AttendanceTablePage = ({ month }) => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const accounts_id = localStorage.getItem('user'); // ログインユーザーのIDを取得
      try {
        const response = await fetch(`http://localhost:3000/attendance/${accounts_id}/${month}`);
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };
    fetchAttendance();
  }, [month]);

  return (
    <div>
      <h2>Attendance Summary for Month {month}</h2>
      <ul>
        {attendanceData.map((record) => (
          <li key={record.id}>
            {record.date}: {record.check_in_time} - {record.check_out_time} ({record.work_hours.hours} hours {record.work_hours.minutes} minutes) - {record.remarks1} {record.remarks2}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceTablePage;
