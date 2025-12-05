import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { recipients, subject, message } = await req.json();

    if (!recipients || recipients.length === 0) {
      return Response.json({ error: "Alıcı listesi boş" }, { status: 400 });
    }

    if (!subject || !message) {
      return Response.json({ error: "Konu ve mesaj gerekli" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Modern, Profesyonel HTML Template
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rosallie Baby - Yeni Mesaj</title>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  
  <div style="padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);">

<!-- Header -->
<div style="background: linear-gradient(135deg, #7B0323 0%, #C70039 100%); padding: 15px 28px; text-align: center; position: relative;">

  <div style="position: absolute; top: -15px; right: -15px; width: 70px; height: 70px; background: rgba(255,255,255,0.08); border-radius: 50%; filter: blur(35px);"></div>
  <div style="position: absolute; bottom: -20px; left: -20px; width: 90px; height: 90px; background: rgba(255,255,255,0.08); border-radius: 50%; filter: blur(40px);"></div>

  <div style="background: #ffffff; border-radius: 16px; padding: 16px; display: inline-block; margin-bottom: 16px; box-shadow: 0 8px 28px rgba(0,0,0,0.10); position: relative; z-index: 1;">
    <img 
      src="cid:modaperde-logo" 
      alt="Moda Perde Logo" 
      style="width: 110px; height: auto; display: block;"
    />
  </div>

  <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px; position: relative; z-index: 1;">
    MODA PERDE
  </h1>

  <p style="margin: 8px 0 0 0; font-size: 14px; color: #ffffff; font-weight: 500; position: relative; z-index: 1;">
    Yaşam Alanlarınıza Şıklık Katan Dokunuşlar
  </p>
</div>

      <div style="padding: 48px 40px;">

        <div style="display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #7B0323 0%, #C70039 100%); color: white; padding: 10px 20px; border-radius: 50px; font-size: 13px; font-weight: 600; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(123, 3, 35, 0.2);">
          <span style="font-size: 18px;">📩</span>
          YENİ MESAJ
        </div>

        <h2 style="color: #222222; font-size: 24px; margin: 0 0 16px 0; font-weight: 700; line-height: 1.3;">
          Yeni Bir İletişim Formu Mesajı Aldınız
        </h2>

        <p style="font-size: 15px; color: #444444; margin: 0 0 32px 0; line-height: 1.7;">
          Web siteniz üzerinden yeni bir mesaj gönderildi. Aşağıda mesajın detaylarını bulabilirsiniz.
        </p>

        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border: 2px solid #e3e3e3; border-radius: 12px; padding: 28px; margin-bottom: 32px; position: relative; overflow: hidden;">
          
          <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(123, 3, 35, 0.05) 0%, rgba(199, 0, 57, 0.05) 100%); border-radius: 0 0 0 100%;"></div>
          
          <div style="position: relative; z-index: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 2px solid #e3e3e3;">
              <span style="font-size: 20px;">💬</span>
              <strong style="font-size: 15px; color: #7B0323; font-weight: 600;">Mesaj İçeriği</strong>
            </div>
            
            <div style="font-size: 15px; color: #222222; line-height: 1.8; white-space: pre-line;">
              ${message}
            </div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #fff9e6 0%, #fff5d9 100%); border-left: 4px solid #ffc107; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 14px; color: #5c4600; line-height: 1.6;">
            <strong>💡 Not:</strong> Bu mesaj otomatik olarak tarafınıza iletilmiştir. Lütfen en kısa sürede müşterinize geri dönüş yapınız.
          </p>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="mailto:modaperdeofficial@gmail.com" style="display: inline-block; background: linear-gradient(135deg, #7B0323 0%, #C70039 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 15px rgba(123, 3, 35, 0.3); transition: all 0.3s;">
            Yanıtla
          </a>
        </div>
      </div>

      <div style="background: #f8f9fa; padding: 32px 40px; text-align: center; border-top: 1px solid #e9ecef;">
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 0 0 12px 0; font-size: 16px; color: #222222; font-weight: 700;">
            Moda Perde
          </p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #444444; line-height: 1.6;">
            📍 Mustafa Kökmen Blv. 91, Gaziantep / Türkiye
          </p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #444444;">
            📞 <a href="tel:+905333874074" style="color: #7B0323; text-decoration: none;">+90 533 387 40 74</a>
          </p>
          <p style="margin: 0; font-size: 14px; color: #444444;">
            ✉️ <a href="mailto:modaperdeofficial@gmail.com" style="color: #7B0323; text-decoration: none;">modaperdeofficial@gmail.com</a>
          </p>
        </div>

        <div style="margin: 20px 0; padding: 20px 0; border-top: 1px solid #e3e3e3; border-bottom: 1px solid #e3e3e3;">
          <p style="margin: 0 0 12px 0; font-size: 13px; color: #666666; font-weight: 600;">
            BİZİ TAKİP EDİN
          </p>
          <div style="display: inline-flex; gap: 12px;"></div>
        </div>

        <p style="margin: 12px 0 0 0; font-size: 12px; color: #555555; line-height: 1.5;">
          Bu e-posta otomatik olarak oluşturulmuştur. Lütfen bu e-postayı yanıtlamayınız.<br/>
          © ${new Date().getFullYear()} Moda Perde. Tüm hakları saklıdır.
        </p>
      </div>

    </div>
  </div>

</body>
</html>

    `;

    await transporter.sendMail({
      from: `"Moda Perde" <${process.env.EMAIL_USER}>`,
      to: recipients.join(", "),
      subject,
      text: message,
      html: htmlTemplate,
      attachments: [
        {
          filename: "logomail.webp", // Filename belirtilmeli ama görünmez
          path: "./public/logo/logomail.webp",
          cid: "modaperde-logo", // Content-ID ile gömülü kullanım
          contentDisposition: "inline", // Inline olarak göm
        },
      ],
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Mail gönderim hatası:", err);
    return Response.json({ error: "Mail gönderilemedi." }, { status: 500 });
  }
}
