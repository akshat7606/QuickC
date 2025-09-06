import { useNavigate } from 'react-router-dom';
import AppLayout from './AppLayout';

const MoreScreen = () => {
  const navigate = useNavigate();

  const handleInfoClick = (action: string) => {
    switch (action) {
      case 'about':
        alert('CABA (Compare & Book Rides) is a comprehensive platform that aggregates rides from multiple providers like Uber, Ola, Rapido, and more. We help you find the best ride for your needs!');
        break;
      case 'how-it-works':
        alert('1. Enter your pickup and destination\n2. We search all major ride providers\n3. Compare prices, ETAs, and ratings\n4. Choose your preferred ride\n5. Book directly with the provider');
        break;
      case 'pricing':
        alert('CABA is free to use! We don\'t charge any booking fees. You pay the ride provider directly at their standard rates.');
        break;
      case 'safety':
        alert('Your safety is our priority. All ride providers on our platform maintain their own safety standards and insurance. For emergencies, contact your ride provider directly or call local authorities.');
        break;
      default:
        break;
    }
  };

  const handleContactClick = (type: string) => {
    switch (type) {
      case 'phone':
        window.location.href = 'tel:+919981910866';
        break;
      case 'email':
        window.location.href = 'mailto:support@caba.app?subject=CABA Support Request';
        break;
      case 'website':
        window.open('https://www.caba.app', '_blank');
        break;
      default:
        break;
    }
  };

  const handleLegalClick = (page: string) => {
    switch (page) {
      case 'terms':
        window.open('/terms-of-service.html', '_blank');
        break;
      case 'privacy':
        window.open('/privacy-policy.html', '_blank');
        break;
      case 'cookies':
        alert('We use cookies to improve your experience. Details available in our Privacy Policy.');
        break;
      case 'refund':
        alert('Refund policies are handled by individual ride providers. Contact them directly for cancellations and refunds through their respective apps.');
        break;
      default:
        break;
    }
  };
  return (
    <AppLayout title="More">
      <div className="screen" style={{ padding: '20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>CABA</h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Compare & Book Rides</p>
        </div>

        {/* App Information */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
          {[
            { icon: '📱', title: 'About CABA', subtitle: 'Learn more about our platform', action: 'about' },
            { icon: '🎯', title: 'How it Works', subtitle: 'Compare rides across platforms', action: 'how-it-works' },
            { icon: '💳', title: 'Pricing', subtitle: 'Transparent pricing model', action: 'pricing' },
            { icon: '🛡️', title: 'Safety & Security', subtitle: 'Your safety is our priority', action: 'safety' }
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => handleInfoClick(item.action)}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                background: 'white',
                border: 'none',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#f8f9fa'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'white'}
            >
              <div style={{ fontSize: '24px' }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#333', fontSize: '16px' }}>{item.title}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{item.subtitle}</div>
              </div>
              <div style={{ color: '#ccc', fontSize: '18px' }}>›</div>
            </button>
          ))}
        </div>

        {/* Contact & Support */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#2c3e50', fontSize: '18px' }}>Contact & Support</h3>
            
            <button
              onClick={() => handleContactClick('phone')}
              style={{
                width: '100%',
                marginBottom: '12px',
                padding: '12px',
                background: 'rgba(52,152,219,0.1)',
                border: '1px solid rgba(52,152,219,0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '4px' }}>
                📞 Phone Support
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                Call +91-9981910866 for instant ride booking
              </div>
            </button>

            <button
              onClick={() => handleContactClick('email')}
              style={{
                width: '100%',
                marginBottom: '12px',
                padding: '12px',
                background: 'rgba(46,204,113,0.1)',
                border: '1px solid rgba(46,204,113,0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '4px' }}>
                ✉️ Email Support
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                support@caba.app
              </div>
            </button>

            <button
              onClick={() => handleContactClick('website')}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(155,89,182,0.1)',
                border: '1px solid rgba(155,89,182,0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '4px' }}>
                🌐 Website
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                www.caba.app
              </div>
            </button>
          </div>
        </div>

        {/* Legal */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
          {[
            { title: 'Terms of Service', subtitle: 'Platform usage terms', action: 'terms' },
            { title: 'Privacy Policy', subtitle: 'How we protect your data', action: 'privacy' },
            { title: 'Cookie Policy', subtitle: 'Website cookies information', action: 'cookies' },
            { title: 'Refund Policy', subtitle: 'Cancellation and refunds', action: 'refund' }
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => handleLegalClick(item.action)}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                background: 'white',
                border: 'none',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#f8f9fa'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'white'}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#333', fontSize: '16px' }}>{item.title}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{item.subtitle}</div>
              </div>
              <div style={{ color: '#ccc', fontSize: '18px' }}>›</div>
            </button>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666',
          fontSize: '14px'
        }}>
          <p>© 2024 CABA - Compare & Book Rides</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default MoreScreen;