import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  return transporter.sendMail(mailOptions);
};

export const sendAccountCreationEmail = (user) => {
  const subject = 'Account Created';
  const text = `Bienvenue  ${user.email}, votre compte a été créé avec succès !`;
  return sendEmail(user.email, subject, text);
};

export const sendAccountDeletionEmail = async (user) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Suppression de votre compte',
    text: `Bonjour,\n\nVotre compte a bien été supprimé. Si ce n'était pas vous, contactez-nous immédiatement.\n\nCordialement,\nL'équipe To-Do List`
  };
  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = (user, resetToken) => {
  const subject = 'Password Reset Request';
  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
  const text = `Hi ${user.email},\n\nYou requested a password reset. Click the link below to reset your password:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;
  return sendEmail(user.email, subject, text);
};