import { Asset } from "next/font/google";
import Image from "next/image";
import AmcLogo from "../assests/amc-logo.png";
import Amcblue from "../assests/AMC ENGG BLUE.png";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <header>
        <nav className="navbar">
          <div className="logo">Campus Connect</div>
          
          {/* These links will hide on smaller screens due to the CSS media query */}
          <ul className="nav-links">
            <li><a href="#hero">Home</a></li>
            <li><a href="#featu">Features</a></li>
            <li><a href="#not">Notifications</a></li>
            <li><a href="#poll">Poll Pulse</a></li>
            <li><a href="#disc">#Discussions</a></li>
          </ul>

          <div className="nav-buttons">
           <Link href="/admin"><button className="btn-outline">Log In</button></Link> 
            <a className="btn-primary" href="/botpage.html">
              Try Now
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-text">
          <p className="tagline">Your native ChatBot.</p>
          <h1>
            Talk To The <span>B.O.S.S.</span>
          </h1>
          <p className="subtext">B.O.S.S. - Bot for On-campus Student Solutions</p>
        </div>
        <div className="hero-image">
          {/* Use standard img tag if Next/Image is causing layout shifts, or keep Next/Image with responsive props */}
          <Image 
            src={AmcLogo}
            alt="AMC Engineering College Logo"
            width={500}
            height={500}
            style={{ width: '100%', height: 'auto', maxWidth: '450px' }} 
          />
        </div>
      </section>

      <section className="banner" id="featu">
        <p>Timetable confusion? Exam dates? Event updates? Placement alerts?</p>
        <h2>ASK THE B.O.S.S.</h2>
      </section>

      <section className="features">
        <h2>Top Features Of Campus Connect</h2>
        <p>
          From checking class timetables and receiving exam updates to staying informed about college events and
          getting the latest placement alerts, the chatbot ensures you never miss out on anything important...
        </p>
        <div className="feature-logo" style={{display: 'flex', justifyContent: 'center'}}>
          <Image 
            src={Amcblue} 
            alt="AMC Engineering College"
            width={300}
            height={300}
            style={{ width: '100%', height: 'auto', maxWidth: '300px', marginTop: '2rem' }}
          />
        </div>
      </section>

      <section className="chat-examples">
        <h2>ASK ANYTHING. LITERALLY, ANYTHING.</h2>
        <div className="examples">
          <div className="chat-box">B.O.S.S., do we have any fest in this sem atleast?</div>
          <div className="chat-box highlight">Hey, tell me about today’s classes, please.</div>
          <div className="chat-box">What is special in the college canteen today?</div>
        </div>
      </section>

      <section style={{ padding: '2rem 0' }}>
        <iframe src="/notificationcenter.html" width="100%" height="400" style={{ border: "none" }} id="not" title="notifications" />
        <iframe src="/pollpage.html" width="100%" height="500" style={{ border: "none" }} id="poll" title="polls" />
        <iframe src="/campusdiscuss.html" width="100%" height="500" style={{ border: "none" }} id="disc" title="discussions" />
        <iframe src="/issue.html" width="100%" height="500" style={{ border: "none" }} id="issue" title="issues" />
        <iframe src="/poster.html" width="100%" height="700" scrolling="no" style={{ border: "none" }} id="poster" title="posters" />
      </section>

      <section className="pt-0 mt-0 text-center bg-blue-600 text-white py-10 px-5 ">
        <h2>
          Free Trial for your
          <br />
          <span>4 years in campus :)</span>
        </h2>
        <p>Don’t blame us if you take longer to finish your BE Degree.</p>
        <button className="btn-primary" style={{ marginTop: "2rem" }}>
          Ask Campus Connect
        </button>
      </section>

      <footer>
        <div className="footer-left">
          <h3>Campus Connect</h3>
          <p>
            The project Campus Connect is a proposed chatbot for the college website that aims to provide students with
            quick and reliable access to information.
          </p>
        </div>
        <div className="footer-right" id="em">
          <h3>Contact the developers</h3>
          <p><b>Email:</b></p>
          <p>
            1am23cd108@amceducation.in<br />
            1am23cd085@amceducation.in<br />
            1am23cd114@amceducation.in<br />
            1am23cd092@amceducation.in<br />
          </p>
        </div>
      </footer>

      <div className="copyright">© Team B-18</div>
    </>

  );
}
