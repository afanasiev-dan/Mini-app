import { useLaunchParams, miniApp, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';

import { routes } from '@/navigation/routes.jsx';

export function App() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>✅ Работает!</h1>
      <p>Mini App загружен.</p>
    </div>
  );
}



    {/* <AppRoot */}
    {/*   appearance={isDark ? 'dark' : 'light'} */}
    {/*   platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'} */}
    {/* > */}
    {/*   <HashRouter> */}
    {/*     <Routes> */}
    {/*       {routes.map((route) => <Route key={route.path} {...route} />)} */}
    {/*       <Route path="*" element={<Navigate to="/"/>}/> */}
    {/*     </Routes> */}
    {/*   </HashRouter> */}
    {/* </AppRoot> */}
