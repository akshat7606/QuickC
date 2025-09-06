import { useLocation, useNavigate } from 'react-router-dom';

const AppFooter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'home',
      icon: '🏠',
      label: 'Home',
      path: '/search',
      active: location.pathname === '/search' || location.pathname === '/'
    },
    {
      id: 'history',
      icon: '📋',
      label: 'History',
      path: '/history',
      active: location.pathname === '/history'
    },
    {
      id: 'profile',
      icon: '👤',
      label: 'Profile',
      path: '/profile',
      active: location.pathname === '/profile'
    },
    {
      id: 'more',
      icon: '☰',
      label: 'More',
      path: '/more',
      active: location.pathname === '/more'
    }
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <footer style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '80px',
      background: 'white',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 1000,
      boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.path)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '8px 4px',
            minWidth: '60px',
            transition: 'all 0.2s'
          }}
        >
          <div style={{
            fontSize: '20px',
            marginBottom: '4px',
            filter: tab.active ? 'none' : 'grayscale(0.5)',
            transform: tab.active ? 'scale(1.1)' : 'scale(1)'
          }}>
            {tab.icon}
          </div>
          <div style={{
            fontSize: '11px',
            fontWeight: tab.active ? '600' : '400',
            color: tab.active ? '#007bff' : '#666'
          }}>
            {tab.label}
          </div>
          {tab.active && (
            <div style={{
              width: '6px',
              height: '6px',
              background: '#007bff',
              borderRadius: '50%',
              marginTop: '2px'
            }} />
          )}
        </button>
      ))}
    </footer>
  );
};

export default AppFooter;