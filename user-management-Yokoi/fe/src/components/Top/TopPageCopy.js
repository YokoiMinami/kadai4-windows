import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate } from 'react-router-dom';
import TopButton from './TopButton';
import OnesLogo from '../../images/ones-logo.png';
import DigitalClock from './DigitalClock';

const TopPageCopy = () => {

  //特記事項
  const [selectedOption, setSelectedOption] = useState('');
  const pulChange = (event) => {
    setSelectedOption(event.target.value);
  };

  //備考
  const [note, setNote] = useState('');
  const handleChange = (event) => {
    setNote(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`備考: ${note}`);
  };


  return (
    <div class="top_flex">
      <div class="box1">
        <TopButton />
        <div id='top_ones_logo'>
          <img src={OnesLogo} alt="Ones" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
        </div>
      </div>
      <div class = "box2">
        お知らせ
      </div>
      <div class = "box3">
        <h1>勤怠登録</h1>
        <div id = 'top_clock'>
          <DigitalClock />
        </div>
        <div id='top_drop_flex'> 
          <div id='top_drop_text'>
            特記 : 
          </div>
          <div>
            <select id='top_drop_comp' value={selectedOption} onChange={pulChange}>
            <option value="">選択してください</option>
            <option value="option1">遅刻</option>
            <option value="option2">早退</option>
            <option value="option3">休日出勤</option>
            </select>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div id='top_form'>
              <div>
                <label id='top_label'>備考 : </label>
              </div>
              <div>
              <textarea className="textarea-top" value={note} onChange={handleChange} />
              </div>
            </div>
            <button id='top_button' type="submit">出 勤</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TopPageCopy;