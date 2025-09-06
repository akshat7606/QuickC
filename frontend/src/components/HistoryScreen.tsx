import { useState } from 'react';
import AppLayout from './AppLayout';

interface Booking {
  booking_id: string;
  pickup_location: string;
  drop_location: string;
  driver_name: string;
  fare: number;
  status: string;
  channel: string;
  created_at: string;
}

const HistoryScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!phone) {
      alert('Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/v1/history/${encodeURIComponent(phone)}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'completed': return '#007bff';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <AppLayout title="Trip History">
      <div className="screen">
        <div className="screen-header">
          <h1 className="screen-title">Ride History</h1>
        </div>

      <div className="form-group">
        <label className="form-label">Your Phone Number</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="tel"
            className="form-input"
            placeholder="+91 XXXXX XXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ flex: 1 }}
          />
          <button 
            className="btn btn-primary"
            onClick={fetchHistory}
            disabled={loading}
          >
            {loading ? '...' : 'Load'}
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          {phone ? 'No rides found' : 'Enter your phone number to view history'}
        </div>
      ) : (
        <div>
          {bookings.map((booking) => (
            <div key={booking.booking_id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#1e3c72' }}>
                      {booking.booking_id}
                    </h3>
                    {booking.channel === 'IVR' && (
                      <span style={{ 
                        background: '#e9ecef', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        color: '#495057'
                      }}>
                        📞 Via Call
                      </span>
                    )}
                  </div>
                  
                  <p style={{ margin: '4px 0', fontSize: '14px', color: '#495057' }}>
                    <strong>From:</strong> {booking.pickup_location}
                  </p>
                  {booking.drop_location && (
                    <p style={{ margin: '4px 0', fontSize: '14px', color: '#495057' }}>
                      <strong>To:</strong> {booking.drop_location}
                    </p>
                  )}
                  
                  <p style={{ margin: '4px 0', fontSize: '14px', color: '#495057' }}>
                    <strong>Driver:</strong> {booking.driver_name}
                  </p>
                  
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
                    {formatDate(booking.created_at)}
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e3c72' }}>
                    ₹{booking.fare}
                  </div>
                  <div style={{ 
                    marginTop: '4px',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: getStatusColor(booking.status),
                    background: `${getStatusColor(booking.status)}20`
                  }}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </AppLayout>
  );
};

export default HistoryScreen;