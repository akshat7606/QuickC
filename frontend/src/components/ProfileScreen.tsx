
import { useNavigate } from 'react-router-dom';
import AppLayout from './AppLayout';

const ProfileScreen = () => {
  const navigate = useNavigate();

  const handleMenuClick = (action: string) => {
    switch (action) {
      case 'trip-history':
        navigate('/history');
        break;
      case 'payment-methods':
        alert('Payment methods coming soon! Currently, all payments are handled by the ride providers directly.');
        break;
      case 'favorites':
        alert('Favorites feature coming soon! You can manually save your frequent locations for now.');
        break;
      case 'offers':
        alert('Offers & Rewards coming soon! Check with individual ride providers for current promotions.');
        break;
      case 'settings':
        alert('Settings coming soon! Currently using default app preferences.');
        break;
      case 'privacy':
        navigate('/more');
        break;
      case 'help':
        window.location.href = 'tel:+919981910866';
        break;
      case 'legal':
        navigate('/more');
        break;
      case 'logout':
        if (confirm('Are you sure you want to logout?')) {
          localStorage.clear();
          sessionStorage.clear();
          navigate('/search');
          alert('Logged out successfully!');
        }
        break;
      default:
        break;
    }
  };
  return (
    <AppLayout title="Profile">
      <div className="screen" style={{ padding: '20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          borderRadius: '12px',
          padding: '24px',
          color: 'white',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            margin: '0 auto 16px'
          }}>
            👤
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>John Doe</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>john@example.com</p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>47</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Trips</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>4.8</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Rating</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700' }}>₹2,340</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Saved</div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
          {[
            { icon: '🚗', title: 'Trip History', subtitle: 'View your past rides', action: 'trip-history' },
            { icon: '💳', title: 'Payment Methods', subtitle: 'Manage cards and payments', action: 'payment-methods' },
            { icon: '⭐', title: 'Favorites', subtitle: 'Saved locations', action: 'favorites' },
            { icon: '🎁', title: 'Offers & Rewards', subtitle: 'Available discounts', action: 'offers' }
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item.action)}
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

        {/* Settings */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
          {[
            { icon: '⚙️', title: 'Settings', subtitle: 'App preferences', action: 'settings' },
            { icon: '🛡️', title: 'Privacy & Safety', subtitle: 'Your safety controls', action: 'privacy' },
            { icon: '❓', title: 'Help & Support', subtitle: 'Get assistance', action: 'help' },
            { icon: '📄', title: 'Legal', subtitle: 'Terms and policies', action: 'legal' }
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item.action)}
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

        {/* Logout */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <button
            onClick={() => handleMenuClick('logout')}
            style={{
              width: '100%',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              color: '#dc3545',
              background: 'white',
              border: 'none',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#f8f9fa'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'white'}
          >
            <div style={{ fontSize: '24px' }}>🚪</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>Logout</div>
            </div>
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfileScreen;