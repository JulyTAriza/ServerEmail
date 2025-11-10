const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// MIDDLEWARES CRÍTICOS
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HEALTH CHECK
app.get('/', (req, res) => {
  res.json({ status: 'SMTP Proxy is running!' });
});

// ENDPOINT DE EMAIL
app.post('/send-email', async (req, res) => {
  console.log('📨 Received email request:', req.body);
  
  try {
    const { to, subject, html } = req.body;
    
    if (!to || !subject || !html) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: to, subject, html' 
      });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER || 'notificacionescoingenio@gmail.com',
        pass: process.env.GMAIL_PASS || 'yrtb nbgg yluz ppfz'
      },
      // CONFIGURACIONES ADICIONALES PARA ESTABILIDAD
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    const mailOptions = {
      from: process.env.GMAIL_USER || 'notificacionescoingenio@gmail.com',
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
    
    res.json({ 
      success: true, 
      message: 'Email sent via Gmail',
      messageId: result.messageId 
    });
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'SMTP Proxy Error' 
    });
  }
});

// MANEJO DE ERRORES
app.use((err, req, res, next) => {
  console.error('🚨 Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SMTP Proxy running on port ${PORT}`);
});