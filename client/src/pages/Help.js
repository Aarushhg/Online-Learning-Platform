import React from 'react';
import './Help.css'; // optional styling

const Help = () => {
  return (
    <div className="help-page">
      <h1>Help & FAQ</h1>

      <section>
        <h2>How do I enroll in a course?</h2>
        <p>You can browse available courses from the Courses page and click "Enroll" to register.</p>
      </section>

      <section>
        <h2>How can I access my dashboard?</h2>
        <p>After logging in, click on your profile icon and select "Dashboard".</p>
      </section>

      <section>
        <h2>What if I forget my password?</h2>
        <p>Click on the "Forgot Password?" link on the login page to reset your password.</p>
      </section>

      <section>
        <h2>Still need help?</h2>
        <p>Contact us via the <a href="/about">Contact page</a>.</p>
      </section>
    </div>
  );
};

export default Help;
