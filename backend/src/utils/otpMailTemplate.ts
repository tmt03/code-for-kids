export const otpMailTemplate = (otp: string, message: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã OTP của bạn</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #eeeeee;
      }
      .header h1 {
        margin: 0;
        color: #333333;
      }
      .content {
        padding: 20px 0;
        text-align: center;
      }
      .content p {
        color: #555555;
        line-height: 1.6;
      }
      .otp-code {
        font-size: 36px;
        font-weight: bold;
        color: #007bff;
        margin: 20px 0;
        letter-spacing: 5px;
      }
      .footer {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid #eeeeee;
        font-size: 12px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Xác thực tài khoản</h1>
      </div>
      <div class="content">
        <p>${message}</p>
        <div class="otp-code">${otp}</div>
        <p>Mã OTP này sẽ hết hạn trong 3 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
      </div>
      <div class="footer">
        <p>Email này được gửi tự động. Vui lòng không trả lời.</p>
        <p>&copy; 2025 Scriptbies. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};
