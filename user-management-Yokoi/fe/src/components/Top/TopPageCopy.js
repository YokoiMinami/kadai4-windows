// import React, { useEffect,useState } from 'react';
// import { BrowserRouter as Router, Route, Switch, Link, useNavigate } from 'react-router-dom';
// import TopButton from './TopButton';
// import OnesLogo from '../../images/ones-logo.png';
// import DigitalClock from './DigitalClock';

// const TopPageCopy = () => {

//   //ユーザー情報
//   const id = localStorage.getItem('user');
//   const [userData, setUserData] = useState(null);

//   //勤怠情報
//   const [date, setDate] = useState('');
//   const [checkInTime, setCheckInTime] = useState('');
//   const [checkOutTime, setCheckOutTime] = useState('');
//   const [remarks1, setRemarks1] = useState('');
//   const [remarks2, setRemarks2] = useState('');

//   // //特記事項
//   // const [selectedOption, setSelectedOption] = useState('');
//   // const pulChange = (event) => {
//   //   setSelectedOption(event.target.value);
//   // };

//   // //備考
//   // const [note, setNote] = useState('');
//   // const handleChange = (event) => {
//   //   setNote(event.target.value);
//   // };

//   useEffect(() => {
//     fetch(`http://localhost:3000/user/${id}`, {
//       method: 'get',
//       headers: {
//       'Content-Type': 'application/json'
//     }
//     })
//       .then(response => response.json())
//       .then(data => setUserData(data))
//       .catch(err => console.log(err));
//   }, [id]);

//   if (!userData) {
//     return <div>Loading...</div>;
//   }

//   // const handleSubmit = (event) => {
//   //   event.preventDefault();
//   //   alert(`備考: ${note}`);
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const accounts_id = localStorage.getItem('user'); // ログインユーザーのIDを取得
//     const work_hours = calculateWorkHours(checkInTime, checkOutTime); // 勤務時間を計算する関数を実装
//     try {
//       await fetch('http://localhost:3000/attendance', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ accounts_id, date, check_in_time: checkInTime, check_out_time: checkOutTime, work_hours, remarks1, remarks2 })
//       });
//       alert('Attendance recorded');
//     } catch (error) {
//       console.error('Error recording attendance:', error);
//     }
//   };


//   return (
//     <div className ="top_flex">
//       <div className ="box1">
//         <TopButton />
//         <div id='top_ones_logo'>
//           <img src={OnesLogo} alt="Ones" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
//         </div>
//       </div>
//       <div className = "box2">
//         <p>{userData.fullname}</p>
//         お知らせ
//       </div>
//       <div className = "box3">
//         <h1>勤怠登録</h1>
//         <div id = 'top_clock'>
//           <DigitalClock />
//         </div>
//         {/* <div id='top_drop_flex'> 
//           <div id='top_drop_text'>
//             特記 : 
//           </div>
//           <div>
//             <select id='top_drop_comp' value={selectedOption} onChange={pulChange}>
//             <option value="">選択してください</option>
//             <option value="option1">遅刻</option>
//             <option value="option2">早退</option>
//             <option value="option3">休日出勤</option>
//             </select>
//           </div>
//         </div>
//         <div>
//           <form onSubmit={handleSubmit}>
//             <div id='top_form'>
//               <div>
//                 <label id='top_label'>備考 : </label>
//               </div>
//               <div>
//               <textarea className="textarea-top" value={note} onChange={handleChange} />
//               </div>
//             </div>
//             <button id='top_button' type="submit">出 勤</button>
//           </form>
//         </div> */}
//         <form onSubmit={handleSubmit}>
//           <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
//           <input type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} required />
//           <input type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} required />
//           <textarea value={remarks1} onChange={(e) => setRemarks1(e.target.value)} placeholder="Remarks1" />
//           <textarea value={remarks2} onChange={(e) => setRemarks2(e.target.value)} placeholder="Remarks2" />
//           <button type="submit">Record Attendance</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TopPageCopy;







import React, { useEffect,useState } from 'react';

const TopPageCopy = () => {

  //ユーザー情報
  const id = localStorage.getItem('user');
  const [userData, setUserData] = useState(null);

  //勤怠情報
  const [date, setDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [remarks1, setRemarks1] = useState('');
  const [remarks2, setRemarks2] = useState('');

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

  if (!userData) {
    return <div>Loading...</div>;
  }

  const calculateWorkHours = (checkIn, checkOut) => {
    const checkInTime = new Date(`1970-01-01T${checkIn}:00`);
    const checkOutTime = new Date(`1970-01-01T${checkOut}:00`);
    const diff = checkOutTime - checkInTime;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    return `${hours} hours ${minutes} minutes`;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accounts_id = localStorage.getItem('user'); // ログインユーザーのIDを取得
    const work_hours = calculateWorkHours(checkInTime, checkOutTime); // 勤務時間を計算する関数を実装
    try {
      await fetch('http://localhost:3000/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts_id, date, check_in_time: checkInTime, check_out_time: checkOutTime, work_hours, remarks1, remarks2 })
      });
      alert('Attendance recorded');
    } catch (error) {
      console.error('Error recording attendance:', error);
    }
  };


  return (
    <div className ="top_flex">
        <form onSubmit={handleSubmit}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <input type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} required />
          <input type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} required />
          <textarea value={remarks1} onChange={(e) => setRemarks1(e.target.value)} placeholder="Remarks1" />
          <textarea value={remarks2} onChange={(e) => setRemarks2(e.target.value)} placeholder="Remarks2" />
          <button type="submit">Record Attendance</button>
        </form>
      </div>
  );
};

export default TopPageCopy;