import smtplib

# SMTP server configuration

def send_email(subject,body):
    # Create an SMTP object

 s = smtplib.SMTP('smtp.gmail.com', 587)

# Start TLS for security
 s.starttls()

# Authentication
 s.login("liflynk@gmail.com", "xpju deju dhge hcds")

# Email details
 sender_email = "liflynk@gmail.com"
 receiver_email = "adityakarn0001@gmail.com"
 subject = "Test Email"
 body = "Message_you_need_to_send"

# Adding subject to the message
 message = f"Subject: {subject}\n\n{body}"

# Sending the email
 s.sendmail(sender_email, receiver_email, message)

# Terminating the session
 s.quit()
