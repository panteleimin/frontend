import React from 'react';
import ModelViewer from '../ModelViewer'; 

export default function HomePage() {
  return (
    <div>
      <div className='hometop'>
        <h2>{'Welcome to 3D Hub!'}</h2>
      </div>
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-around', flexWrap: 'nowrap' }}>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexWrap: 'wrap'}}>
          <div className='cardhome'>
            <h2>The site is designed for posting 3D models.</h2>
          </div>
          <div className='cardhome'>
            <h2>The site is available in an early</h2>
            <h2>version, not to judge strictly.</h2>
          </div>
        </div>
        <div style={{ height: '500px', borderRadius: '8px' }}>
          <ModelViewer url="/mainmodel/Meshy_AI_Prismatic_Crystal_Dra_0513165102_texture.glb" />        </div>
      </div>
    </div>
  );
}