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

const putData = (req, res, db) => {
  const { id, fullname, email, phone, password } = req.body;
  db('accounts').where({ id }).update({ fullname, email, phone, password })
    .returning('*')
    .then(item => {
      res.json(item);
    })
    .catch(err => res.status(400).json({
      dbError: 'error'
    }));
}

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

//勤怠
const attData = async (req, res, db) => {
  const { accounts_id, date, check_in_time, check_out_time, work_hours, remarks1, remarks2 } = req.body;

  await db('attendance').insert({ accounts_id, date, check_in_time, check_out_time, work_hours, remarks1, remarks2 })
  .returning('*')
  .then(item => {
  res.json(item);
  })
  .catch(err => res.status(400).json({
      dbError: 'error'
  }));
}

const getAttData = async (req, res, db) => {
  const { accounts_id, month } = req.params;
  try {
    const attendance = await db('attendance')
      .whereRaw('EXTRACT(MONTH FROM date) = ?', [month])
      .andWhere('accounts_id', accounts_id);
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};

module.exports = {
  getData,
  postData,
  putData,
  delData,
  loginData,
  newData,
  attData,
  getAttData
}
  