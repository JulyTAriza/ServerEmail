const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { to, subject, html } = req.body;
  
  // USAR VARIABLES DE ENTORNO
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER || 'notificacionescoingenio@gmail.com',
      pass: process.env.GMAIL_PASS || 'yrtb nbgg yluz ppfz'
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER || 'notificacionescoingenio@gmail.com',
      to,
      subject,
      html
    });
    console.log('✅ Email sent successfully to:', to);
    res.json({ success: true, message: 'Email sent via Gmail' });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('SMTP Proxy is running!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Server running on port', process.env.PORT || 3000);
});