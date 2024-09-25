import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate } from 'react-router-dom';

const EquipmentPage = () => (
    <div>
      <h1>機材管理</h1>
      <Link to="/top">Go back to Home Page</Link>
    </div>
  );

export default EquipmentPage;