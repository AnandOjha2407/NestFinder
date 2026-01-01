import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import './Help.css'

const Help = () => {
  const faqs = [
    {
      question: "How do I search for properties?",
      answer: "You can use the search bar on the home page or navigate to the Search page. Enter location, property type, or name to find what you're looking for."
    },
    {
      question: "How do I save favorites?",
      answer: "Click the heart icon on any property card to add it to your favorites. You can view all your favorites in the Favorites section."
    },
    {
      question: "How do I contact a property owner?",
      answer: "Click on a property to view details, then use the 'Contact Owner' button to get in touch."
    },
    {
      question: "Can I book a property directly?",
      answer: "Yes! Click on any property and use the 'Book Now' button to start the booking process."
    },
    {
      question: "How do I change my account settings?",
      answer: "Click on your profile in the navbar, then select 'Settings' to customize your preferences."
    }
  ]

  return (
    <div className="help-page">
      <Navbar />
      <div className="help-container">
        <div className="help-header">
          <h1>Help & Support</h1>
          <p>Find answers to common questions</p>
        </div>
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="contact-section">
          <h2>Still need help?</h2>
          <p>Contact our support team</p>
          <div className="contact-info">
            <div className="contact-item">
              <i className='bx bx-envelope'></i>
              <span>support@nestfinder.com</span>
            </div>
            <div className="contact-item">
              <i className='bx bx-phone'></i>
              <span>+91 1234567890</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Help

