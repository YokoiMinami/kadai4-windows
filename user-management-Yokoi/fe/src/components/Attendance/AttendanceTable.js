import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AttendanceTablePage = ({ month }) => {
  const id = localStorage.getItem('user');
  const [userData, setUserData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [overData, setOverData] = useState({});
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [breakTime, setBreakTime] = useState('01:00');
  const [workHours, setWorkHours] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/user/${id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setUserData(data))
      .catch(err => console.log(err));
  }, [id]);

  useEffect(() => {
    const accounts_id = localStorage.getItem('user');
    fetch(`http://localhost:3000/overuser/${accounts_id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setOverData(data);
        if (data.start_time) setStartTime(data.start_time);
        if (data.end_time) setEndTime(data.end_time);
        if (data.break_time) setBreakTime(data.break_time);
        if (data.work_hours) setWorkHours(data.work_hours);
      })
      .catch(err => console.log(err));
  }, [id]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const accounts_id = localStorage.getItem('user');
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
    const days = getDaysInMonth(currentYear, month - 1);
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

  const extractWorkHours = (workHoursString) => {
    const hoursMatch = workHoursString.match(/(\d+) hours/);
    const minutesMatch = workHoursString.match(/(\d+) minutes/);

    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    return { hours, minutes };
  };

  const calculateWorkHours = (start, end) => {
    const startDate = new Date(`1970-01-01T${start}:00`);
    const endDate = new Date(`1970-01-01T${end}:00`);
    const diff = endDate - startDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}時間 ${minutes}分`;
  };

  useEffect(() => {
    if (startTime && endTime) {
      const calculatedWorkHours = calculateWorkHours(startTime, endTime);
      setWorkHours(calculatedWorkHours);
    }
  }, [startTime, endTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accounts_id = localStorage.getItem('user');
    const data = {
      accounts_id,
      start_time: startTime,
      end_time: endTime,
      break_time: breakTime,
      work_hours: workHours
    };

    try {
      const response = await fetch('http://localhost:3000/overtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        alert('データが保存されました');
      } else {
        alert('データの保存に失敗しました');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('データの保存に失敗しました');
    }
  };

  return (
    <div id='table_flex'>
      <div id='table_box1'>
        {userData && <p id='atUser'>ユーザー名: {userData.fullname} さん</p>}
      </div>
      <div id='table_box2'>
        <h1 id='atH1'>勤怠一覧</h1>
        <h2>{month}月</h2>
        <form onSubmit={handleSubmit}>
          <label>
            出勤開始時間:
            <input type='time' value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </label>
          <label>
            退勤時間:
            <input type='time' value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </label>
          <label>
            休憩時間:
            <input type='time' value={breakTime} onChange={(e) => setBreakTime(e.target.value)} />
          </label>
          <label>
            勤務時間:
            <input type='text' value={workHours} readOnly />
          </label>
          <button type='submit'>保存</button>
        </form>
        <div id='atTable'>
          <table className='atTop'>
            <thead className='atTh'>
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
                let workHoursDisplay = '-';
                if (record && record.work_hours) {
                  const { hours, minutes } = extractWorkHours(record.work_hours);
                  workHoursDisplay = `${hours}時間 ${minutes}分`;
                }
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
                    <td>{workHoursDisplay}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div id='overData'>
          <h2>Overtime Data</h2>
          <p>{overData.start_time}</p>
          <p>{overData.end_time}</p>
          <p>{overData.break_time}</p>
          <p>{overData.work_hours}</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTablePage;
