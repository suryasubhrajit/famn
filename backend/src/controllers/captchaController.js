import axios from 'axios';

export const verifyCaptcha = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Captcha token is required' });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // If secret key is not set, use development fallback mode
  if (!secretKey) {
    return res.json({
      success: true,
      score: 0.9,
      mode: 'development_fallback',
      message: 'reCAPTCHA v3 dev mode (no RECAPTCHA_SECRET_KEY set in .env)',
    });
  }

  try {
    // Verify token with Google's reCAPTCHA v3 Verification API
    const googleResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    const { success, score, 'error-codes': errorCodes } = googleResponse.data;

    if (!success || (score !== undefined && score < 0.5)) {
      return res.status(400).json({
        success: false,
        score: score || 0,
        message: 'reCAPTCHA verification failed (possible bot activity)',
        errorCodes,
      });
    }

    return res.json({
      success: true,
      score,
      message: 'reCAPTCHA v3 token verified successfully',
    });
  } catch (err) {
    console.error('[reCAPTCHA Verification Error]', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify reCAPTCHA with Google servers',
    });
  }
};
