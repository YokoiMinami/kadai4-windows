const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey';

const postData = async (req, res, db) => {
  const { fullname, email, phone, password } = req.body;
  const date = new Date();
  const hashedPassword = await bcrypt.hash(password, 10);

  // メールアドレスが既に存在するか確認
  const emailUser = await db('accounts').where({ email }).first();
  // 電話番号が既に存在するか確認
  const phoneUser = await db('accounts').where({ phone }).first();
  if (emailUser) {
    return res.status(400).json({ dbError: 'このメールアドレスは既に登録されています' });
  }else if (phoneUser) {
    return res.status(400).json({ dbError: 'この電話番号は既に登録されています' });
  }

  await db('accounts').insert({ fullname, email, phone, date, password: hashedPassword })
  .returning('*')
  .then(item => {
  res.json(item);
  })
  .catch(err => res.status(400).json({
      dbError: 'error'
  }));
}

const putData = async (req, res, db) => {

  const { id, fullname, email, phone, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  await db('accounts').where({ id }).update({ fullname, email, phone, password: hashedPassword })
  .returning('*')
  .then(item => {
    res.json(item);
  })
  .catch(err => res.status(400).json({
    dbError: 'error'
  }));
}

const loginData = async (req, res, db) => {
  const { email, password } = req.body;
  try {
    const item = await db('accounts').where({ email }).first();
    const user = item.id;
    if (item) {
      const isMatch = await bcrypt.compare(password, item.password);
      if (isMatch) {
        const token = jwt.sign({ id: item.id }, secretKey, { expiresIn: '1h' });
        res.json({ token, user });
      } else {
        res.status(400).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(400).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getData = (req, res, db) => {
  db.select('*').from('accounts')
  .then(items => {
    if (items.length) {
      res.json(items);
    } else {
      res.json({
        dataExists: 'false'
      });
    }
  })
  .catch(err => res.status(400).json({
    dbError: 'error'
  }));
}

const newData = async (req, res, db) => {
  const userId = req.params.id;
  try {
    const item = await db('accounts').where({ id:userId }).first();
    if (item) {
      res.json(item);
    } else {
      res.status(400).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const delData = (req, res, db) => {
  const { id } = req.body;
  db('accounts').where({ id }).del()
  .then(() => {
    res.json({
      delete: 'true'
    });
  })
  .catch(err => res.status(400).json({
    dbError: 'error'
  }));
}

const attData = async (req, res, db) => {
  const { accounts_id, date, check_in_time, check_out_time, break_time, work_hours, remarks1, remarks2, out_remarks1, out_remarks2 } = req.body;

  try {
    const userAttendance = await db('attendance').where({ accounts_id, date }).first();

    if (userAttendance) {
      if (userAttendance.is_checked_in) {
        // 退勤登録
        await db('attendance')
          .where({ accounts_id, date })
          .update({
            check_out_time,
            break_time,
            work_hours,
            out_remarks1,
            out_remarks2,
            is_checked_in: false
          });
        res.status(200).send('退勤登録完了');
      } else {
        res.status(400).send('既に退勤登録されています。');
      }
    } else {
      // 出勤登録
      await db('attendance').insert({
        accounts_id,
        date,
        check_in_time,
        remarks1,
        remarks2,
        is_checked_in: true
      });
      res.status(200).send('出勤登録完了');
    }
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).send('サーバーエラー');
  }
}

const attgetData = async (req, res, db) => {
  const { id } = req.params;
  const today = new Date().toISOString().split('T')[0];

  try {
    const userAttendance = await db('attendance').where({ accounts_id: parseInt(id, 10), date: today }).first();
    if (userAttendance) {
      res.json({ is_checked_in: userAttendance.is_checked_in });
    } else {
      res.json({ is_checked_in: false });
    }
  } catch (error) {
    console.error('Error fetching attendance status:', error);
    res.status(500).send('サーバーエラー');
  }
}

const checkIn = async (req, res, db) => {
  const { accounts_id,date } = req.params;
  try {
    const userAttendance = await db('attendance').where({ accounts_id, date }).first();
    if (userAttendance) {
      res.json({ check_in_time: userAttendance.check_in_time });
    } else {
      res.status(404).send('出勤記録が見つかりません。');
    }
  } catch (error) {
    console.error('Error fetching check-in time:', error);
    res.status(500).send('サーバーエラー');
  }
}

const monthData = async (req, res, db) => {
  const { accounts_id, month } = req.params;
    db('attendance')
    .whereRaw('EXTRACT(MONTH FROM date) = ?', [month])
    .andWhere('accounts_id', accounts_id)
    .then(attendance => {
      res.json(attendance);
    })
    .catch(error => {
      console.error('Error fetching attendance data:', error);
      res.status(500).json({ error: 'Internal server error. Please try again later.' });
    });
};

const overUser = async (req, res, db) => {
  const { accounts_id } = req.params;
  try {
    const item = await db('overdata').where({ accounts_id }).first();
    if (item) {
      res.json( item );
    } else {
      res.status(404).send('保存データが見つかりません。');
    }
  } catch (error) {
    console.error('Error fetching check-in time:', error);
    res.status(500).send('サーバーエラー');
  }
}

const overData = async (req, res, db) => {
  const { accounts_id, start_time, end_time, break_time, work_hours } = req.body;
  const overUser = await db('overdata').where({ accounts_id }).first();
  if(overUser){
    await db('overdata').where({ accounts_id }).update({ start_time, end_time, break_time, work_hours })
    .returning('*')
    .then(item => {
    res.json(item);
    })
    .catch(err => res.status(400).json({
      dbError: 'error'
    }));
  }else {
    await db('overdata').insert({accounts_id, start_time, end_time, break_time, work_hours})
    .returning('*')
    .then(item => {
    res.json(item);
    })
    .catch(err => res.status(400).json({
      dbError: 'error'
    }));
  }
}

module.exports = {
  getData,
  postData,
  putData,
  delData,
  loginData,
  newData,
  attData,
  attgetData,
  checkIn,
  monthData,
  overData,
  overUser
}
  