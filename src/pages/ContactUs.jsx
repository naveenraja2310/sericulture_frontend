import React from "react";

const ContactUs = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Contact Us</h2>
      <p>Feel free to reach out to us for support or inquiries.</p>

      <div style={{ marginTop: "20px", padding: "16px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff" }}>
        <h3>PKS Solution</h3>
        <p>
          Call: <a href="tel:9999999999">9999999999</a>
        </p>
      </div>

      <div style={{ marginTop: "16px", padding: "16px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff" }}>
        <h3>Yadhronics Private Limited</h3>
        <p>
          Call: <a href="tel:8888888888">8888888888</a>
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
