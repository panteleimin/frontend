import React from 'react';


export default function Footer() {
  return (
    <footer style={{display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', color: 'white',
         backgroundColor: '#1b2335', padding: '40px', borderTopLeftRadius: '40px', borderTopRightRadius: '40px'
    }}>
        <div>
            © 2026 3D Hub
        </div>
        <div>
            Technical support: pan@gmail.com
        </div>
    </footer>
  );
}