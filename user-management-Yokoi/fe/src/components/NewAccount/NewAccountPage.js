import React, { useEffect,useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import OnesLogo from '../../images/ones-logo.png';
import AccountLogo from '../../images/account-logo.png';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const NewAccountPage = (props) => {

  const [state, setState] = useState({
    id: 0,
    fullname: '',
    email: '',
    phone: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!state.fullname) newErrors.fullname = '氏名を入力してください';
    if (!state.email) {
      newErrors.email = 'Emailを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      newErrors.email = '有効なEmailを入力してください';
    }
    if (!state.phone) newErrors.phone = '電話番号を入力してください';
    if (!state.password) newErrors.password = 'パスワードを入力してください';
    return newErrors;
  };

  const submitFormAdd = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }
    fetch('http://localhost:3000/post', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullname: state.fullname,
        email: state.email,
        phone: state.phone,
        password: state.password
      })
    })
      .then(response => response.json())
      .then(item => {
        if (item.dbError) {
          if (item.dbError.includes('メールアドレス')) {
            setErrors({ email: 'このメールアドレスは既に登録されています' });
          } else if (item.dbError.includes('電話番号')) {
            setErrors({ phone: 'この電話番号は既に登録されています' });
          }
        } else if (item) {
          const userId = item.map(item => item.id);
          // 登録した情報を表示するページに遷移
          navigate(`/new_account_after/${userId}`); 
        } else {
          console.log('failure');
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div id='new_account_page'>
      <div id='new_account_ones'>
        <img src={OnesLogo} alt="Ones" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
      </div>
      <div id='new_account_logo'>
        <img src={AccountLogo} alt="Account" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
      </div>
      <Form onSubmit={submitFormAdd} className='new_account_form'>
        <FormGroup>
          <label htmlFor="fullname" className='new_account_label'>氏名</label>
          <input type="text" name="fullname" id="fullname" className='new_account_input' onChange={onChange} value={state.fullname || ''} />
          <div className='new_error' id='name_error'>
          {errors.fullname && <p className="error">{errors.fullname}</p>}
          </div>
        </FormGroup>
        <FormGroup>
          <label htmlFor="email" className='new_account_label'>Email</label>
          <input type="email" name="email" id="email" className='new_account_input' onChange={onChange} value={state.email || ''} />
          <div className='new_error' id='email_error'>
          {errors.email && <p className="error">{errors.email}</p>}
          </div>
        </FormGroup>
        <FormGroup>
          <label htmlFor="phone" className='new_account_label'>電話番号</label>
          <input type="text" name="phone" id="phone" className='new_account_input' onChange={onChange} value={state.phone || ''} />
          <div className='new_error' id='phone_error'>
          {errors.phone && <p className="error">{errors.phone}</p>}
          </div>
        </FormGroup>
        <FormGroup>
          <label htmlFor="password" className='new_account_label'>パスワード</label>
          <input type="text" name="password" id="password" className='new_account_input' onChange={onChange} value={state.password || ''} />
          <div className='new_error' id='pass_error'>
          {errors.password && <p className="error">{errors.password}</p>}
          </div>
        </FormGroup>
        <Button className='new_account_button'>登録</Button>
      </Form>
      <div>
        <Link to="/login" id='login_link'>←ログインページ</Link>
      </div>
    </div>
  );
};

export default NewAccountPage;
