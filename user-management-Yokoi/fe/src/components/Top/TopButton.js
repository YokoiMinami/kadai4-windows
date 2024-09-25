import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate } from 'react-router-dom';

const TopButton = () => {
  const navigate = useNavigate();
  
  const handleClick1 = () => {
    navigate('/attendance');
  };

  const handleClick2 = () => {
    navigate('/attendance_table');
  };

  const handleClick3 = () => {
    navigate('/equipment');
  };

  const handleClick4 = () => {
    navigate('/account');
  };

  return (
    <div>
      <button className='all_button' onClick={handleClick1}>勤怠登録</button>
      <button className='all_button' onClick={handleClick2}>勤怠一覧</button>
      <button className='all_button' onClick={handleClick3}>機材管理</button>
      <button className='all_button' onClick={handleClick4}>メンバー管理</button>
    </div>
  );
};

export default TopButton;