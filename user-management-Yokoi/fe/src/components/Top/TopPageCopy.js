import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate } from 'react-router-dom';
import TopButton from './TopButton';
import OnesLogo from '../../images/ones-logo.png';
import DigitalClock from './DigitalClock';

const TopPageCopy = () => {

  //ユーザー情報
  const id = localStorage.getItem('user');
  const [userData, setUserData] = useState(null);

  //勤怠情報
  const [remarks1, setRemarks1] = useState('');
  const [remarks2, setRemarks2] = useState('');
  const [out_remarks1, setOutRemarks1] = useState('');
  const [out_remarks2, setOutRemarks2] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false); // 出勤状態を管理するフラグ

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
    // 出勤状態を取得するためのAPI呼び出し
    fetch(`http://localhost:3000/attendance/status/${id}`, {
      method: 'get',
      headers: {
      'Content-Type': 'application/json'
    }
    })
      .then(response => response.json())
      .then(data => setIsCheckedIn(data.is_checked_in))
      .catch(err => console.log(err));
  }, [id]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const calculateWorkHours = (checkIn, checkOut) => {
    const checkInTime = new Date(`1970-01-01T${checkIn}:00`);
    const checkOutTime = checkOut ? new Date(`1970-01-01T${checkOut}:00`) : new Date();
    if (isNaN(checkInTime) || isNaN(checkOutTime)) {
      return '0 hours 0 minutes';
    }
    const diff = checkOutTime - checkInTime;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    return `${hours} hours ${minutes} minutes`;
  };
  
  const handleCheckIn = async () => {
    const accounts_id = localStorage.getItem('user');
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0];

    const requestBody = {
      accounts_id,
      date: currentDate,
      check_in_time: currentTime,
      remarks1,
      remarks2
    };

    try {
      const response = await fetch('http://localhost:3000/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const message = await response.text();
      alert(message);
      setIsCheckedIn(true); // 出勤状態を更新
    } catch (error) {
      console.error('Error recording attendance:', error);
    }
  };

  const handleCheckOut = async () => {
    const accounts_id = localStorage.getItem('user');
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0];

    const requestBody = {
      accounts_id,
      date: currentDate,
      check_out_time: currentTime,
      out_remarks1: out_remarks1,
      out_remarks2: out_remarks2
    };

    try {
      const response = await fetch('http://localhost:3000/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const message = await response.text();
      alert(message);
      setIsCheckedIn(false); // 出勤状態を更新
    } catch (error) {
      console.error('Error recording attendance:', error);
    }
  };
  
  return (
    <div className ="top_flex">
      <div className ="box1">
        <TopButton />
        <div id='top_ones_logo'>
          <img src={OnesLogo} alt="Ones" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
        </div>
      </div>
      <div className = "box2">
        <p>{userData.fullname}</p>
        お知らせ
      </div>
      <div className = "box3">
        <h1>勤怠登録</h1>
        <div id = 'top_clock'>
          <DigitalClock />
        </div>
        <div id='top_drop_flex'> 
        {!isCheckedIn ? (
            <>
              <select value={remarks1} onChange={(e) => setRemarks1(e.target.value)}>
                <option value="">選択してください</option>
                <option value="遅刻">遅刻</option>
                <option value="早退">早退</option>
                <option value="休日出勤">休日出勤</option>
              </select>
              <textarea value={remarks2} onChange={(e) => setRemarks2(e.target.value)} />
            </>
          ) : (
            <>
              <select value={out_remarks1} onChange={(e) => setOutRemarks1(e.target.value)}>
                <option value="">選択してください</option>
                <option value="遅刻">遅刻</option>
                <option value="早退">早退</option>
                <option value="休日出勤">休日出勤</option>
              </select>
              <textarea value={out_remarks2} onChange={(e) => setOutRemarks2(e.target.value)} />
            </>
          )}
          <button onClick={isCheckedIn ? handleCheckOut : handleCheckIn}>
            {isCheckedIn ? '退勤' : '出勤'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopPageCopy;