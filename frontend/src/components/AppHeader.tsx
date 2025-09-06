import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AppHeaderProps {
  title?: string;
  showProfile?: boolean;
  showMenu?: boolean;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
}

const AppHeader = ({ 
  title = "CABA", 
  showProfile = true, 
  showMenu = true,
  onProfileClick,
  onMenuClick 
}: AppHeaderProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleHeaderAction = (action: string) => {
    setShowDropdown(false);
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'history':
        navigate('/history');
        break;
      case 'settings':
        alert('Settings coming soon! Currently using default app preferences.');
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
        if (onProfileClick) onProfileClick();
        break;
    }
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Left side - Logo/Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showMenu && (
          <button
            onClick={onMenuClick}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            ☰
          </button>
        )}
        <div style={{
          fontSize: '20px',
          fontWeight: '700',
          letterSpacing: '1px'
        }}>
          🚗 {title}
        </div>
      </div>

      {/* Right side - Profile */}
      {showProfile && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}
          >
            👤
          </button>
          
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: '180px',
              zIndex: 1001
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}>John Doe</div>
                <div style={{ color: '#666', fontSize: '12px' }}>john@example.com</div>
              </div>
              <div style={{ padding: '8px 0' }}>
                <button
                  onClick={() => handleHeaderAction('profile')}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '12px 16px',
                    textAlign: 'left',
                    color: '#333',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#f8f9fa'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'none'}
                >
                  👤 View Profile
                </button>
                <button
                  onClick={() => handleHeaderAction('history')}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '12px 16px',
                    textAlign: 'left',
                    color: '#333',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#f8f9fa'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'none'}
                >
                  📋 Trip History
                </button>
                <button
                  onClick={() => handleHeaderAction('settings')}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '12px 16px',
                    textAlign: 'left',
                    color: '#333',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#f8f9fa'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'none'}
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={() => handleHeaderAction('logout')}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '12px 16px',
                    textAlign: 'left',
                    color: '#dc3545',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#f8f9fa'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'none'}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default AppHeader;