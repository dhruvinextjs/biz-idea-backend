const User = require('../models/User');
const { sendMail } = require('./mailer');

/**
 * Naya idea create hone par eligible users ko email bhejo
 * @param {Object} idea  - newly created BusinessIdea document
 */
const sendIdeaNotification = async (idea) => {
  try {
    // Sirf wahi users jinhone emailNotifications.newBusinessIdeas = true rakhi ho
    // aur jinke paas valid email ho
    const users = await User.find({
      email: { $exists: true, $ne: null, $ne: '' },
      isActive: true,
      'emailNotifications.newBusinessIdeas': true,
    }).select('email name');

    if (!users.length) {
      console.log('📭 No users with notifications enabled.');
      return;
    }

    // Idea type capitalize karo
    const ideaType = idea.type
      ? idea.type.charAt(0).toUpperCase() + idea.type.slice(1)
      : 'Business';

    // Har user ko individually email bhejo
    const emailPromises = users.map((user) => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: #1a1a2e; padding: 24px 32px; text-align: center; }
            .header h1 { color: #f5a623; margin: 0; font-size: 22px; }
            .body { padding: 32px; }
            .body h2 { color: #1a1a2e; margin-top: 0; }
            .badge { display: inline-block; background: #f5a623; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; margin-bottom: 16px; }
            .idea-box { background: #f9f9f9; border-left: 4px solid #f5a623; padding: 16px 20px; border-radius: 4px; margin: 16px 0; }
            .idea-box p { margin: 6px 0; color: #444; font-size: 14px; }
            .cta { text-align: center; margin: 28px 0 8px; }
            .cta a { background: #f5a623; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px; }
            .footer { background: #f4f4f4; text-align: center; padding: 16px; font-size: 12px; color: #999; }
            .footer a { color: #f5a623; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 TheBizIdeas</h1>
            </div>
            <div class="body">
              <p>Hi <strong>${user.name || 'there'}</strong>,</p>
              <p>A new <strong>${ideaType} Idea</strong> has just been posted on TheBizIdeas!</p>

              <span class="badge">${ideaType} Idea</span>

              <div class="idea-box">
                <p><strong>📌 Title:</strong> ${idea.title}</p>
                ${idea.category ? `<p><strong>📂 Category:</strong> ${idea.category}</p>` : ''}
                ${idea.description ? `<p><strong>📝 Description:</strong> ${idea.description.substring(0, 150)}${idea.description.length > 150 ? '...' : ''}</p>` : ''}
                ${idea.investmentMin && idea.investmentMax ? `<p><strong>💰 Investment:</strong> $${idea.investmentMin.toLocaleString()} - $${idea.investmentMax.toLocaleString()}</p>` : ''}
                ${idea.teamSize ? `<p><strong>👥 Team Size:</strong> ${idea.teamSize}</p>` : ''}
              </div>

              <div class="cta">
                <a href="${process.env.SITE_URL || 'https://yourdomain.com'}/ideas/${idea.slug}">
                  View Full Idea →
                </a>
              </div>
            </div>
            <div class="footer">
              <p>You received this email because you have <strong>New Business Ideas</strong> notifications enabled.</p>
              <p>
                To unsubscribe, go to your
                <a href="${process.env.SITE_URL || 'https://yourdomain.com'}/settings">Settings → Email Notifications</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      return sendMail(
        user.email,
        `💡 New ${ideaType} Idea: ${idea.title} | TheBizIdeas`,
        html
      );
    });

    await Promise.allSettled(emailPromises); // ek fail ho to baaki rukenge nahi
    console.log(`📧 Idea notifications sent to ${users.length} user(s).`);
  } catch (err) {
    console.error('❌ sendIdeaNotification error:', err.message);
  }
};

module.exports = sendIdeaNotification;