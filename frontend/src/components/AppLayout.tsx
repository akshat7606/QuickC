import type { ReactNode } from 'react';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const AppLayout = ({ 
  children, 
  title,
  showHeader = true, 
  showFooter = true 
}: AppLayoutProps) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {showHeader && <AppHeader title={title} />}
      
      <main style={{
        flex: 1,
        paddingTop: showHeader ? '60px' : '0',
        paddingBottom: showFooter ? '80px' : '0',
        overflow: 'auto'
      }}>
        {children}
      </main>
      
      {showFooter && <AppFooter />}
    </div>
  );
};

export default AppLayout;